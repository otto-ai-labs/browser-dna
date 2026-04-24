/**
 * Device & environment signals
 * - IP geolocation via ipapi.co (free, no key required for basic use)
 * - Browser/OS signals from navigator and screen APIs
 */

const GEO_API = 'https://ipapi.co/json/';

export async function getGeoData() {
  try {
    const res = await fetch(GEO_API, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      // Short timeout — don't block the payload for too long
      signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined,
    });
    if (!res.ok) return {};
    const data = await res.json();
    return {
      ip:           data.ip       || null,
      country:      data.country_name || null,
      countryCode:  data.country  || null,
      region:       data.region   || null,
      city:         data.city     || null,
      latitude:     data.latitude  || null,
      longitude:    data.longitude || null,
      org:          data.org      || null,
    };
  } catch (_) {
    return {};
  }
}

// ─── UA parsing — browser + OS + bot detection ───────────────────────────────
// Patterns derived from detect-browser (MIT) by Damon Oehlman
// https://github.com/DamonOehlman/detect-browser

const BROWSER_RULES = [
  ['edge',              /Edge\/([0-9._]+)/],
  ['edge-chromium',     /Edg(?:A|iOS)?\/([0-9.]+)/],
  ['samsung',           /SamsungBrowser\/([0-9.]+)/],
  ['silk',              /\bSilk\/([0-9._-]+)\b/],
  ['miui',              /MiuiBrowser\/([0-9.]+)$/],
  ['kakaotalk',         /KAKAOTALK\s([0-9.]+)/],
  ['yandex',            /YaBrowser\/([0-9.]+)/],
  ['facebook',          /FB[AS]V\/([0-9.]+)/],
  ['instagram',         /Instagram\s([0-9.]+)/],
  ['chromium-webview',  /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9.]+)/],
  ['chrome',            /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9.]+)(:?\s|$)/],
  ['crios',             /CriOS\/([0-9.]+)/],
  ['firefox',           /Firefox\/([0-9.]+)(?:\s|$)/],
  ['fxios',             /FxiOS\/([0-9.]+)/],
  ['opera-mini',        /Opera Mini.*Version\/([0-9.]+)/],
  ['opera',             /OPR\/([0-9.]+)/],
  ['ie',                /Trident\/7\.0.*rv:([0-9.]+)/],
  ['ie',                /MSIE\s([0-9.]+);.*Trident\/[4-7].0/],
  ['android',           /Android\s([0-9.]+)/],
  ['ios',               /Version\/([0-9._]+).*Mobile.*Safari/],
  ['safari',            /Version\/([0-9._]+).*Safari/],
  ['ios-webview',       /AppleWebKit\/([0-9.]+).*Mobile/],
];

const OS_RULES = [
  ['iOS',           /iP(?:hone|od|ad)/],
  ['Android',       /Android/],
  ['Windows 10',    /Windows NT 10\.0/],
  ['Windows 8.1',   /Windows NT 6\.3/],
  ['Windows 8',     /Windows NT 6\.2/],
  ['Windows 7',     /Windows NT 6\.1/],
  ['Windows Vista', /Windows NT 6\.0/],
  ['Windows XP',    /Windows NT 5\.1|Windows XP/],
  ['Chrome OS',     /CrOS/],
  ['Mac OS',        /Mac_PowerPC|Macintosh/],
  ['Linux',         /Linux|X11/],
  ['BlackBerry',    /BlackBerry|BB10/],
  ['Windows Mobile',/IEMobile/],
];

// Substring tokens that indicate a bot/crawler
const BOT_TOKENS = /bot|crawl(?:er|ing)|spider|slurp|googlebot|bingbot|yandex|duckduckbot|facebookexternalhit|pingdom|nagios|feedburner|ahrefsbot|semrushbot|screaming.?frog/i;

function parseVersion(str) {
  if (!str) return null;
  return str.replace(/_/g, '.').split('.').slice(0, 3).join('.');
}

export function parseUserAgent(ua) {
  if (!ua) return { browser: null, browserVersion: null, os: null, isBot: false, isWebView: false, isInAppBrowser: false };

  // Bot check first
  if (BOT_TOKENS.test(ua)) {
    return { browser: 'bot', browserVersion: null, os: null, isBot: true, isWebView: false, isInAppBrowser: false };
  }

  let browser = null;
  let browserVersion = null;

  for (const [name, regex] of BROWSER_RULES) {
    const m = ua.match(regex);
    if (m) {
      browser = name;
      browserVersion = parseVersion(m[1]);
      break;
    }
  }

  let os = null;
  for (const [name, regex] of OS_RULES) {
    if (regex.test(ua)) { os = name; break; }
  }

  const isWebView = browser === 'chromium-webview' || browser === 'ios-webview';
  const isInAppBrowser = browser === 'facebook' || browser === 'instagram' || browser === 'kakaotalk';

  return { browser, browserVersion, os, isBot: false, isWebView, isInAppBrowser };
}

export function getBrowserSignals() {
  const nav  = navigator;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const ua   = nav.userAgent || null;
  const parsed = parseUserAgent(ua);

  return {
    // Raw
    userAgent:      ua,
    // Parsed (structured — what detect-browser gives you)
    browser:        parsed.browser,
    browserVersion: parsed.browserVersion,
    os:             parsed.os,
    isBot:          parsed.isBot,
    isWebView:      parsed.isWebView,
    isInAppBrowser: parsed.isInAppBrowser,
    // Environment
    timezone:       Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    language:       nav.language || null,
    languages:      Array.from(nav.languages || []),
    screen:         `${screen.width}x${screen.height}`,
    colorDepth:     screen.colorDepth || null,
    deviceMemory:   nav.deviceMemory || null,
    cpuCores:       nav.hardwareConcurrency || null,
    connection:     conn ? (conn.effectiveType || null) : null,
    downlink:       conn ? (conn.downlink || null) : null,
    saveData:       conn ? (conn.saveData || false) : false,
    cookiesEnabled: nav.cookieEnabled,
    doNotTrack:     nav.doNotTrack === '1' || nav.doNotTrack === 'yes',
    touchPoints:    nav.maxTouchPoints || 0,
  };
}

export async function getDeviceSignals() {
  const [geo, browser] = await Promise.all([getGeoData(), Promise.resolve(getBrowserSignals())]);
  return { ...geo, ...browser };
}
