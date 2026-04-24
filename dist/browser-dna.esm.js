/* @ottoai/browser-dna — Visitor Intelligence Script | https://github.com/ottoai/browser-dna */

// src/social.js
var IN_APP_BROWSER_TOKENS = [
  { token: "FBAN", platform: "Facebook" },
  { token: "FBIOS", platform: "Facebook" },
  { token: "FB_IAB", platform: "Facebook" },
  { token: "Instagram", platform: "Instagram" },
  { token: "trill_", platform: "TikTok" },
  { token: "Musical_ly", platform: "TikTok" },
  { token: "LinkedInApp", platform: "LinkedIn" },
  { token: "Snapchat", platform: "Snapchat" },
  { token: "Pinterest", platform: "Pinterest" },
  { token: "WhatsApp", platform: "WhatsApp" },
  { token: "Telegram", platform: "Telegram" }
];
var REFERRER_MAP = {
  // Social platforms
  "t.co": "Twitter/X",
  "x.com": "Twitter/X",
  "twitter.com": "Twitter/X",
  "l.facebook.com": "Facebook",
  "facebook.com": "Facebook",
  "lnkd.in": "LinkedIn",
  "linkedin.com": "LinkedIn",
  "l.instagram.com": "Instagram",
  "instagram.com": "Instagram",
  "out.reddit.com": "Reddit",
  "reddit.com": "Reddit",
  "wa.me": "WhatsApp",
  "discord.com": "Discord",
  "t.me": "Telegram",
  "telegram.me": "Telegram",
  "tiktok.com": "TikTok",
  "pinterest.com": "Pinterest",
  "youtube.com": "YouTube",
  "studio.youtube.com": "YouTube Studio",
  "snapchat.com": "Snapchat",
  "threads.net": "Threads",
  // Creator newsletters
  "substack.com": "Substack",
  "beehiiv.com": "Beehiiv",
  "convertkit.com": "ConvertKit",
  "ck.page": "ConvertKit",
  "medium.com": "Medium",
  "ghost.io": "Ghost",
  // Creator commerce
  "gumroad.com": "Gumroad",
  "stan.store": "Stan Store",
  "patreon.com": "Patreon",
  "ko-fi.com": "Ko-fi",
  "buymeacoffee.com": "Buy Me a Coffee",
  "lemonsqueezy.com": "Lemon Squeezy",
  "whop.com": "Whop",
  "skool.com": "Skool",
  // Podcasts
  "anchor.fm": "Anchor/Spotify",
  "podcasters.spotify.com": "Spotify Podcasts",
  "open.spotify.com": "Spotify",
  "riverside.fm": "Riverside",
  // Link-in-bio tools
  "linktr.ee": "Linktree",
  "beacons.ai": "Beacons",
  "beacons.page": "Beacons",
  "bio.site": "Bio.site",
  "campsite.bio": "Campsite",
  "later.com": "Later",
  "koji.com": "Koji",
  "carrd.co": "Carrd"
};
function detectInAppBrowser() {
  const ua = navigator.userAgent || "";
  for (const { token, platform } of IN_APP_BROWSER_TOKENS) {
    if (ua.includes(token)) return platform;
  }
  return null;
}
function detectSocialReferrer() {
  const raw = document.referrer;
  if (!raw) return null;
  try {
    const hostname = new URL(raw).hostname.replace(/^www\./, "");
    const platform = REFERRER_MAP[hostname] || null;
    if (platform) return { platform, raw };
  } catch (_2) {
  }
  return null;
}
function getSocialSignals() {
  return {
    inAppBrowser: detectInAppBrowser(),
    referrer: detectSocialReferrer()
  };
}

// src/ai.js
var AI_REFERRER_MAP = {
  "chatgpt.com": "ChatGPT",
  "chat.openai.com": "ChatGPT",
  "claude.ai": "Claude",
  "perplexity.ai": "Perplexity",
  "gemini.google.com": "Google Gemini",
  "bard.google.com": "Google Gemini",
  "copilot.microsoft.com": "Microsoft Copilot",
  "bing.com": "Microsoft Copilot",
  "grok.com": "Grok",
  "grok.x.ai": "Grok",
  "meta.ai": "Meta AI",
  "you.com": "You.com",
  "phind.com": "Phind",
  "poe.com": "Poe",
  "character.ai": "Character.AI",
  "mistral.ai": "Mistral",
  "huggingface.co": "HuggingFace",
  "groq.com": "Groq"
};
var AI_UTM_SOURCES = {
  "chatgpt": "ChatGPT",
  "claude": "Claude",
  "perplexity": "Perplexity",
  "gemini": "Google Gemini",
  "copilot": "Microsoft Copilot",
  "grok": "Grok",
  "meta-ai": "Meta AI"
};
var AI_EXTENSION_GLOBALS = [
  { key: "__claude__", label: "Claude Extension" },
  { key: "__chatgpt__", label: "ChatGPT Extension" },
  { key: "__copilot__", label: "Microsoft Copilot Extension" },
  { key: "__gemini_extension__", label: "Gemini Extension" },
  { key: "__perplexity__", label: "Perplexity Extension" },
  { key: "__monica__", label: "Monica Extension" },
  { key: "__sider__", label: "Sider Extension" },
  { key: "__maxai__", label: "MaxAI Extension" }
];
var AI_EXTENSION_ELEMENTS = [
  { selector: "claude-assistant", label: "Claude Extension" },
  { selector: "chatgpt-sidebar", label: "ChatGPT Extension" },
  { selector: "copilot-widget", label: "Microsoft Copilot Extension" },
  { selector: "perplexity-sidebar", label: "Perplexity Extension" },
  { selector: "monica-root", label: "Monica Extension" },
  { selector: "[data-sider-root]", label: "Sider Extension" },
  { selector: "[data-maxai]", label: "MaxAI Extension" }
];
function detectAIReferrer() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = (params.get("utm_source") || "").toLowerCase();
    if (utmSource && AI_UTM_SOURCES[utmSource]) {
      return AI_UTM_SOURCES[utmSource];
    }
  } catch (_2) {
  }
  const raw = document.referrer;
  if (!raw) return null;
  try {
    const hostname = new URL(raw).hostname.replace(/^www\./, "");
    return AI_REFERRER_MAP[hostname] || null;
  } catch (_2) {
    return null;
  }
}
function detectAIExtensions() {
  const found = [];
  for (const { key, label } of AI_EXTENSION_GLOBALS) {
    try {
      if (window[key] !== void 0) found.push(label);
    } catch (_2) {
    }
  }
  for (const { selector, label } of AI_EXTENSION_ELEMENTS) {
    try {
      if (document.querySelector(selector)) {
        if (!found.includes(label)) found.push(label);
      }
    } catch (_2) {
    }
  }
  return found;
}
function getAISignals() {
  return {
    referrer: detectAIReferrer(),
    extensions: detectAIExtensions()
  };
}

