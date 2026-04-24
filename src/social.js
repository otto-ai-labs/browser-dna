/**
 * Social platform detection
 * - Detects in-app browsers from User-Agent tokens
 * - Maps document.referrer hostnames to social platforms
 */

const IN_APP_BROWSER_TOKENS = [
  { token: 'FBAN',         platform: 'Facebook' },
  { token: 'FBIOS',        platform: 'Facebook' },
  { token: 'FB_IAB',       platform: 'Facebook' },
  { token: 'Instagram',    platform: 'Instagram' },
  { token: 'trill_',       platform: 'TikTok' },
  { token: 'Musical_ly',   platform: 'TikTok' },
  { token: 'LinkedInApp',  platform: 'LinkedIn' },
  { token: 'Snapchat',     platform: 'Snapchat' },
  { token: 'Pinterest',    platform: 'Pinterest' },
  { token: 'WhatsApp',     platform: 'WhatsApp' },
  { token: 'Telegram',     platform: 'Telegram' },
];

const REFERRER_MAP = {
  // Social platforms
  't.co':                   'Twitter/X',
  'x.com':                  'Twitter/X',
  'twitter.com':            'Twitter/X',
  'l.facebook.com':         'Facebook',
  'facebook.com':           'Facebook',
  'lnkd.in':                'LinkedIn',
  'linkedin.com':           'LinkedIn',
  'l.instagram.com':        'Instagram',
  'instagram.com':          'Instagram',
  'out.reddit.com':         'Reddit',
  'reddit.com':             'Reddit',
  'wa.me':                  'WhatsApp',
  'discord.com':            'Discord',
  't.me':                   'Telegram',
  'telegram.me':            'Telegram',
  'tiktok.com':             'TikTok',
  'pinterest.com':          'Pinterest',
  'youtube.com':            'YouTube',
  'studio.youtube.com':     'YouTube Studio',
  'snapchat.com':           'Snapchat',
  'threads.net':            'Threads',
  // Creator newsletters
  'substack.com':           'Substack',
  'beehiiv.com':            'Beehiiv',
  'convertkit.com':         'ConvertKit',
  'ck.page':                'ConvertKit',
  'medium.com':             'Medium',
  'ghost.io':               'Ghost',
  // Creator commerce
  'gumroad.com':            'Gumroad',
  'stan.store':             'Stan Store',
  'patreon.com':            'Patreon',
  'ko-fi.com':              'Ko-fi',
  'buymeacoffee.com':       'Buy Me a Coffee',
  'lemonsqueezy.com':       'Lemon Squeezy',
  'whop.com':               'Whop',
  'skool.com':              'Skool',
  // Podcasts
  'anchor.fm':              'Anchor/Spotify',
  'podcasters.spotify.com': 'Spotify Podcasts',
  'open.spotify.com':       'Spotify',
  'riverside.fm':           'Riverside',
  // Link-in-bio tools
  'linktr.ee':              'Linktree',
  'beacons.ai':             'Beacons',
  'beacons.page':           'Beacons',
  'bio.site':               'Bio.site',
  'campsite.bio':           'Campsite',
  'later.com':              'Later',
  'koji.com':               'Koji',
  'carrd.co':               'Carrd',
};

export function detectInAppBrowser() {
  const ua = navigator.userAgent || '';
  for (const { token, platform } of IN_APP_BROWSER_TOKENS) {
    if (ua.includes(token)) return platform;
  }
  return null;
}

export function detectSocialReferrer() {
  const raw = document.referrer;
  if (!raw) return null;

  try {
    const hostname = new URL(raw).hostname.replace(/^www\./, '');
    const platform = REFERRER_MAP[hostname] || null;
    if (platform) return { platform, raw };
  } catch (_) {
    // malformed referrer — ignore
  }
  return null;
}

export function getSocialSignals() {
  return {
    inAppBrowser: detectInAppBrowser(),
    referrer: detectSocialReferrer(),
  };
}
