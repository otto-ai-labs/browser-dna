const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');

const BANNER = '/* @ottoai/browser-dna — Visitor Intelligence Script | https://github.com/ottoai/browser-dna */';

// ── 1. Browser IIFE — self-initializing <script> tag ──────────────────────────
const iifeOptions = {
  entryPoints: ['src/index.js'],
  bundle:      true,
  minify:      true,
  target:      'es2018',
  outfile:     'dist/browser-dna.js',
  platform:    'browser',
  format:      'iife',
  globalName:  'BrowserDNA',
  define:      { 'process.env.NODE_ENV': '"production"' },
  banner:      { js: BANNER },
};

// ── 2. ESM bundle — for npm / bundlers ────────────────────────────────────────
const esmOptions = {
  entryPoints: ['src/npm.js'],
  bundle:      true,
  minify:      false,   // keep readable for npm consumers
  target:      'es2020',
  outfile:     'dist/browser-dna.esm.js',
  platform:    'browser',
  format:      'esm',
  banner:      { js: BANNER },
  // Mark thumbmarkjs as external so npm consumers can manage it themselves
  // or bundle it in — currently bundled in for simplicity
};

async function build() {
  await Promise.all([
    esbuild.build(iifeOptions),
    esbuild.build(esmOptions),
  ]);
  console.log('Build complete:');
  console.log('  dist/browser-dna.js      (IIFE  — browser <script> tag)');
  console.log('  dist/browser-dna.esm.js  (ESM   — npm / bundlers)');
}

async function watch() {
  const [iifeCtx, esmCtx] = await Promise.all([
    esbuild.context(iifeOptions),
    esbuild.context(esmOptions),
  ]);
  await Promise.all([iifeCtx.watch(), esmCtx.watch()]);
  console.log('Watching for changes...');
}

if (isWatch) {
  watch().catch(() => process.exit(1));
} else {
  build().catch(() => process.exit(1));
}
