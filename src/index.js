/**
 * @ottoai/browser-dna — Browser script entry (IIFE)
 *
 * Drop on any page — collects signals, fires your callback, exposes data on window.
 * No automatic network requests. You decide what to do with the data.
 *
 * Embed:
 *   <script src="https://unpkg.com/@ottoai/browser-dna/dist/browser-dna.js"
 *     data-trigger="load"
 *     data-debug="false">
 *   </script>
 *
 * Usage:
 *   // Get the payload via callback
 *   window.BrowserDNA.ready(data => {
 *     console.log(data.creatorScore)
 *     fetch('/collect', { method: 'POST', body: JSON.stringify(data) })
 *   })
 *
 *   // Or read it after collection
 *   const data = await window.BrowserDNA.scan()
 */

import { scan } from './core.js';

const DEFAULT_TRIGGER = 'load';

function getConfig() {
  const tag = document.currentScript ||
    document.querySelector('script[src*="browser-dna"]');

  return {
    trigger: (tag?.getAttribute('data-trigger') || DEFAULT_TRIGGER).toLowerCase(),
    debug:   tag?.getAttribute('data-debug') === 'true',
  };
}

const _callbacks = [];
let _result = null;

function fireCallbacks(data) {
  _result = data;
  _callbacks.splice(0).forEach(fn => fn(data));
}

async function collect(config) {
  const data = await scan({ debug: config.debug });
  fireCallbacks(data);
  return data;
}

function init() {
  const config = getConfig();

  window.BrowserDNA = window.BrowserDNA || {};

  // Register a callback — fires immediately if data is already collected
  window.BrowserDNA.ready = (fn) => {
    if (_result) fn(_result);
    else _callbacks.push(fn);
  };

  // Manual scan trigger — returns promise
  window.BrowserDNA.scan = () => collect(config);

  if (config.debug) {
    console.log('[BrowserDNA] Initializing, trigger:', config.trigger);
  }

  if (config.trigger === 'manual') {
    if (config.debug) console.log('[BrowserDNA] Manual mode — call window.BrowserDNA.scan()');
    return;
  }

  if (config.trigger === 'pageview') {
    collect(config);
    const wrap = (fn) => function (...args) { fn(...args); collect(config); };
    history.pushState    = wrap(history.pushState.bind(history));
    history.replaceState = wrap(history.replaceState.bind(history));
    window.addEventListener('popstate', () => collect(config));
    return;
  }

  // Default: 'load'
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    collect(config);
  } else {
    window.addEventListener('DOMContentLoaded', () => collect(config), { once: true });
  }
}

init();