// src/device.js
var GEO_API = "https://ipapi.co/json/";
async function getGeoData() {
  try {
    const res = await fetch(GEO_API, {
      method: "GET",
      headers: { "Accept": "application/json" },
      // Short timeout — don't block the payload for too long
      signal: AbortSignal.timeout ? AbortSignal.timeout(4e3) : void 0
    });
    if (!res.ok) return {};
    const data = await res.json();
    return {
      ip: data.ip || null,
      country: data.country_name || null,
      countryCode: data.country || null,
      region: data.region || null,
      city: data.city || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      org: data.org || null
    };
  } catch (_2) {
    return {};
  }
}
var BROWSER_RULES = [
  ["edge", /Edge\/([0-9._]+)/],
  ["edge-chromium", /Edg(?:A|iOS)?\/([0-9.]+)/],
  ["samsung", /SamsungBrowser\/([0-9.]+)/],
  ["silk", /\bSilk\/([0-9._-]+)\b/],
  ["miui", /MiuiBrowser\/([0-9.]+)$/],
  ["kakaotalk", /KAKAOTALK\s([0-9.]+)/],
  ["yandex", /YaBrowser\/([0-9.]+)/],
  ["facebook", /FB[AS]V\/([0-9.]+)/],
  ["instagram", /Instagram\s([0-9.]+)/],
  ["chromium-webview", /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9.]+)/],
  ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9.]+)(:?\s|$)/],
  ["crios", /CriOS\/([0-9.]+)/],
  ["firefox", /Firefox\/([0-9.]+)(?:\s|$)/],
  ["fxios", /FxiOS\/([0-9.]+)/],
  ["opera-mini", /Opera Mini.*Version\/([0-9.]+)/],
  ["opera", /OPR\/([0-9.]+)/],
  ["ie", /Trident\/7\.0.*rv:([0-9.]+)/],
  ["ie", /MSIE\s([0-9.]+);.*Trident\/[4-7].0/],
  ["android", /Android\s([0-9.]+)/],
  ["ios", /Version\/([0-9._]+).*Mobile.*Safari/],
  ["safari", /Version\/([0-9._]+).*Safari/],
  ["ios-webview", /AppleWebKit\/([0-9.]+).*Mobile/]
];
var OS_RULES = [
  ["iOS", /iP(?:hone|od|ad)/],
  ["Android", /Android/],
  ["Windows 10", /Windows NT 10\.0/],
  ["Windows 8.1", /Windows NT 6\.3/],
  ["Windows 8", /Windows NT 6\.2/],
  ["Windows 7", /Windows NT 6\.1/],
  ["Windows Vista", /Windows NT 6\.0/],
  ["Windows XP", /Windows NT 5\.1|Windows XP/],
  ["Chrome OS", /CrOS/],
  ["Mac OS", /Mac_PowerPC|Macintosh/],
  ["Linux", /Linux|X11/],
  ["BlackBerry", /BlackBerry|BB10/],
  ["Windows Mobile", /IEMobile/]
];
var BOT_TOKENS = /bot|crawl(?:er|ing)|spider|slurp|googlebot|bingbot|yandex|duckduckbot|facebookexternalhit|pingdom|nagios|feedburner|ahrefsbot|semrushbot|screaming.?frog/i;
function parseVersion(str) {
  if (!str) return null;
  return str.replace(/_/g, ".").split(".").slice(0, 3).join(".");
}
function parseUserAgent(ua) {
  if (!ua) return { browser: null, browserVersion: null, os: null, isBot: false, isWebView: false, isInAppBrowser: false };
  if (BOT_TOKENS.test(ua)) {
    return { browser: "bot", browserVersion: null, os: null, isBot: true, isWebView: false, isInAppBrowser: false };
  }
  let browser = null;
  let browserVersion = null;
  for (const [name, regex] of BROWSER_RULES) {
    const m2 = ua.match(regex);
    if (m2) {
      browser = name;
      browserVersion = parseVersion(m2[1]);
      break;
    }
  }
  let os = null;
  for (const [name, regex] of OS_RULES) {
    if (regex.test(ua)) {
      os = name;
      break;
    }
  }
  const isWebView = browser === "chromium-webview" || browser === "ios-webview";
  const isInAppBrowser = browser === "facebook" || browser === "instagram" || browser === "kakaotalk";
  return { browser, browserVersion, os, isBot: false, isWebView, isInAppBrowser };
}
function getBrowserSignals() {
  const nav = navigator;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const ua = nav.userAgent || null;
  const parsed = parseUserAgent(ua);
  return {
    // Raw
    userAgent: ua,
    // Parsed (structured — what detect-browser gives you)
    browser: parsed.browser,
    browserVersion: parsed.browserVersion,
    os: parsed.os,
    isBot: parsed.isBot,
    isWebView: parsed.isWebView,
    isInAppBrowser: parsed.isInAppBrowser,
    // Environment
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    language: nav.language || null,
    languages: Array.from(nav.languages || []),
    screen: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth || null,
    deviceMemory: nav.deviceMemory || null,
    cpuCores: nav.hardwareConcurrency || null,
    connection: conn ? conn.effectiveType || null : null,
    downlink: conn ? conn.downlink || null : null,
    saveData: conn ? conn.saveData || false : false,
    cookiesEnabled: nav.cookieEnabled,
    doNotTrack: nav.doNotTrack === "1" || nav.doNotTrack === "yes",
    touchPoints: nav.maxTouchPoints || 0
  };
}
async function getDeviceSignals() {
  const [geo, browser] = await Promise.all([getGeoData(), Promise.resolve(getBrowserSignals())]);
  return { ...geo, ...browser };
}

