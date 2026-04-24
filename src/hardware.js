/**
 * Hardware & media capability signals
 *
 * Detects:
 *   - GPU renderer (WebGL) — identifies pro creative machines
 *   - Display type — Retina/4K, ultrawide, tablet
 *   - Media devices — mic/camera count signals streaming/podcast setup
 *   - Font probing — detects Adobe/design fonts via Canvas API
 */

// ─── GPU / WebGL renderer ─────────────────────────────────────────────────────

export function getGPUInfo() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { renderer: null, vendor: null, tier: null };

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return { renderer: null, vendor: null, tier: null };

    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || null;
    const vendor   = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)   || null;

    return { renderer, vendor, tier: classifyGPU(renderer) };
  } catch (_) {
    return { renderer: null, vendor: null, tier: null };
  }
}

function classifyGPU(renderer) {
  if (!renderer) return null;
  const r = renderer.toLowerCase();

  // Apple Silicon — strong creative pro signal
  if (r.includes('apple m')) return 'apple-silicon';

  // High-end NVIDIA — video editor or gamer
  if (r.match(/rtx\s*(3|4)\d{3}/)) return 'high-end-nvidia';
  if (r.match(/rtx\s*(2)\d{3}/))   return 'mid-high-nvidia';
  if (r.includes('quadro'))         return 'workstation-nvidia';

  // AMD high-end
  if (r.match(/rx\s*(6|7)\d{3}/))  return 'high-end-amd';
  if (r.includes('radeon pro'))     return 'workstation-amd';

  // Intel integrated — budget/ultrabook
  if (r.includes('intel iris') || r.includes('intel hd') || r.includes('intel uhd')) return 'integrated-intel';

  // Apple older
  if (r.includes('apple gpu') || r.includes('apple a')) return 'apple-mobile';

  return 'unknown';
}

// ─── Display signals ──────────────────────────────────────────────────────────

export function getDisplayInfo() {
  const w = screen.width;
  const h = screen.height;
  const dpr = window.devicePixelRatio || 1;
  const isRetina = dpr >= 2;
  const isTouch = navigator.maxTouchPoints > 0;

  let displayType = 'standard';
  if (w >= 3440)                      displayType = 'ultrawide';
  else if (w >= 2560)                 displayType = 'large-monitor';
  else if (w >= 1920 && isRetina)     displayType = '4k-retina';
  else if (w >= 1440 && isRetina)     displayType = 'retina-laptop';
  else if (isTouch && w >= 1024)      displayType = 'tablet';
  else if (w < 768)                   displayType = 'mobile';

  return {
    width:       w,
    height:      h,
    dpr:         dpr,
    isRetina,
    isTouch,
    displayType,
  };
}

// ─── Media devices ────────────────────────────────────────────────────────────

export async function getMediaDeviceInfo() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return { audioInputs: null, videoInputs: null, hasProAudio: false, hasProVideo: false };
    }

    const devices = await navigator.mediaDevices.enumerateDevices();

    // Without permission, labels are empty but device count is still available
    const audioInputs = devices.filter(d => d.kind === 'audioinput').length;
    const videoInputs = devices.filter(d => d.kind === 'videoinput').length;

    // Labels only available after getUserMedia permission — use them if present
    const audioLabels = devices
      .filter(d => d.kind === 'audioinput' && d.label)
      .map(d => d.label.toLowerCase());

    const videoLabels = devices
      .filter(d => d.kind === 'videoinput' && d.label)
      .map(d => d.label.toLowerCase());

    // Pro audio signals: multiple inputs, or named interfaces (Focusrite, Rode, etc.)
    const proAudioKeywords = ['focusrite', 'scarlett', 'rode', 'blue yeti', 'shure', 'audio-technica', 'steinberg', 'universal audio', 'motu', 'zoom'];
    const hasProAudio = audioInputs >= 2 ||
      audioLabels.some(l => proAudioKeywords.some(k => l.includes(k)));

    // Pro video signals: multiple cameras, or named capture cards
    const proVideoKeywords = ['elgato', 'capture', 'cam link', 'magewell', 'blackmagic', 'obs', 'dslr', 'mirrorless'];
    const hasProVideo = videoInputs >= 2 ||
      videoLabels.some(l => proVideoKeywords.some(k => l.includes(k)));

    return {
      audioInputs,
      videoInputs,
      hasProAudio,
      hasProVideo,
      // Only include labels if available (requires permission)
      audioLabels: audioLabels.length ? audioLabels : undefined,
      videoLabels: videoLabels.length ? videoLabels : undefined,
    };
  } catch (_) {
    return { audioInputs: null, videoInputs: null, hasProAudio: false, hasProVideo: false };
  }
}

// ─── Font probing ─────────────────────────────────────────────────────────────
// Uses Canvas measureText to detect whether a font is installed.
// If the test font renders differently from the fallback, it's installed.

