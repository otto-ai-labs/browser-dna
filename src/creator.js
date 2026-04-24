/**
 * Creator & influencer signal detection
 *
 * Detects:
 *   - Creator platform referrers (YouTube Studio, Substack, Gumroad, etc.)
 *   - Link-in-bio tool referrers (Linktree, Beacons, Stan Store, etc.)
 *   - UTM patterns common to creator traffic (bio links, newsletters, podcasts)
 *   - Creator sophistication tier based on monetization platform
 */

// ─── Creator platform referrers ───────────────────────────────────────────────

const CREATOR_PLATFORM_MAP = {
  // Video
  'studio.youtube.com':     { platform: 'YouTube Studio',   type: 'video',      tier: 'active-creator' },
  'youtube.com':            { platform: 'YouTube',           type: 'video',      tier: 'viewer' },
  'vimeo.com':              { platform: 'Vimeo',             type: 'video',      tier: 'active-creator' },
  'streamyard.com':         { platform: 'StreamYard',        type: 'video',      tier: 'active-creator' },
  'riverside.fm':           { platform: 'Riverside',         type: 'podcast',    tier: 'active-creator' },
  'buzzsprout.com':         { platform: 'Buzzsprout',        type: 'podcast',    tier: 'active-creator' },
  'anchor.fm':              { platform: 'Anchor/Spotify',    type: 'podcast',    tier: 'active-creator' },
  'podcasters.spotify.com': { platform: 'Spotify Podcasts', type: 'podcast',    tier: 'active-creator' },

  // Writing / newsletters
  'substack.com':           { platform: 'Substack',          type: 'newsletter', tier: 'active-creator' },
  'beehiiv.com':            { platform: 'Beehiiv',           type: 'newsletter', tier: 'active-creator' },
  'convertkit.com':         { platform: 'ConvertKit',        type: 'newsletter', tier: 'active-creator' },
  'ck.page':                { platform: 'ConvertKit',        type: 'newsletter', tier: 'active-creator' },
  'mailchimp.com':          { platform: 'Mailchimp',         type: 'newsletter', tier: 'active-creator' },
  'medium.com':             { platform: 'Medium',            type: 'blog',       tier: 'writer' },
  'ghost.io':               { platform: 'Ghost',             type: 'blog',       tier: 'active-creator' },
  'hashnode.com':           { platform: 'Hashnode',          type: 'blog',       tier: 'writer' },
  'dev.to':                 { platform: 'Dev.to',            type: 'blog',       tier: 'writer' },

  // Creator commerce / monetization
  'gumroad.com':            { platform: 'Gumroad',           type: 'commerce',   tier: 'monetized' },
  'stan.store':             { platform: 'Stan Store',        type: 'commerce',   tier: 'monetized' },
  'patreon.com':            { platform: 'Patreon',           type: 'membership', tier: 'monetized' },
  'ko-fi.com':              { platform: 'Ko-fi',             type: 'membership', tier: 'monetized' },
  'buymeacoffee.com':       { platform: 'Buy Me a Coffee',   type: 'membership', tier: 'monetized' },
  'lemon.squeezy.com':      { platform: 'Lemon Squeezy',     type: 'commerce',   tier: 'monetized' },
  'lemonsqueezy.com':       { platform: 'Lemon Squeezy',     type: 'commerce',   tier: 'monetized' },
  'whop.com':               { platform: 'Whop',              type: 'community',  tier: 'monetized' },
  'skool.com':              { platform: 'Skool',             type: 'community',  tier: 'monetized' },
  'circle.so':              { platform: 'Circle',            type: 'community',  tier: 'monetized' },
  'podia.com':              { platform: 'Podia',             type: 'course',     tier: 'monetized' },
  'teachable.com':          { platform: 'Teachable',         type: 'course',     tier: 'monetized' },
  'kajabi.com':             { platform: 'Kajabi',            type: 'course',     tier: 'monetized' },
  'thinkific.com':          { platform: 'Thinkific',         type: 'course',     tier: 'monetized' },

  // Design / content tools
  'canva.com':              { platform: 'Canva',             type: 'design',     tier: 'active-creator' },
  'figma.com':              { platform: 'Figma',             type: 'design',     tier: 'active-creator' },
  'notion.so':              { platform: 'Notion',            type: 'productivity', tier: 'active-creator' },

  // Social scheduling
  'later.com':              { platform: 'Later',             type: 'scheduler',  tier: 'active-creator' },
  'buffer.com':             { platform: 'Buffer',            type: 'scheduler',  tier: 'active-creator' },
  'hootsuite.com':          { platform: 'Hootsuite',         type: 'scheduler',  tier: 'active-creator' },
  'metricool.com':          { platform: 'Metricool',         type: 'scheduler',  tier: 'active-creator' },
  'planoly.com':            { platform: 'Planoly',           type: 'scheduler',  tier: 'active-creator' },
};