// node_modules/@thumbmarkjs/thumbmarkjs/dist/thumbmark.esm.js
function e(e2, r2, n2, t) {
  return new (n2 || (n2 = Promise))((function(o2, a2) {
    function i2(e3) {
      try {
        c2(t.next(e3));
      } catch (e4) {
        a2(e4);
      }
    }
    function u2(e3) {
      try {
        c2(t.throw(e3));
      } catch (e4) {
        a2(e4);
      }
    }
    function c2(e3) {
      var r3;
      e3.done ? o2(e3.value) : (r3 = e3.value, r3 instanceof n2 ? r3 : new n2((function(e4) {
        e4(r3);
      }))).then(i2, u2);
    }
    c2((t = t.apply(e2, r2 || [])).next());
  }));
}
function r(e2, r2) {
  var n2, t, o2, a2, i2 = { label: 0, sent: function() {
    if (1 & o2[0]) throw o2[1];
    return o2[1];
  }, trys: [], ops: [] };
  return a2 = { next: u2(0), throw: u2(1), return: u2(2) }, "function" == typeof Symbol && (a2[Symbol.iterator] = function() {
    return this;
  }), a2;
  function u2(u3) {
    return function(c2) {
      return (function(u4) {
        if (n2) throw new TypeError("Generator is already executing.");
        for (; a2 && (a2 = 0, u4[0] && (i2 = 0)), i2; ) try {
          if (n2 = 1, t && (o2 = 2 & u4[0] ? t.return : u4[0] ? t.throw || ((o2 = t.return) && o2.call(t), 0) : t.next) && !(o2 = o2.call(t, u4[1])).done) return o2;
          switch (t = 0, o2 && (u4 = [2 & u4[0], o2.value]), u4[0]) {
            case 0:
            case 1:
              o2 = u4;
              break;
            case 4:
              return i2.label++, { value: u4[1], done: false };
            case 5:
              i2.label++, t = u4[1], u4 = [0];
              continue;
            case 7:
              u4 = i2.ops.pop(), i2.trys.pop();
              continue;
            default:
              if (!(o2 = i2.trys, (o2 = o2.length > 0 && o2[o2.length - 1]) || 6 !== u4[0] && 2 !== u4[0])) {
                i2 = 0;
                continue;
              }
              if (3 === u4[0] && (!o2 || u4[1] > o2[0] && u4[1] < o2[3])) {
                i2.label = u4[1];
                break;
              }
              if (6 === u4[0] && i2.label < o2[1]) {
                i2.label = o2[1], o2 = u4;
                break;
              }
              if (o2 && i2.label < o2[2]) {
                i2.label = o2[2], i2.ops.push(u4);
                break;
              }
              o2[2] && i2.ops.pop(), i2.trys.pop();
              continue;
          }
          u4 = r2.call(e2, i2);
        } catch (e3) {
          u4 = [6, e3], t = 0;
        } finally {
          n2 = o2 = 0;
        }
        if (5 & u4[0]) throw u4[1];
        return { value: u4[0] ? u4[1] : void 0, done: true };
      })([u3, c2]);
    };
  }
}
var n = { exclude: [] };
var o = {};
var a = { timeout: "true" };
var i = function(e2, r2) {
  "undefined" != typeof window && (o[e2] = r2);
};
var u = function() {
  return Object.fromEntries(Object.entries(o).filter((function(e2) {
    var r2, t = e2[0];
    return !(null === (r2 = null == n ? void 0 : n.exclude) || void 0 === r2 ? void 0 : r2.includes(t));
  })).map((function(e2) {
    return [e2[0], (0, e2[1])()];
  })));
};
var c = 3432918353;
var s = 461845907;
var l = 3864292196;
var d = 2246822507;
var f = 3266489909;
function h(e2, r2) {
  return e2 << r2 | e2 >>> 32 - r2;
}
function m(e2, r2) {
  void 0 === r2 && (r2 = 0);
  for (var n2 = r2, t = 0, o2 = 3 & e2.length, a2 = e2.length - o2, i2 = 0; i2 < a2; ) t = 255 & e2.charCodeAt(i2) | (255 & e2.charCodeAt(++i2)) << 8 | (255 & e2.charCodeAt(++i2)) << 16 | (255 & e2.charCodeAt(++i2)) << 24, ++i2, t = h(t = Math.imul(t, c), 15), n2 = h(n2 ^= t = Math.imul(t, s), 13), n2 = Math.imul(n2, 5) + l;
  switch (t = 0, o2) {
    case 3:
      t ^= (255 & e2.charCodeAt(i2 + 2)) << 16;
    case 2:
      t ^= (255 & e2.charCodeAt(i2 + 1)) << 8;
    case 1:
      t ^= 255 & e2.charCodeAt(i2), t = h(t = Math.imul(t, c), 15), n2 ^= t = Math.imul(t, s);
  }
  return ((n2 = (function(e3) {
    return e3 ^= e3 >>> 16, e3 = Math.imul(e3, d), e3 ^= e3 >>> 13, e3 = Math.imul(e3, f), e3 ^ e3 >>> 16;
  })(n2 ^= e2.length)) >>> 0).toString(36);
}
function v(e2, r2) {
  return new Promise((function(n2) {
    setTimeout((function() {
      return n2(r2);
    }), e2);
  }));
}
function g(e2, r2, n2) {
  return Promise.all(e2.map((function(e3) {
    return Promise.race([e3, v(r2, n2)]);
  })));
}
function w() {
  return e(this, void 0, void 0, (function() {
    var e2, t, o2, i2, c2;
    return r(this, (function(r2) {
      switch (r2.label) {
        case 0:
          return r2.trys.push([0, 2, , 3]), e2 = u(), t = Object.keys(e2), [4, g(Object.values(e2), (null == n ? void 0 : n.timeout) || 1e3, a)];
        case 1:
          return o2 = r2.sent(), i2 = o2.filter((function(e3) {
            return void 0 !== e3;
          })), c2 = {}, i2.forEach((function(e3, r3) {
            c2[t[r3]] = e3;
          })), [2, y(c2, n.exclude || [])];
        case 2:
          throw r2.sent();
        case 3:
          return [2];
      }
    }));
  }));
}
function y(e2, r2) {
  var n2 = {}, t = function(t2) {
    if (e2.hasOwnProperty(t2)) {
      var o3 = e2[t2];
      if ("object" != typeof o3 || Array.isArray(o3)) r2.includes(t2) || (n2[t2] = o3);
      else {
        var a2 = y(o3, r2.map((function(e3) {
          return e3.startsWith(t2 + ".") ? e3.slice(t2.length + 1) : e3;
        })));
        Object.keys(a2).length > 0 && (n2[t2] = a2);
      }
    }
  };
  for (var o2 in e2) t(o2);
  return n2;
}
function S(n2) {
  return e(this, void 0, void 0, (function() {
    var e2, t;
    return r(this, (function(r2) {
      switch (r2.label) {
        case 0:
          return r2.trys.push([0, 2, , 3]), [4, w()];
        case 1:
          return e2 = r2.sent(), t = m(JSON.stringify(e2)), n2 ? [2, { hash: t.toString(), data: e2 }] : [2, t.toString()];
        case 2:
          throw r2.sent();
        case 3:
          return [2];
      }
    }));
  }));
}
function E(e2) {
  for (var r2 = 0, n2 = 0; n2 < e2.length; ++n2) r2 += Math.abs(e2[n2]);
  return r2;
}
function P(e2, r2, n2) {
  for (var t = [], o2 = 0; o2 < e2[0].data.length; o2++) {
    for (var a2 = [], i2 = 0; i2 < e2.length; i2++) a2.push(e2[i2].data[o2]);
    t.push(M(a2));
  }
  var u2 = new Uint8ClampedArray(t);
  return new ImageData(u2, r2, n2);
}
function M(e2) {
  if (0 === e2.length) return 0;
  for (var r2 = {}, n2 = 0, t = e2; n2 < t.length; n2++) {
    r2[a2 = t[n2]] = (r2[a2] || 0) + 1;
  }
  var o2 = e2[0];
  for (var a2 in r2) r2[a2] > r2[o2] && (o2 = parseInt(a2, 10));
  return o2;
}
function A() {
  if ("undefined" == typeof navigator) return { name: "unknown", version: "unknown" };
  for (var e2 = navigator.userAgent, r2 = { Edg: "Edge", OPR: "Opera" }, n2 = 0, t = [/(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/, /(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/]; n2 < t.length; n2++) {
    var o2 = t[n2], a2 = e2.match(o2);
    if (a2 && a2.groups) return { name: r2[a2.groups.name] || a2.groups.name, version: a2.groups.version };
  }
  return { name: "unknown", version: "unknown" };
}
i("audio", (function() {
  return e(this, void 0, void 0, (function() {
    return r(this, (function(e2) {
      return [2, new Promise((function(e3, r2) {
        try {
          var n2 = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 5e3, 44100), t = n2.createBufferSource(), o2 = n2.createOscillator();
          o2.frequency.value = 1e3;
          var a2, i2 = n2.createDynamicsCompressor();
          i2.threshold.value = -50, i2.knee.value = 40, i2.ratio.value = 12, i2.attack.value = 0, i2.release.value = 0.2, o2.connect(i2), i2.connect(n2.destination), o2.start(), n2.oncomplete = function(r3) {
            a2 = r3.renderedBuffer.getChannelData(0), e3({ sampleHash: E(a2), oscillator: o2.type, maxChannels: n2.destination.maxChannelCount, channelCountMode: t.channelCountMode });
          }, n2.startRendering();
        } catch (e4) {
          console.error("Error creating audio fingerprint:", e4), r2(e4);
        }
      }))];
    }));
  }));
}));
var C = "SamsungBrowser" !== A().name ? 1 : 3;
var x = 280;
var k = 20;
"Firefox" != A().name && i("canvas", (function() {
  return document.createElement("canvas").getContext("2d"), new Promise((function(e2) {
    var r2 = Array.from({ length: C }, (function() {
      return (function() {
        var e3 = document.createElement("canvas"), r3 = e3.getContext("2d");
        if (!r3) return new ImageData(1, 1);
        e3.width = x, e3.height = k;
        var n2 = r3.createLinearGradient(0, 0, e3.width, e3.height);
        n2.addColorStop(0, "red"), n2.addColorStop(1 / 6, "orange"), n2.addColorStop(2 / 6, "yellow"), n2.addColorStop(0.5, "green"), n2.addColorStop(4 / 6, "blue"), n2.addColorStop(5 / 6, "indigo"), n2.addColorStop(1, "violet"), r3.fillStyle = n2, r3.fillRect(0, 0, e3.width, e3.height);
        var t = "Random Text WMwmil10Oo";
        r3.font = "23.123px Arial", r3.fillStyle = "black", r3.fillText(t, -5, 15), r3.fillStyle = "rgba(0, 0, 255, 0.5)", r3.fillText(t, -3.3, 17.7), r3.beginPath(), r3.moveTo(0, 0), r3.lineTo(2 * e3.width / 7, e3.height), r3.strokeStyle = "white", r3.lineWidth = 2, r3.stroke();
        var o2 = r3.getImageData(0, 0, e3.width, e3.height);
        return o2;
      })();
    }));
    e2({ commonImageDataHash: m(P(r2, x, k).data.toString()).toString() });
  }));
}));
var T;
var R = ["Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT", "Arimo", "Archivo", "Barlow", "Bebas Neue", "Bitter", "Bookman", "Calibri", "Cabin", "Candara", "Century", "Century Gothic", "Comic Sans MS", "Constantia", "Courier", "Courier New", "Crimson Text", "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Dosis", "Droid Sans", "Exo", "Fira Code", "Fira Sans", "Franklin Gothic Medium", "Garamond", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Impact", "Inconsolata", "Indie Flower", "Inter", "Josefin Sans", "Karla", "Lato", "Lexend", "Lucida Bright", "Lucida Console", "Lucida Sans Unicode", "Manrope", "Merriweather", "Merriweather Sans", "Montserrat", "Myriad", "Noto Sans", "Nunito", "Nunito Sans", "Open Sans", "Optima", "Orbitron", "Oswald", "Pacifico", "Palatino", "Perpetua", "PT Sans", "PT Serif", "Poppins", "Prompt", "Public Sans", "Quicksand", "Rajdhani", "Recursive", "Roboto", "Roboto Condensed", "Rockwell", "Rubik", "Segoe Print", "Segoe Script", "Segoe UI", "Sora", "Source Sans Pro", "Space Mono", "Tahoma", "Taviraj", "Times", "Times New Roman", "Titillium Web", "Trebuchet MS", "Ubuntu", "Varela Round", "Verdana", "Work Sans"];
var I = ["monospace", "sans-serif", "serif"];
function O(e2, r2) {
  if (!e2) throw new Error("Canvas context not supported");
  return e2.font, e2.font = "72px ".concat(r2), e2.measureText("WwMmLli0Oo").width;
}
function _() {
  var e2, r2 = document.createElement("canvas"), n2 = null !== (e2 = r2.getContext("webgl")) && void 0 !== e2 ? e2 : r2.getContext("experimental-webgl");
  if (n2 && "getParameter" in n2) {
    var t = n2.getExtension("WEBGL_debug_renderer_info");
    return { vendor: (n2.getParameter(n2.VENDOR) || "").toString(), vendorUnmasked: t ? (n2.getParameter(t.UNMASKED_VENDOR_WEBGL) || "").toString() : "", renderer: (n2.getParameter(n2.RENDERER) || "").toString(), rendererUnmasked: t ? (n2.getParameter(t.UNMASKED_RENDERER_WEBGL) || "").toString() : "", version: (n2.getParameter(n2.VERSION) || "").toString(), shadingLanguageVersion: (n2.getParameter(n2.SHADING_LANGUAGE_VERSION) || "").toString() };
  }
  return "undefined";
}
function D() {
  var e2 = new Float32Array(1), r2 = new Uint8Array(e2.buffer);
  return e2[0] = 1 / 0, e2[0] = e2[0] - e2[0], r2[3];
}
function B(e2, r2) {
  var n2 = {};
  return r2.forEach((function(r3) {
    var t = (function(e3) {
      if (0 === e3.length) return null;
      var r4 = {};
      e3.forEach((function(e4) {
        var n4 = String(e4);
        r4[n4] = (r4[n4] || 0) + 1;
      }));
      var n3 = e3[0], t2 = 1;
      return Object.keys(r4).forEach((function(e4) {
        r4[e4] > t2 && (n3 = e4, t2 = r4[e4]);
      })), n3;
    })(e2.map((function(e3) {
      return r3 in e3 ? e3[r3] : void 0;
    })).filter((function(e3) {
      return void 0 !== e3;
    })));
    t && (n2[r3] = t);
  })), n2;
}
function L() {
  var e2 = [], r2 = { "prefers-contrast": ["high", "more", "low", "less", "forced", "no-preference"], "any-hover": ["hover", "none"], "any-pointer": ["none", "coarse", "fine"], pointer: ["none", "coarse", "fine"], hover: ["hover", "none"], update: ["fast", "slow"], "inverted-colors": ["inverted", "none"], "prefers-reduced-motion": ["reduce", "no-preference"], "prefers-reduced-transparency": ["reduce", "no-preference"], scripting: ["none", "initial-only", "enabled"], "forced-colors": ["active", "none"] };
  return Object.keys(r2).forEach((function(n2) {
    r2[n2].forEach((function(r3) {
      matchMedia("(".concat(n2, ": ").concat(r3, ")")).matches && e2.push("".concat(n2, ": ").concat(r3));
    }));
  })), e2;
}
function F() {
  if ("https:" === window.location.protocol && "function" == typeof window.ApplePaySession) try {
    for (var e2 = window.ApplePaySession.supportsVersion, r2 = 15; r2 > 0; r2--) if (e2(r2)) return r2;
  } catch (e3) {
    return 0;
  }
  return 0;
}
"Firefox" != A().name && i("fonts", (function() {
  var n2 = this;
  return new Promise((function(t, o2) {
    try {
      !(function(n3) {
        var t2;
        e(this, void 0, void 0, (function() {
          var e2, o3, a2;
          return r(this, (function(r2) {
            switch (r2.label) {
              case 0:
                return document.body ? [3, 2] : [4, (i2 = 50, new Promise((function(e3) {
                  return setTimeout(e3, i2, u2);
                })))];
              case 1:
                return r2.sent(), [3, 0];
              case 2:
                if ((e2 = document.createElement("iframe")).setAttribute("frameBorder", "0"), (o3 = e2.style).setProperty("position", "fixed"), o3.setProperty("display", "block", "important"), o3.setProperty("visibility", "visible"), o3.setProperty("border", "0"), o3.setProperty("opacity", "0"), e2.src = "about:blank", document.body.appendChild(e2), !(a2 = e2.contentDocument || (null === (t2 = e2.contentWindow) || void 0 === t2 ? void 0 : t2.document))) throw new Error("Iframe document is not accessible");
                return n3({ iframe: a2 }), setTimeout((function() {
                  document.body.removeChild(e2);
                }), 0), [2];
            }
            var i2, u2;
          }));
        }));
      })((function(o3) {
        var a2 = o3.iframe;
        return e(n2, void 0, void 0, (function() {
          var e2, n3, o4, i2;
          return r(this, (function(r2) {
            return "Hello, world!", e2 = a2.createElement("canvas"), n3 = e2.getContext("2d"), o4 = I.map((function(e3) {
              return O(n3, e3);
            })), i2 = {}, R.forEach((function(e3) {
              var r3 = O(n3, e3);
              o4.includes(r3) || (i2[e3] = r3);
            })), t(i2), [2];
          }));
        }));
      }));
    } catch (e2) {
      o2({ error: "unsupported" });
    }
  }));
})), i("hardware", (function() {
  return new Promise((function(e2, r2) {
    var n2 = void 0 !== navigator.deviceMemory ? navigator.deviceMemory : 0, t = window.performance && window.performance.memory ? window.performance.memory : 0;
    e2({ videocard: _(), architecture: D(), deviceMemory: n2.toString() || "undefined", jsHeapSizeLimit: t.jsHeapSizeLimit || 0 });
  }));
})), i("locales", (function() {
  return new Promise((function(e2) {
    e2({ languages: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  }));
})), i("permissions", (function() {
  return e(this, void 0, void 0, (function() {
    var t;
    return r(this, (function(o2) {
      return T = (null == n ? void 0 : n.permissions_to_check) || ["accelerometer", "accessibility", "accessibility-events", "ambient-light-sensor", "background-fetch", "background-sync", "bluetooth", "camera", "clipboard-read", "clipboard-write", "device-info", "display-capture", "gyroscope", "geolocation", "local-fonts", "magnetometer", "microphone", "midi", "nfc", "notifications", "payment-handler", "persistent-storage", "push", "speaker", "storage-access", "top-level-storage-access", "window-management", "query"], t = Array.from({ length: (null == n ? void 0 : n.retries) || 3 }, (function() {
        return (function() {
          return e(this, void 0, void 0, (function() {
            var e2, n2, t2, o3, a2;
            return r(this, (function(r2) {
              switch (r2.label) {
                case 0:
                  e2 = {}, n2 = 0, t2 = T, r2.label = 1;
                case 1:
                  if (!(n2 < t2.length)) return [3, 6];
                  o3 = t2[n2], r2.label = 2;
                case 2:
                  return r2.trys.push([2, 4, , 5]), [4, navigator.permissions.query({ name: o3 })];
                case 3:
                  return a2 = r2.sent(), e2[o3] = a2.state.toString(), [3, 5];
                case 4:
                  return r2.sent(), [3, 5];
                case 5:
                  return n2++, [3, 1];
                case 6:
                  return [2, e2];
              }
            }));
          }));
        })();
      })), [2, Promise.all(t).then((function(e2) {
        return B(e2, T);
      }))];
    }));
  }));
})), i("plugins", (function() {
  var e2 = [];
  if (navigator.plugins) for (var r2 = 0; r2 < navigator.plugins.length; r2++) {
    var n2 = navigator.plugins[r2];
    e2.push([n2.name, n2.filename, n2.description].join("|"));
  }
  return new Promise((function(r3) {
    r3({ plugins: e2 });
  }));
})), i("screen", (function() {
  return new Promise((function(e2) {
    e2({ is_touchscreen: navigator.maxTouchPoints > 0, maxTouchPoints: navigator.maxTouchPoints, colorDepth: screen.colorDepth, mediaMatches: L() });
  }));
})), i("system", (function() {
  return new Promise((function(e2) {
    var r2 = A();
    e2({ platform: window.navigator.platform, cookieEnabled: window.navigator.cookieEnabled, productSub: navigator.productSub, product: navigator.product, useragent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency, browser: { name: r2.name, version: r2.version }, applePayVersion: F() });
  }));
}));
var N;
var U = "SamsungBrowser" !== A().name ? 1 : 3;
var G = null;
i("webgl", (function() {
  return e(this, void 0, void 0, (function() {
    var e2;
    return r(this, (function(r2) {
      "undefined" != typeof document && ((N = document.createElement("canvas")).width = 200, N.height = 100, G = N.getContext("webgl"));
      try {
        if (!G) throw new Error("WebGL not supported");
        return e2 = Array.from({ length: U }, (function() {
          return (function() {
            try {
              if (!G) throw new Error("WebGL not supported");
              var e3 = "\n          attribute vec2 position;\n          void main() {\n              gl_Position = vec4(position, 0.0, 1.0);\n          }\n      ", r3 = "\n          precision mediump float;\n          void main() {\n              gl_FragColor = vec4(0.812, 0.195, 0.553, 0.921); // Set line color\n          }\n      ", n2 = G.createShader(G.VERTEX_SHADER), t = G.createShader(G.FRAGMENT_SHADER);
              if (!n2 || !t) throw new Error("Failed to create shaders");
              if (G.shaderSource(n2, e3), G.shaderSource(t, r3), G.compileShader(n2), !G.getShaderParameter(n2, G.COMPILE_STATUS)) throw new Error("Vertex shader compilation failed: " + G.getShaderInfoLog(n2));
              if (G.compileShader(t), !G.getShaderParameter(t, G.COMPILE_STATUS)) throw new Error("Fragment shader compilation failed: " + G.getShaderInfoLog(t));
              var o2 = G.createProgram();
              if (!o2) throw new Error("Failed to create shader program");
              if (G.attachShader(o2, n2), G.attachShader(o2, t), G.linkProgram(o2), !G.getProgramParameter(o2, G.LINK_STATUS)) throw new Error("Shader program linking failed: " + G.getProgramInfoLog(o2));
              G.useProgram(o2);
              for (var a2 = 137, i2 = new Float32Array(4 * a2), u2 = 2 * Math.PI / a2, c2 = 0; c2 < a2; c2++) {
                var s2 = c2 * u2;
                i2[4 * c2] = 0, i2[4 * c2 + 1] = 0, i2[4 * c2 + 2] = Math.cos(s2) * (N.width / 2), i2[4 * c2 + 3] = Math.sin(s2) * (N.height / 2);
              }
              var l2 = G.createBuffer();
              G.bindBuffer(G.ARRAY_BUFFER, l2), G.bufferData(G.ARRAY_BUFFER, i2, G.STATIC_DRAW);
              var d2 = G.getAttribLocation(o2, "position");
              G.enableVertexAttribArray(d2), G.vertexAttribPointer(d2, 2, G.FLOAT, false, 0, 0), G.viewport(0, 0, N.width, N.height), G.clearColor(0, 0, 0, 1), G.clear(G.COLOR_BUFFER_BIT), G.drawArrays(G.LINES, 0, 2 * a2);
              var f2 = new Uint8ClampedArray(N.width * N.height * 4);
              return G.readPixels(0, 0, N.width, N.height, G.RGBA, G.UNSIGNED_BYTE, f2), new ImageData(f2, N.width, N.height);
            } catch (e4) {
              return new ImageData(1, 1);
            } finally {
              G && (G.bindBuffer(G.ARRAY_BUFFER, null), G.useProgram(null), G.viewport(0, 0, G.drawingBufferWidth, G.drawingBufferHeight), G.clearColor(0, 0, 0, 0));
            }
          })();
        })), [2, { commonImageHash: m(P(e2, N.width, N.height).data.toString()).toString() }];
      } catch (e3) {
        return [2, { webgl: "unsupported" }];
      }
      return [2];
    }));
  }));
}));
var j = function(e2, r2, n2, t) {
  for (var o2 = (n2 - r2) / t, a2 = 0, i2 = 0; i2 < t; i2++) {
    a2 += e2(r2 + (i2 + 0.5) * o2);
  }
  return a2 * o2;
};
i("math", (function() {
  return e(void 0, void 0, void 0, (function() {
    return r(this, (function(e2) {
      return [2, { acos: Math.acos(0.5), asin: j(Math.asin, -1, 1, 97), atan: j(Math.atan, -1, 1, 97), cos: j(Math.cos, 0, Math.PI, 97), cosh: Math.cosh(9 / 7), e: Math.E, largeCos: Math.cos(1e20), largeSin: Math.sin(1e20), largeTan: Math.tan(1e20), log: Math.log(1e3), pi: Math.PI, sin: j(Math.sin, -Math.PI, Math.PI, 97), sinh: j(Math.sinh, -9 / 7, 7 / 9, 97), sqrt: Math.sqrt(2), tan: j(Math.tan, 0, 2 * Math.PI, 97), tanh: j(Math.tanh, -9 / 7, 7 / 9, 97) }];
    }));
  }));
}));

// src/fingerprint.js
async function getFingerprintSignals() {
  try {
    const id = await S();
    return { id };
  } catch (_2) {
    return { id: null };
  }
}

// src/extensions.js
var AI_EXTENSIONS = [
  // ── Anthropic ────────────────────────────────────────────────────────────
  {
    id: "fcoeoabgfenejglbffodgkkbkcdhcgfn",
    name: "Claude",
    vendor: "Anthropic",
    globals: [],
    selectors: [
      "#claude-agent-stop-container",
      "#claude-agent-animation-styles"
    ]
  },
  // ── OpenAI / ChatGPT ─────────────────────────────────────────────────────
  {
    id: "cgmnfnmlficgeijcalkgnnkigkefkbhd",
    name: "AIPRM for ChatGPT",
    vendor: "OpenAI / ChatGPT",
    globals: ["__AIPRM__", "AIPRM"],
    selectors: ["#AIPRM__root", "[data-aiprm]"]
  },
  {
    id: "lpfemeioodjbpieminkklglpmhlngfcn",
    name: "WebChatGPT",
    vendor: "OpenAI / ChatGPT",
    globals: ["__webchatgpt__"],
    selectors: ["[data-webchatgpt]"]
  },
  {
    id: "pdnenlnelpdomajfejgapbdpmjkfpjkp",
    name: "ChatGPT Writer",
    vendor: "OpenAI / ChatGPT",
    globals: [],
    selectors: ["#chatgpt-writer-root", "[data-chatgpt-writer]"]
  },
  {
    id: "ddlbpiadoechcolndfeaonajmngmhblj",
    name: "Compose AI",
    vendor: "OpenAI / ChatGPT",
    globals: ["__composeAI__", "composeAI"],
    selectors: ["#compose-ai-root", "[data-compose-ai]"]
  },
  // ── Google / Gemini ───────────────────────────────────────────────────────
  {
    id: "ncjedehfkpnliaafimjhdjjeggmfmlgf",
    name: "Microsoft Copilot",
    vendor: "Microsoft / Bing",
    globals: ["__copilot__", "__bing_copilot__"],
    selectors: ["copilot-widget", "[data-copilot-sidebar]"]
  },
  // ── Perplexity ────────────────────────────────────────────────────────────
  {
    id: "hlgbcneanomplepojfcnclggenpcoldo",
    name: "Perplexity AI Companion",
    vendor: "Perplexity",
    globals: ["__perplexity__", "__perplexityExt__"],
    selectors: ["perplexity-sidebar", "[data-perplexity-ext]"]
  },
  // ── Multi-model AI sidebars ───────────────────────────────────────────────
  {
    id: "ofpnmcalabcbjgholdjcjblkibolbppb",
    name: "Monica",
    vendor: "Monica AI",
    globals: ["__monica__", "monicaAI"],
    selectors: ["monica-root", "#monica-ext-root", "[data-monica-ext]"]
  },
  {
    id: "difoiogjjojoaoomphldepapgpbgkhkb",
    name: "Sider",
    vendor: "Sider AI",
    globals: ["__sider__", "siderAI"],
    selectors: ["[data-sider-root]", "#sider-ext-root", "sider-panel"]
  },
  {
    id: "mhnlakgilnojmhinhkckjpncpbhabphi",
    name: "MaxAI",
    vendor: "MaxAI",
    globals: ["__maxai__", "maxAI"],
    selectors: ["[data-maxai]", "#maxai-root", "maxai-sidebar"]
  },
  {
    id: "camppjleccjaphfdbohjdohecfnoikec",
    name: "Merlin",
    vendor: "Merlin AI",
    globals: ["__merlin__", "merlinAI"],
    selectors: ["[data-merlin-ext]", "#merlin-root", "merlin-widget"]
  },
  {
    id: "eanggfilgoajaocelnaflolkadkeghjp",
    name: "HARPA AI",
    vendor: "HARPA AI",
    globals: ["__harpa__", "harpaAI"],
    selectors: ["#harpa-root", "[data-harpa-ext]", "harpa-widget"]
  },
  // ── AI Writing tools ──────────────────────────────────────────────────────
  {
    id: "kbfnbcaeplbcioakkpcpgfkobkghlhen",
    name: "Grammarly",
    vendor: "Grammarly",
    globals: ["grammarly", "GrammarlyPageMessages"],
    selectors: [
      "grammarly-extension",
      "grammarly-desktop-integration",
      "[data-grammarly-shadow-root]"
    ]
  },
  {
    id: "nllcnknpjnininklegdoijpljgdjkijc",
    name: "Wordtune",
    vendor: "Wordtune",
    globals: ["__wordtune__", "wordtuneExt"],
    selectors: ["#wordtune-root", "[data-wordtune]", "wordtune-widget"]
  },
  {
    id: "blillmbchncajnhkjfdnincfndboieik",
    name: "Glasp",
    vendor: "Glasp",
    globals: ["__glasp__", "glaspExt"],
    selectors: ["[data-glasp-highlight]", "#glasp-root", "glasp-highlight"]
  },
  // ── AI Translation ────────────────────────────────────────────────────────
  {
    id: "cofdbpoegempjloogbagkncekinflcnj",
    name: "DeepL",
    vendor: "DeepL",
    globals: ["__deepl__", "deeplExt"],
    selectors: ["#deepl-root", "[data-deepl-ext]", "deepl-panel"]
  },
  // ── Creator-specific tools (near-zero false positive rate) ────────────────
  {
    id: "mhkhmbddkmdggbhaaaodilponhnccicb",
    name: "TubeBuddy",
    vendor: "TubeBuddy",
    globals: ["TubeBuddy", "__tubeBuddy__"],
    selectors: ["tubeBuddy-extension", "[data-tubebuddy]", "#tubebuddy-root"]
  },
  {
    id: "pachckjkecffpdphbpmfolblodfkgbhl",
    name: "vidIQ",
    vendor: "vidIQ",
    globals: ["vidIQ", "__vidiq__"],
    selectors: ["[data-vidiq]", "#vidiq-root", "vidiq-extension"]
  },
  {
    id: "liecbddmkiiihnedobmlmillhodjkdmb",
    name: "Loom",
    vendor: "Loom",
    globals: ["__loom__", "loomSDK"],
    selectors: ["loom-toolbar", "[data-loom-ext]", "#loom-companion-mv3"]
  },
  {
    id: "knheggckgoiihginacbkhaalnibhilkk",
    name: "Notion Web Clipper",
    vendor: "Notion",
    globals: ["__notionWebClipperExtension__", "__notion_clipper__"],
    selectors: ["[data-notion-clipper]", "#notion-clipper-root"]
  }
];
function getExtensionSignals() {
  const detected = [];
  for (const ext of AI_EXTENSIONS) {
    let method = null;
    for (const key of ext.globals) {
      try {
        if (window[key] !== void 0) {
          method = "global";
          break;
        }
      } catch (_2) {
      }
    }
    if (!method) {
      for (const sel of ext.selectors) {
        try {
          if (document.querySelector(sel)) {
            method = "dom";
            break;
          }
        } catch (_2) {
        }
      }
    }
    if (method) {
      detected.push({ name: ext.name, vendor: ext.vendor, method });
    }
  }
  return detected;
}

// src/creator.js
var CREATOR_PLATFORM_MAP = {
  // Video
  "studio.youtube.com": { platform: "YouTube Studio", type: "video", tier: "active-creator" },
  "youtube.com": { platform: "YouTube", type: "video", tier: "viewer" },
  "vimeo.com": { platform: "Vimeo", type: "video", tier: "active-creator" },
  "streamyard.com": { platform: "StreamYard", type: "video", tier: "active-creator" },
  "riverside.fm": { platform: "Riverside", type: "podcast", tier: "active-creator" },
  "buzzsprout.com": { platform: "Buzzsprout", type: "podcast", tier: "active-creator" },
  "anchor.fm": { platform: "Anchor/Spotify", type: "podcast", tier: "active-creator" },
  "podcasters.spotify.com": { platform: "Spotify Podcasts", type: "podcast", tier: "active-creator" },
  // Writing / newsletters
  "substack.com": { platform: "Substack", type: "newsletter", tier: "active-creator" },
  "beehiiv.com": { platform: "Beehiiv", type: "newsletter", tier: "active-creator" },
  "convertkit.com": { platform: "ConvertKit", type: "newsletter", tier: "active-creator" },
  "ck.page": { platform: "ConvertKit", type: "newsletter", tier: "active-creator" },
  "mailchimp.com": { platform: "Mailchimp", type: "newsletter", tier: "active-creator" },
  "medium.com": { platform: "Medium", type: "blog", tier: "writer" },
  "ghost.io": { platform: "Ghost", type: "blog", tier: "active-creator" },
  "hashnode.com": { platform: "Hashnode", type: "blog", tier: "writer" },
  "dev.to": { platform: "Dev.to", type: "blog", tier: "writer" },
  // Creator commerce / monetization
  "gumroad.com": { platform: "Gumroad", type: "commerce", tier: "monetized" },
  "stan.store": { platform: "Stan Store", type: "commerce", tier: "monetized" },
  "patreon.com": { platform: "Patreon", type: "membership", tier: "monetized" },
  "ko-fi.com": { platform: "Ko-fi", type: "membership", tier: "monetized" },
  "buymeacoffee.com": { platform: "Buy Me a Coffee", type: "membership", tier: "monetized" },
  "lemon.squeezy.com": { platform: "Lemon Squeezy", type: "commerce", tier: "monetized" },
  "lemonsqueezy.com": { platform: "Lemon Squeezy", type: "commerce", tier: "monetized" },
  "whop.com": { platform: "Whop", type: "community", tier: "monetized" },
  "skool.com": { platform: "Skool", type: "community", tier: "monetized" },
  "circle.so": { platform: "Circle", type: "community", tier: "monetized" },
  "podia.com": { platform: "Podia", type: "course", tier: "monetized" },
  "teachable.com": { platform: "Teachable", type: "course", tier: "monetized" },
  "kajabi.com": { platform: "Kajabi", type: "course", tier: "monetized" },
  "thinkific.com": { platform: "Thinkific", type: "course", tier: "monetized" },
  // Design / content tools
  "canva.com": { platform: "Canva", type: "design", tier: "active-creator" },
  "figma.com": { platform: "Figma", type: "design", tier: "active-creator" },
  "notion.so": { platform: "Notion", type: "productivity", tier: "active-creator" },
  // Social scheduling
  "later.com": { platform: "Later", type: "scheduler", tier: "active-creator" },
  "buffer.com": { platform: "Buffer", type: "scheduler", tier: "active-creator" },
  "hootsuite.com": { platform: "Hootsuite", type: "scheduler", tier: "active-creator" },
  "metricool.com": { platform: "Metricool", type: "scheduler", tier: "active-creator" },
  "planoly.com": { platform: "Planoly", type: "scheduler", tier: "active-creator" }
};
var LINK_IN_BIO_MAP = {
  "linktr.ee": { tool: "Linktree", tier: "beginner" },
  "linktree.com": { tool: "Linktree", tier: "beginner" },
  "beacons.ai": { tool: "Beacons", tier: "intermediate" },
  "beacons.page": { tool: "Beacons", tier: "intermediate" },
  "stan.store": { tool: "Stan Store", tier: "monetized" },
  "bio.site": { tool: "Bio.site", tier: "beginner" },
  "later.com": { tool: "Later Link", tier: "intermediate" },
  "koji.com": { tool: "Koji", tier: "intermediate" },
  "campsite.bio": { tool: "Campsite", tier: "intermediate" },
  "contra.com": { tool: "Contra", tier: "freelancer" },
  "carrd.co": { tool: "Carrd", tier: "intermediate" },
  "milkshake.app": { tool: "Milkshake", tier: "beginner" },
  "taplink.cc": { tool: "Taplink", tier: "beginner" },
  "snipfeed.co": { tool: "Snipfeed", tier: "monetized" },
  "fanlink.tv": { tool: "Fanlink", tier: "intermediate" },
  "withkoji.com": { tool: "Koji", tier: "intermediate" }
};
var UTM_SOURCE_MAP = {
  // Social bio traffic
  "instagram": { source: "Instagram Bio", channel: "social" },
  "tiktok": { source: "TikTok Bio", channel: "social" },
  "twitter": { source: "Twitter/X Bio", channel: "social" },
  "x": { source: "Twitter/X Bio", channel: "social" },
  "youtube": { source: "YouTube Description", channel: "video" },
  "linkedin": { source: "LinkedIn Bio", channel: "social" },
  "pinterest": { source: "Pinterest", channel: "social" },
  // Content channels
  "newsletter": { source: "Newsletter", channel: "email" },
  "email": { source: "Email", channel: "email" },
  "substack": { source: "Substack", channel: "newsletter" },
  "beehiiv": { source: "Beehiiv", channel: "newsletter" },
  "podcast": { source: "Podcast", channel: "audio" },
  "spotify": { source: "Spotify", channel: "audio" },
  // Link-in-bio tools as UTM sources
  "linktree": { source: "Linktree", channel: "bio-link" },
  "beacons": { source: "Beacons", channel: "bio-link" },
  "stan": { source: "Stan Store", channel: "bio-link" },
  // AI (already in ai.js but repeated for completeness)
  "chatgpt": { source: "ChatGPT", channel: "ai" }
};
var UTM_MEDIUM_MAP = {
  "bio": "bio-link",
  "bio_link": "bio-link",
  "link_in_bio": "bio-link",
  "linkinbio": "bio-link",
  "social": "social",
  "email": "email",
  "newsletter": "newsletter",
  "podcast": "podcast",
  "video": "video",
  "description": "video-description"
};
function detectCreatorReferrer() {
  const raw = document.referrer;
  if (!raw) return null;
  try {
    const hostname = new URL(raw).hostname.replace(/^www\./, "");
    if (LINK_IN_BIO_MAP[hostname]) {
      return {
        type: "bio-link",
        ...LINK_IN_BIO_MAP[hostname],
        raw
      };
    }
    if (CREATOR_PLATFORM_MAP[hostname]) {
      return {
        type: "creator-platform",
        ...CREATOR_PLATFORM_MAP[hostname],
        raw
      };
    }
  } catch (_2) {
  }
  return null;
}
function detectUTMSignals() {
  try {
    const params = new URLSearchParams(window.location.search);
    const source = (params.get("utm_source") || "").toLowerCase();
    const medium = (params.get("utm_medium") || "").toLowerCase();
    const campaign = params.get("utm_campaign") || null;
    const content = params.get("utm_content") || null;
    if (!source && !medium && !campaign) return null;
    return {
      source: UTM_SOURCE_MAP[source] || (source || null),
      medium: UTM_MEDIUM_MAP[medium] || (medium || null),
      campaign,
      content
    };
  } catch (_2) {
    return null;
  }
}
function detectCreatorTier(referrer, utm) {
  if (referrer?.tier === "monetized") return "monetized";
  if (referrer?.tier === "active-creator") return "active-creator";
  if (utm?.source?.channel === "bio-link") return "has-bio-link";
  if (utm?.source?.channel === "newsletter") return "has-newsletter";
  if (referrer?.tier === "writer") return "writer";
  if (referrer?.tier === "beginner") return "beginner";
  return null;
}
var CREATOR_STORAGE_KEYS = [
  // YouTube creator tools — extremely high specificity
  { key: "vidiq_user_uuid", tool: "vidIQ", confidence: "high" },
  { key: "vidiq_settings", tool: "vidIQ", confidence: "high" },
  { key: "tubeBuddy_user", tool: "TubeBuddy", confidence: "high" },
  // Screen recording / async video
  { key: "loom_user_id", tool: "Loom", confidence: "high" },
  { key: "loom_access_token_expiry", tool: "Loom", confidence: "high" },
  // Writing tools
  { key: "grammarly-user", tool: "Grammarly", confidence: "medium" },
  { key: "grammarly-session-id", tool: "Grammarly", confidence: "medium" },
  // Productivity / clipping
  { key: "notion_clipper_auth", tool: "Notion Web Clipper", confidence: "high" },
  // Social scheduling
  { key: "__buffer_extension", tool: "Buffer", confidence: "medium" },
  { key: "later_ext_user", tool: "Later", confidence: "medium" }
];
function detectCreatorStorageKeys() {
  const found = [];
  for (const entry of CREATOR_STORAGE_KEYS) {
    try {
      const val = localStorage.getItem(entry.key);
      if (val !== null) found.push({ tool: entry.tool, confidence: entry.confidence });
    } catch (_2) {
    }
  }
  return found.length ? found : null;
}
function getCreatorSignals() {
  const referrer = detectCreatorReferrer();
  const utm = detectUTMSignals();
  const tier = detectCreatorTier(referrer, utm);
  const storageHits = detectCreatorStorageKeys();
  return { referrer, utm, tier, storageHits };
}

// src/engagement.js
function trackEngagement() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let maxScrollDepth = 0;
    let hiddenMs = 0;
    let hiddenSince = null;
    function updateScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0) {
        const pct = Math.round(scrolled / total * 100);
        if (pct > maxScrollDepth) maxScrollDepth = Math.min(pct, 100);
      }
    }
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    function onVisibilityChange() {
      if (document.hidden) {
        hiddenSince = Date.now();
      } else if (hiddenSince !== null) {
        hiddenMs += Date.now() - hiddenSince;
        hiddenSince = null;
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    const OBSERVE_MS = 4e3;
    setTimeout(() => {
      window.removeEventListener("scroll", updateScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      const totalMs = Date.now() - startTime;
      const activeMs = totalMs - hiddenMs;
      const now = /* @__PURE__ */ new Date();
      resolve({
        scrollDepth: maxScrollDepth,
        // 0–100 %
        timeOnPage: Math.round(totalMs / 1e3),
        // seconds
        activeTime: Math.round(activeMs / 1e3),
        // seconds (tab was focused)
        tabWasHidden: hiddenMs > 500,
        // true if tab lost focus at any point
        sessionHour: now.getHours(),
        // 0–23 local hour
        sessionDay: now.getDay()
        // 0=Sun … 6=Sat
      });
    }, OBSERVE_MS);
  });
}

// src/hardware.js
function getGPUInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return { renderer: null, vendor: null, tier: null };
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return { renderer: null, vendor: null, tier: null };
    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || null;
    const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || null;
    return { renderer, vendor, tier: classifyGPU(renderer) };
  } catch (_2) {
    return { renderer: null, vendor: null, tier: null };
  }
}
function classifyGPU(renderer) {
  if (!renderer) return null;
  const r2 = renderer.toLowerCase();
  if (r2.includes("apple m")) return "apple-silicon";
  if (r2.match(/rtx\s*(3|4)\d{3}/)) return "high-end-nvidia";
  if (r2.match(/rtx\s*(2)\d{3}/)) return "mid-high-nvidia";
  if (r2.includes("quadro")) return "workstation-nvidia";
  if (r2.match(/rx\s*(6|7)\d{3}/)) return "high-end-amd";
  if (r2.includes("radeon pro")) return "workstation-amd";
  if (r2.includes("intel iris") || r2.includes("intel hd") || r2.includes("intel uhd")) return "integrated-intel";
  if (r2.includes("apple gpu") || r2.includes("apple a")) return "apple-mobile";
  return "unknown";
}
function getDisplayInfo() {
  const w2 = screen.width;
  const h2 = screen.height;
  const dpr = window.devicePixelRatio || 1;
  const isRetina = dpr >= 2;
  const isTouch = navigator.maxTouchPoints > 0;
  let displayType = "standard";
  if (w2 >= 3440) displayType = "ultrawide";
  else if (w2 >= 2560) displayType = "large-monitor";
  else if (w2 >= 1920 && isRetina) displayType = "4k-retina";
  else if (w2 >= 1440 && isRetina) displayType = "retina-laptop";
  else if (isTouch && w2 >= 1024) displayType = "tablet";
  else if (w2 < 768) displayType = "mobile";
  return {
    width: w2,
    height: h2,
    dpr,
    isRetina,
    isTouch,
    displayType
  };
}
async function getMediaDeviceInfo() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return { audioInputs: null, videoInputs: null, hasProAudio: false, hasProVideo: false };
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter((d2) => d2.kind === "audioinput").length;
    const videoInputs = devices.filter((d2) => d2.kind === "videoinput").length;
    const audioLabels = devices.filter((d2) => d2.kind === "audioinput" && d2.label).map((d2) => d2.label.toLowerCase());
    const videoLabels = devices.filter((d2) => d2.kind === "videoinput" && d2.label).map((d2) => d2.label.toLowerCase());
    const proAudioKeywords = ["focusrite", "scarlett", "rode", "blue yeti", "shure", "audio-technica", "steinberg", "universal audio", "motu", "zoom"];
    const hasProAudio = audioInputs >= 2 || audioLabels.some((l2) => proAudioKeywords.some((k2) => l2.includes(k2)));
    const proVideoKeywords = ["elgato", "capture", "cam link", "magewell", "blackmagic", "obs", "dslr", "mirrorless"];
    const hasProVideo = videoInputs >= 2 || videoLabels.some((l2) => proVideoKeywords.some((k2) => l2.includes(k2)));
    return {
      audioInputs,
      videoInputs,
      hasProAudio,
      hasProVideo,
      // Only include labels if available (requires permission)
      audioLabels: audioLabels.length ? audioLabels : void 0,
      videoLabels: videoLabels.length ? videoLabels : void 0
    };
  } catch (_2) {
    return { audioInputs: null, videoInputs: null, hasProAudio: false, hasProVideo: false };
  }
}
var BASELINE_FONT = "monospace";
var TEST_STRING = "mmmmmmmmmmlli";
var TEST_SIZE = "72px";
function isFontInstalled(fontName) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.font = `${TEST_SIZE} ${BASELINE_FONT}`;
    const baseWidth = ctx.measureText(TEST_STRING).width;
    ctx.font = `${TEST_SIZE} "${fontName}", ${BASELINE_FONT}`;
    const testWidth = ctx.measureText(TEST_STRING).width;
    return testWidth !== baseWidth;
  } catch (_2) {
    return false;
  }
}
var CREATOR_FONTS = [
  // Adobe / premium
  { font: "Adobe Caslon Pro", signal: "adobe-suite" },
  { font: "Proxima Nova", signal: "premium-fonts" },
  { font: "Futura PT", signal: "premium-fonts" },
  { font: "Gotham", signal: "premium-fonts" },
  { font: "Brandon Grotesque", signal: "premium-fonts" },
  { font: "Neue Haas Grotesk", signal: "premium-fonts" },
  // Widely used by creators/designers
  { font: "Lato", signal: "google-fonts-user" },
  { font: "Montserrat", signal: "google-fonts-user" },
  { font: "Raleway", signal: "google-fonts-user" },
  { font: "Playfair Display", signal: "google-fonts-user" },
  // Developer fonts (signals technical creator)
  { font: "JetBrains Mono", signal: "developer" },
  { font: "Fira Code", signal: "developer" },
  { font: "Cascadia Code", signal: "developer" },
  { font: "SF Mono", signal: "apple-developer" }
];
function getFontSignals() {
  const detected = [];
  const signals = /* @__PURE__ */ new Set();
  for (const { font, signal } of CREATOR_FONTS) {
    if (isFontInstalled(font)) {
      detected.push(font);
      signals.add(signal);
    }
  }
  return {
    detectedFonts: detected,
    signals: Array.from(signals)
  };
}
function getAudioContextSignals() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const signals = {
      sampleRate: ctx.sampleRate,
      // 44100=built-in, 48000/96000=pro interface
      maxChannelCount: ctx.destination.maxChannelCount,
      // >2 = multi-channel interface
      baseLatency: ctx.baseLatency != null ? Math.round(ctx.baseLatency * 1e3) : null
      // ms
    };
    ctx.close();
    let audioTier = "consumer";
    if (signals.maxChannelCount > 2 || signals.sampleRate >= 96e3) audioTier = "pro-interface";
    else if (signals.sampleRate === 48e3) audioTier = "pro-or-interface";
    return { ...signals, audioTier };
  } catch (_2) {
    return null;
  }
}
function getDisplayQualitySignals() {
  const mq = (q) => {
    try {
      return window.matchMedia(q).matches;
    } catch (_2) {
      return false;
    }
  };
  return {
    p3ColorGamut: mq("(color-gamut: p3)"),
    // Apple/pro display
    hdrDisplay: mq("(dynamic-range: high)"),
    // HDR-capable display
    darkMode: mq("(prefers-color-scheme: dark)"),
    hoverDevice: mq("(hover: hover)"),
    // mouse/trackpad (not touch)
    finePointer: mq("(pointer: fine)")
    // precise pointer = desktop
  };
}
async function getPermissionSignals() {
  const query = async (name) => {
    try {
      const s2 = await navigator.permissions.query({ name });
      return s2.state;
    } catch (_2) {
      return null;
    }
  };
  const [microphone, camera, notifications] = await Promise.all([
    query("microphone"),
    query("camera"),
    query("notifications")
  ]);
  return {
    microphone,
    camera,
    notifications,
    // Convenience flag: mic or camera already granted = likely used recording tool
    hasRecordingAccess: microphone === "granted" || camera === "granted"
  };
}
async function getHardwareSignals() {
  const [media, permissions] = await Promise.all([
    getMediaDeviceInfo(),
    getPermissionSignals()
  ]);
  const gpu = getGPUInfo();
  const display = getDisplayInfo();
  const displayQuality = getDisplayQualitySignals();
  const fonts = getFontSignals();
  const audioContext = getAudioContextSignals();
  return { gpu, display, displayQuality, audioContext, media, permissions, fonts };
}