const BASELINE_FONT = 'monospace';
const TEST_STRING   = 'mmmmmmmmmmlli';
const TEST_SIZE     = '72px';

function isFontInstalled(fontName) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    ctx.font = `${TEST_SIZE} ${BASELINE_FONT}`;
    const baseWidth = ctx.measureText(TEST_STRING).width;

    ctx.font = `${TEST_SIZE} "${fontName}", ${BASELINE_FONT}`;
    const testWidth = ctx.measureText(TEST_STRING).width;

    return testWidth !== baseWidth;
  } catch (_) {
    return false;
  }
}

// Fonts strongly associated with designers / creative professionals
const CREATOR_FONTS = [
  // Adobe / premium
  { font: 'Adobe Caslon Pro',    signal: 'adobe-suite' },
  { font: 'Proxima Nova',        signal: 'premium-fonts' },
  { font: 'Futura PT',           signal: 'premium-fonts' },
  { font: 'Gotham',              signal: 'premium-fonts' },
  { font: 'Brandon Grotesque',   signal: 'premium-fonts' },
  { font: 'Neue Haas Grotesk',   signal: 'premium-fonts' },
  // Widely used by creators/designers
  { font: 'Lato',                signal: 'google-fonts-user' },
  { font: 'Montserrat',          signal: 'google-fonts-user' },
  { font: 'Raleway',             signal: 'google-fonts-user' },
  { font: 'Playfair Display',    signal: 'google-fonts-user' },
  // Developer fonts (signals technical creator)
  { font: 'JetBrains Mono',      signal: 'developer' },
  { font: 'Fira Code',           signal: 'developer' },
  { font: 'Cascadia Code',       signal: 'developer' },
  { font: 'SF Mono',             signal: 'apple-developer' },
];

export function getFontSignals() {
  const detected = [];
  const signals  = new Set();

  for (const { font, signal } of CREATOR_FONTS) {
    if (isFontInstalled(font)) {
      detected.push(font);
      signals.add(signal);
    }
  }

  return {
    detectedFonts: detected,
    signals: Array.from(signals),
  };
}

// ─── AudioContext signals ─────────────────────────────────────────────────────
// No permissions needed. Reveals pro audio interface presence via OS audio graph.

export function getAudioContextSignals() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const signals = {
      sampleRate:      ctx.sampleRate,                    // 44100=built-in, 48000/96000=pro interface
      maxChannelCount: ctx.destination.maxChannelCount,   // >2 = multi-channel interface
      baseLatency:     ctx.baseLatency != null ? Math.round(ctx.baseLatency * 1000) : null, // ms
    };
    ctx.close();

    // Classify
    let audioTier = 'consumer';
    if (signals.maxChannelCount > 2 || signals.sampleRate >= 96000) audioTier = 'pro-interface';
    else if (signals.sampleRate === 48000)                           audioTier = 'pro-or-interface';

    return { ...signals, audioTier };
  } catch (_) {
    return null;
  }
}

// ─── CSS media query signals ──────────────────────────────────────────────────
// Synchronous, zero cost, no permissions.

export function getDisplayQualitySignals() {
  const mq = (q) => { try { return window.matchMedia(q).matches; } catch (_) { return false; } };
  return {
    p3ColorGamut:  mq('(color-gamut: p3)'),        // Apple/pro display
    hdrDisplay:    mq('(dynamic-range: high)'),     // HDR-capable display
    darkMode:      mq('(prefers-color-scheme: dark)'),
    hoverDevice:   mq('(hover: hover)'),            // mouse/trackpad (not touch)
    finePointer:   mq('(pointer: fine)'),           // precise pointer = desktop
  };
}

// ─── Permissions API ──────────────────────────────────────────────────────────
// Reads already-granted permissions — no prompts fired.
// 'granted' on mic/camera means user previously allowed a recording tool.

export async function getPermissionSignals() {
  const query = async (name) => {
    try {
      const s = await navigator.permissions.query({ name });
      return s.state; // 'granted' | 'denied' | 'prompt'
    } catch (_) {
      return null;
    }
  };

  const [microphone, camera, notifications] = await Promise.all([
    query('microphone'),
    query('camera'),
    query('notifications'),
  ]);

  return {
    microphone,
    camera,
    notifications,
    // Convenience flag: mic or camera already granted = likely used recording tool
    hasRecordingAccess: microphone === 'granted' || camera === 'granted',
  };
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export async function getHardwareSignals() {
  const [media, permissions] = await Promise.all([
    getMediaDeviceInfo(),
    getPermissionSignals(),
  ]);
  const gpu          = getGPUInfo();
  const display      = getDisplayInfo();
  const displayQuality = getDisplayQualitySignals();
  const fonts        = getFontSignals();
  const audioContext = getAudioContextSignals();

  return { gpu, display, displayQuality, audioContext, media, permissions, fonts };
}