// ─── Link-in-bio referrers ────────────────────────────────────────────────────
// Tells you both the traffic source AND the creator's sophistication level

const LINK_IN_BIO_MAP = {
  'linktr.ee':              { tool: 'Linktree',      tier: 'beginner' },
  'linktree.com':           { tool: 'Linktree',      tier: 'beginner' },
  'beacons.ai':             { tool: 'Beacons',       tier: 'intermediate' },
  'beacons.page':           { tool: 'Beacons',       tier: 'intermediate' },
  'stan.store':             { tool: 'Stan Store',    tier: 'monetized' },
  'bio.site':               { tool: 'Bio.site',      tier: 'beginner' },
  'later.com':              { tool: 'Later Link',    tier: 'intermediate' },
  'koji.com':               { tool: 'Koji',          tier: 'intermediate' },
  'campsite.bio':           { tool: 'Campsite',      tier: 'intermediate' },
  'contra.com':             { tool: 'Contra',        tier: 'freelancer' },
  'carrd.co':               { tool: 'Carrd',         tier: 'intermediate' },
  'milkshake.app':          { tool: 'Milkshake',     tier: 'beginner' },
  'taplink.cc':             { tool: 'Taplink',       tier: 'beginner' },
  'snipfeed.co':            { tool: 'Snipfeed',      tier: 'monetized' },
  'fanlink.tv':             { tool: 'Fanlink',       tier: 'intermediate' },
  'withkoji.com':           { tool: 'Koji',          tier: 'intermediate' },
};

// ─── UTM source patterns ──────────────────────────────────────────────────────

const UTM_SOURCE_MAP = {
  // Social bio traffic
  'instagram':      { source: 'Instagram Bio',      channel: 'social' },
  'tiktok':         { source: 'TikTok Bio',          channel: 'social' },
  'twitter':        { source: 'Twitter/X Bio',       channel: 'social' },
  'x':              { source: 'Twitter/X Bio',       channel: 'social' },
  'youtube':        { source: 'YouTube Description', channel: 'video' },
  'linkedin':       { source: 'LinkedIn Bio',        channel: 'social' },
  'pinterest':      { source: 'Pinterest',           channel: 'social' },
  // Content channels
  'newsletter':     { source: 'Newsletter',          channel: 'email' },
  'email':          { source: 'Email',               channel: 'email' },
  'substack':       { source: 'Substack',            channel: 'newsletter' },
  'beehiiv':        { source: 'Beehiiv',             channel: 'newsletter' },
  'podcast':        { source: 'Podcast',             channel: 'audio' },
  'spotify':        { source: 'Spotify',             channel: 'audio' },
  // Link-in-bio tools as UTM sources
  'linktree':       { source: 'Linktree',            channel: 'bio-link' },
  'beacons':        { source: 'Beacons',             channel: 'bio-link' },
  'stan':           { source: 'Stan Store',          channel: 'bio-link' },
  // AI (already in ai.js but repeated for completeness)
  'chatgpt':        { source: 'ChatGPT',             channel: 'ai' },
};

const UTM_MEDIUM_MAP = {
  'bio':            'bio-link',
  'bio_link':       'bio-link',
  'link_in_bio':    'bio-link',
  'linkinbio':      'bio-link',
  'social':         'social',
  'email':          'email',
  'newsletter':     'newsletter',
  'podcast':        'podcast',
  'video':          'video',
  'description':    'video-description',
};