// src/score.js
var TIER_LABELS = [
  { min: 75, label: "pro" },
  { min: 50, label: "active" },
  { min: 25, label: "aspiring" },
  { min: 0, label: "consumer" }
];
function computeCreatorScore({ social, creator, ai, extensions, engagement, hardware, device, fingerprint }) {
  let score = 0;
  const reasons = [];
  const cref = creator?.referrer;
  if (cref?.tier === "monetized") {
    score += 25;
    reasons.push("monetized-platform-referrer");
  } else if (cref?.type === "creator-platform") {
    score += 15;
    reasons.push("creator-platform-referrer");
  } else if (cref?.type === "bio-link") {
    score += 10;
    reasons.push("bio-link-referrer");
  }
  if (social?.referrer?.platform === "YouTube Studio") {
    score += 20;
    reasons.push("youtube-studio-referrer");
  }
  const utm = creator?.utm;
  if (utm?.medium === "bio-link" || utm?.medium === "linkinbio") {
    score += 8;
    reasons.push("utm-bio-link");
  }
  if (utm?.source?.channel === "newsletter") {
    score += 8;
    reasons.push("utm-newsletter");
  }
  if (utm?.source?.channel === "video") {
    score += 10;
    reasons.push("utm-video");
  }
  const extCount = extensions?.length || 0;
  if (extCount >= 3) {
    score += 12;
    reasons.push("multiple-ai-extensions");
  } else if (extCount >= 1) {
    score += 6;
    reasons.push("ai-extension-detected");
  }
  if (extensions?.some((e2) => e2.name === "vidIQ")) {
    score += 20;
    reasons.push("vidiq-detected");
  }
  if (extensions?.some((e2) => e2.name === "TubeBuddy")) {
    score += 20;
    reasons.push("tubebuddy-detected");
  }
  if (extensions?.some((e2) => e2.name === "Loom")) {
    score += 12;
    reasons.push("loom-detected");
  }
  if (extensions?.some((e2) => e2.name === "Notion Web Clipper")) {
    score += 8;
    reasons.push("notion-clipper-detected");
  }
  if (extensions?.some((e2) => e2.name === "Grammarly")) {
    score += 5;
    reasons.push("grammarly-installed");
  }
  const iab = social?.inAppBrowser;
  if (iab === "Instagram" || iab === "TikTok") {
    score += 8;
    reasons.push("creator-platform-iab");
  }
  const storageHits = creator?.storageHits || [];
  if (storageHits.some((h2) => h2.tool === "vidIQ" || h2.tool === "TubeBuddy")) {
    score += 20;
    reasons.push("youtube-tool-storage");
  } else if (storageHits.some((h2) => h2.confidence === "high")) {
    score += 12;
    reasons.push("creator-tool-storage-high");
  } else if (storageHits.length > 0) {
    score += 5;
    reasons.push("creator-tool-storage");
  }
  const gpu = hardware?.gpu?.tier;
  if (gpu === "apple-silicon") {
    score += 10;
    reasons.push("apple-silicon");
  } else if (gpu === "high-end-nvidia" || gpu === "workstation-nvidia" || gpu === "workstation-amd") {
    score += 8;
    reasons.push("pro-gpu");
  }
  if (hardware?.media?.hasProAudio) {
    score += 12;
    reasons.push("pro-audio-setup");
  }
  if (hardware?.media?.hasProVideo) {
    score += 12;
    reasons.push("pro-video-setup");
  }
  if ((hardware?.media?.audioInputs || 0) >= 2) {
    score += 5;
    reasons.push("multiple-audio-inputs");
  }
  const audioTier = hardware?.audioContext?.audioTier;
  if (audioTier === "pro-interface") {
    score += 15;
    reasons.push("pro-audio-interface");
  } else if (audioTier === "pro-or-interface") {
    score += 7;
    reasons.push("possible-pro-audio");
  }
  if (hardware?.permissions?.hasRecordingAccess) {
    score += 12;
    reasons.push("recording-access-granted");
  }
  if (hardware?.permissions?.notifications === "granted") {
    score += 4;
    reasons.push("notifications-granted");
  }
  if (hardware?.displayQuality?.p3ColorGamut) {
    score += 6;
    reasons.push("p3-display");
  }
  if (hardware?.displayQuality?.hdrDisplay) {
    score += 4;
    reasons.push("hdr-display");
  }
  const displayType = hardware?.display?.displayType;
  if (displayType === "ultrawide" || displayType === "large-monitor") {
    score += 6;
    reasons.push("large-monitor");
  }
  if (displayType === "retina-laptop" || displayType === "4k-retina") {
    score += 5;
    reasons.push("retina-display");
  }
  const fontSignals = hardware?.fonts?.signals || [];
  if (fontSignals.includes("adobe-suite")) {
    score += 10;
    reasons.push("adobe-fonts");
  } else if (fontSignals.includes("premium-fonts")) {
    score += 6;
    reasons.push("premium-fonts");
  }
  if (fontSignals.includes("developer")) {
    score += 4;
    reasons.push("developer-fonts");
  }
  const mem = device?.deviceMemory || 0;
  const cpu = device?.cpuCores || 0;
  if (mem >= 16 && cpu >= 8) {
    score += 8;
    reasons.push("pro-hardware");
  } else if (mem >= 8 && cpu >= 4) {
    score += 4;
    reasons.push("mid-hardware");
  }
  if ((engagement?.scrollDepth || 0) >= 60) {
    score += 5;
    reasons.push("high-scroll-depth");
  }
  const hour = engagement?.sessionHour;
  if (hour !== void 0 && (hour >= 6 && hour <= 9 || hour >= 19 && hour <= 22)) {
    score += 4;
    reasons.push("creator-hours");
  }
  const visits = hardware === void 0 ? 1 : creator?.referrer ? 1 : 1;
  score = Math.min(score, 100);
  const tier = TIER_LABELS.find((t) => score >= t.min)?.label || "consumer";
  return { score, tier, reasons };
}

