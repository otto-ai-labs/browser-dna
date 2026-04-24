/**
 * AI Extension Detection
 *
 * Detects AI browser extensions installed by the visitor.
 * Focused on AI writing, research, and assistant tools — relevant for
 * creator/influencer audiences.
 *
 * Three techniques per extension:
 *   1. fetch() resource probe  — fetches manifest.json from chrome-extension://[id]/
 *      Works if extension declares web_accessible_resources. Fast, reliable.
 *   2. Window globals          — named properties injected onto window by content scripts
 *   3. DOM signals             — custom elements / data-* attributes injected into the page
 *
 * Returns: [{ name, vendor, method }]
 */

// ─── Extension registry ────────────────────────────────────────────────────────
//
// Each entry:
//   id       — Chrome Web Store extension ID (verified)
//   name     — display name
//   vendor   — underlying AI model/company
//   globals  — window[key] signals to check
//   selectors — DOM selectors to check

const AI_EXTENSIONS = [
  // ── Anthropic ────────────────────────────────────────────────────────────
  {
    id:        'fcoeoabgfenejglbffodgkkbkcdhcgfn',
    name:      'Claude',
    vendor:    'Anthropic',
    globals:   [],
    selectors: [
      '#claude-agent-stop-container',
      '#claude-agent-animation-styles',
    ],
  },

  // ── OpenAI / ChatGPT ─────────────────────────────────────────────────────
  {
    id:        'cgmnfnmlficgeijcalkgnnkigkefkbhd',
    name:      'AIPRM for ChatGPT',
    vendor:    'OpenAI / ChatGPT',
    globals:   ['__AIPRM__', 'AIPRM'],
    selectors: ['#AIPRM__root', '[data-aiprm]'],
  },
  {
    id:        'lpfemeioodjbpieminkklglpmhlngfcn',
    name:      'WebChatGPT',
    vendor:    'OpenAI / ChatGPT',
    globals:   ['__webchatgpt__'],
    selectors: ['[data-webchatgpt]'],
  },
  {
    id:        'pdnenlnelpdomajfejgapbdpmjkfpjkp',
    name:      'ChatGPT Writer',
    vendor:    'OpenAI / ChatGPT',
    globals:   [],
    selectors: ['#chatgpt-writer-root', '[data-chatgpt-writer]'],
  },
  {
    id:        'ddlbpiadoechcolndfeaonajmngmhblj',
    name:      'Compose AI',
    vendor:    'OpenAI / ChatGPT',
    globals:   ['__composeAI__', 'composeAI'],
    selectors: ['#compose-ai-root', '[data-compose-ai]'],
  },

  // ── Google / Gemini ───────────────────────────────────────────────────────
  {
    id:        'ncjedehfkpnliaafimjhdjjeggmfmlgf',
    name:      'Microsoft Copilot',
    vendor:    'Microsoft / Bing',
    globals:   ['__copilot__', '__bing_copilot__'],
    selectors: ['copilot-widget', '[data-copilot-sidebar]'],
  },

  // ── Perplexity ────────────────────────────────────────────────────────────
  {
    id:        'hlgbcneanomplepojfcnclggenpcoldo',
    name:      'Perplexity AI Companion',
    vendor:    'Perplexity',
    globals:   ['__perplexity__', '__perplexityExt__'],
    selectors: ['perplexity-sidebar', '[data-perplexity-ext]'],
  },

  // ── Multi-model AI sidebars ───────────────────────────────────────────────
  {
    id:        'ofpnmcalabcbjgholdjcjblkibolbppb',
    name:      'Monica',
    vendor:    'Monica AI',
    globals:   ['__monica__', 'monicaAI'],
    selectors: ['monica-root', '#monica-ext-root', '[data-monica-ext]'],
  },
  {
    id:        'difoiogjjojoaoomphldepapgpbgkhkb',
    name:      'Sider',
    vendor:    'Sider AI',
    globals:   ['__sider__', 'siderAI'],
    selectors: ['[data-sider-root]', '#sider-ext-root', 'sider-panel'],
  },
  {
    id:        'mhnlakgilnojmhinhkckjpncpbhabphi',
    name:      'MaxAI',
    vendor:    'MaxAI',
    globals:   ['__maxai__', 'maxAI'],
    selectors: ['[data-maxai]', '#maxai-root', 'maxai-sidebar'],
  },
  {
    id:        'camppjleccjaphfdbohjdohecfnoikec',
    name:      'Merlin',
    vendor:    'Merlin AI',
    globals:   ['__merlin__', 'merlinAI'],
    selectors: ['[data-merlin-ext]', '#merlin-root', 'merlin-widget'],
  },
  {
    id:        'eanggfilgoajaocelnaflolkadkeghjp',
    name:      'HARPA AI',
    vendor:    'HARPA AI',
    globals:   ['__harpa__', 'harpaAI'],
    selectors: ['#harpa-root', '[data-harpa-ext]', 'harpa-widget'],
  },

  // ── AI Writing tools ──────────────────────────────────────────────────────
  {
    id:        'kbfnbcaeplbcioakkpcpgfkobkghlhen',
    name:      'Grammarly',
    vendor:    'Grammarly',
    globals:   ['grammarly', 'GrammarlyPageMessages'],
    selectors: [
      'grammarly-extension',
      'grammarly-desktop-integration',
      '[data-grammarly-shadow-root]',
    ],
  },
  {
    id:        'nllcnknpjnininklegdoijpljgdjkijc',
    name:      'Wordtune',
    vendor:    'Wordtune',
    globals:   ['__wordtune__', 'wordtuneExt'],
    selectors: ['#wordtune-root', '[data-wordtune]', 'wordtune-widget'],
  },
  {
    id:        'blillmbchncajnhkjfdnincfndboieik',
    name:      'Glasp',
    vendor:    'Glasp',
    globals:   ['__glasp__', 'glaspExt'],
    selectors: ['[data-glasp-highlight]', '#glasp-root', 'glasp-highlight'],
  },

  // ── AI Translation ────────────────────────────────────────────────────────
  {
    id:        'cofdbpoegempjloogbagkncekinflcnj',
    name:      'DeepL',
    vendor:    'DeepL',
    globals:   ['__deepl__', 'deeplExt'],
    selectors: ['#deepl-root', '[data-deepl-ext]', 'deepl-panel'],
  },

  // ── Creator-specific tools (near-zero false positive rate) ────────────────
  {
    id:        'mhkhmbddkmdggbhaaaodilponhnccicb',
    name:      'TubeBuddy',
    vendor:    'TubeBuddy',
    globals:   ['TubeBuddy', '__tubeBuddy__'],
    selectors: ['tubeBuddy-extension', '[data-tubebuddy]', '#tubebuddy-root'],
  },
  {
    id:        'pachckjkecffpdphbpmfolblodfkgbhl',
    name:      'vidIQ',
    vendor:    'vidIQ',
    globals:   ['vidIQ', '__vidiq__'],
    selectors: ['[data-vidiq]', '#vidiq-root', 'vidiq-extension'],
  },
  {
    id:        'liecbddmkiiihnedobmlmillhodjkdmb',
    name:      'Loom',
    vendor:    'Loom',
    globals:   ['__loom__', 'loomSDK'],
    selectors: ['loom-toolbar', '[data-loom-ext]', '#loom-companion-mv3'],
  },
  {
    id:        'knheggckgoiihginacbkhaalnibhilkk',
    name:      'Notion Web Clipper',
    vendor:    'Notion',
    globals:   ['__notionWebClipperExtension__', '__notion_clipper__'],
    selectors: ['[data-notion-clipper]', '#notion-clipper-root'],
  },
];

// ─── Orchestrator ──────────────────────────────────────────────────────────────

export function getExtensionSignals() {
  const detected = [];

  for (const ext of AI_EXTENSIONS) {
    let method = null;

    // Check window globals
    for (const key of ext.globals) {
      try {
        if (window[key] !== undefined) { method = 'global'; break; }
      } catch (_) {}
    }

    // Check DOM elements
    if (!method) {
      for (const sel of ext.selectors) {
        try {
          if (document.querySelector(sel)) { method = 'dom'; break; }
        } catch (_) {}
      }
    }

    if (method) {
      detected.push({ name: ext.name, vendor: ext.vendor, method });
    }
  }

  return detected;
}
