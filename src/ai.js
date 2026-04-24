/**
 * AI tool detection
 * - Maps referrer to AI tools
 * - Checks utm_source param (ChatGPT auto-appends this)
 * - Inspects DOM for injected globals and custom elements from AI extensions
 */

const AI_REFERRER_MAP = {
  'chatgpt.com':             'ChatGPT',
  'chat.openai.com':         'ChatGPT',
  'claude.ai':               'Claude',
  'perplexity.ai':           'Perplexity',
  'gemini.google.com':       'Google Gemini',
  'bard.google.com':         'Google Gemini',
  'copilot.microsoft.com':   'Microsoft Copilot',
  'bing.com':                'Microsoft Copilot',
  'grok.com':                'Grok',
  'grok.x.ai':               'Grok',
  'meta.ai':                 'Meta AI',
  'you.com':                 'You.com',
  'phind.com':               'Phind',
  'poe.com':                 'Poe',
  'character.ai':            'Character.AI',
  'mistral.ai':              'Mistral',
  'huggingface.co':          'HuggingFace',
  'groq.com':                'Groq',
};

const AI_UTM_SOURCES = {
  'chatgpt':   'ChatGPT',
  'claude':    'Claude',
  'perplexity':'Perplexity',
  'gemini':    'Google Gemini',
  'copilot':   'Microsoft Copilot',
  'grok':      'Grok',
  'meta-ai':   'Meta AI',
};

// Globals injected by AI browser extensions
const AI_EXTENSION_GLOBALS = [
  { key: '__claude__',              label: 'Claude Extension' },
  { key: '__chatgpt__',             label: 'ChatGPT Extension' },
  { key: '__copilot__',             label: 'Microsoft Copilot Extension' },
  { key: '__gemini_extension__',    label: 'Gemini Extension' },
  { key: '__perplexity__',          label: 'Perplexity Extension' },
  { key: '__monica__',              label: 'Monica Extension' },
  { key: '__sider__',               label: 'Sider Extension' },
  { key: '__maxai__',               label: 'MaxAI Extension' },
];

// Custom elements injected by AI extensions
const AI_EXTENSION_ELEMENTS = [
  { selector: 'claude-assistant',     label: 'Claude Extension' },
  { selector: 'chatgpt-sidebar',      label: 'ChatGPT Extension' },
  { selector: 'copilot-widget',       label: 'Microsoft Copilot Extension' },
  { selector: 'perplexity-sidebar',   label: 'Perplexity Extension' },
  { selector: 'monica-root',          label: 'Monica Extension' },
  { selector: '[data-sider-root]',    label: 'Sider Extension' },
  { selector: '[data-maxai]',         label: 'MaxAI Extension' },
];

export function detectAIReferrer() {
  // Check utm_source param first (ChatGPT auto-appends)
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = (params.get('utm_source') || '').toLowerCase();
    if (utmSource && AI_UTM_SOURCES[utmSource]) {
      return AI_UTM_SOURCES[utmSource];
    }
  } catch (_) {}

  // Check document.referrer
  const raw = document.referrer;
  if (!raw) return null;

  try {
    const hostname = new URL(raw).hostname.replace(/^www\./, '');
    return AI_REFERRER_MAP[hostname] || null;
  } catch (_) {
    return null;
  }
}

export function detectAIExtensions() {
  const found = [];

  for (const { key, label } of AI_EXTENSION_GLOBALS) {
    try {
      if (window[key] !== undefined) found.push(label);
    } catch (_) {}
  }

  for (const { selector, label } of AI_EXTENSION_ELEMENTS) {
    try {
      if (document.querySelector(selector)) {
        if (!found.includes(label)) found.push(label);
      }
    } catch (_) {}
  }

  return found;
}

export function getAISignals() {
  return {
    referrer: detectAIReferrer(),
    extensions: detectAIExtensions(),
  };
}