// ─── Detection functions ──────────────────────────────────────────────────────

export function detectCreatorReferrer() {
  const raw = document.referrer;
  if (!raw) return null;

  try {
    const hostname = new URL(raw).hostname.replace(/^www\./, '');

    // Check link-in-bio first (more specific)
    if (LINK_IN_BIO_MAP[hostname]) {
      return {
        type: 'bio-link',
        ...LINK_IN_BIO_MAP[hostname],
        raw,
      };
    }

    // Check creator platforms
    if (CREATOR_PLATFORM_MAP[hostname]) {
      return {
        type: 'creator-platform',
        ...CREATOR_PLATFORM_MAP[hostname],
        raw,
      };
    }
  } catch (_) {}

  return null;
}

export function detectUTMSignals() {
  try {
    const params = new URLSearchParams(window.location.search);
    const source = (params.get('utm_source') || '').toLowerCase();
    const medium = (params.get('utm_medium') || '').toLowerCase();
    const campaign = params.get('utm_campaign') || null;
    const content = params.get('utm_content') || null;

    if (!source && !medium && !campaign) return null;

    return {
      source:   UTM_SOURCE_MAP[source] || (source || null),
      medium:   UTM_MEDIUM_MAP[medium] || (medium || null),
      campaign,
      content,
    };
  } catch (_) {
    return null;
  }
}

export function detectCreatorTier(referrer, utm) {
  // Infer creator tier from strongest available signal
  if (referrer?.tier === 'monetized') return 'monetized';
  if (referrer?.tier === 'active-creator') return 'active-creator';
  if (utm?.source?.channel === 'bio-link') return 'has-bio-link';
  if (utm?.source?.channel === 'newsletter') return 'has-newsletter';
  if (referrer?.tier === 'writer') return 'writer';
  if (referrer?.tier === 'beginner') return 'beginner';
  return null;
}

// ─── localStorage key probing ─────────────────────────────────────────────────
// Extensions write persistence keys to the page's localStorage.
// These survive across page loads and are readable without any permissions.
// vidIQ and TubeBuddy keys have near-zero false positive rate.

const CREATOR_STORAGE_KEYS = [
  // YouTube creator tools — extremely high specificity
  { key: 'vidiq_user_uuid',          tool: 'vidIQ',               confidence: 'high' },
  { key: 'vidiq_settings',           tool: 'vidIQ',               confidence: 'high' },
  { key: 'tubeBuddy_user',           tool: 'TubeBuddy',           confidence: 'high' },
  // Screen recording / async video
  { key: 'loom_user_id',             tool: 'Loom',                confidence: 'high' },
  { key: 'loom_access_token_expiry', tool: 'Loom',                confidence: 'high' },
  // Writing tools
  { key: 'grammarly-user',           tool: 'Grammarly',           confidence: 'medium' },
  { key: 'grammarly-session-id',     tool: 'Grammarly',           confidence: 'medium' },
  // Productivity / clipping
  { key: 'notion_clipper_auth',      tool: 'Notion Web Clipper',  confidence: 'high' },
  // Social scheduling
  { key: '__buffer_extension',       tool: 'Buffer',              confidence: 'medium' },
  { key: 'later_ext_user',           tool: 'Later',               confidence: 'medium' },
];

export function detectCreatorStorageKeys() {
  const found = [];
  for (const entry of CREATOR_STORAGE_KEYS) {
    try {
      const val = localStorage.getItem(entry.key);
      if (val !== null) found.push({ tool: entry.tool, confidence: entry.confidence });
    } catch (_) {}
  }
  return found.length ? found : null;
}

export function getCreatorSignals() {
  const referrer   = detectCreatorReferrer();
  const utm        = detectUTMSignals();
  const tier       = detectCreatorTier(referrer, utm);
  const storageHits = detectCreatorStorageKeys();

  return { referrer, utm, tier, storageHits };
}