// src/core.js
async function scan(options = {}) {
  const { debug = false } = options;
  if (debug) console.log("[BrowserDNA] Collecting signals...");
  const [social, ai, device, fingerprint, engagement, hardware] = await Promise.all([
    Promise.resolve(getSocialSignals()),
    Promise.resolve(getAISignals()),
    getDeviceSignals(),
    getFingerprintSignals(),
    trackEngagement(),
    getHardwareSignals()
  ]);
  const extensions = getExtensionSignals();
  const creator = getCreatorSignals();
  const creatorScore = computeCreatorScore({
    social,
    creator,
    ai,
    extensions,
    engagement,
    hardware,
    device,
    fingerprint
  });
  const payload = {
    url: typeof window !== "undefined" ? window.location.href : null,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    fingerprint,
    creatorScore,
    social,
    ai,
    extensions,
    creator,
    engagement,
    hardware,
    device
  };
  if (debug) {
    console.group("[BrowserDNA] Payload:");
    console.log(JSON.stringify(payload, null, 2));
    console.groupEnd();
  }
  return payload;
}
export {
  computeCreatorScore,
  getAISignals,
  getCreatorSignals,
  getDeviceSignals,
  getExtensionSignals,
  getFingerprintSignals,
  getHardwareSignals,
  getSocialSignals,
  scan,
  trackEngagement
};
