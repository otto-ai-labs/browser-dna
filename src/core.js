/**
 * @ottoai/browser-dna — Core collector
 *
 * Shared by both the browser script (IIFE) and the npm ESM package.
 * Export: scan(options?) — collect all signals, return payload object
 */

import { getSocialSignals }      from './social.js';
import { getAISignals }          from './ai.js';
import { getDeviceSignals }      from './device.js';
import { getFingerprintSignals } from './fingerprint.js';
import { getExtensionSignals }   from './extensions.js';
import { getCreatorSignals }     from './creator.js';
import { trackEngagement }       from './engagement.js';
import { getHardwareSignals }    from './hardware.js';
import { computeCreatorScore }   from './score.js';

/**
 * Collect all browser DNA signals and return the full payload object.
 *
 * @param {object} [options]
 * @param {boolean} [options.debug] - Log payload to console
 * @returns {Promise<object>}
 *
 * @example
 * import { scan } from '@ottoai/browser-dna'
 * const data = await scan()
 * console.log(data.creatorScore)
 * console.log(data.device.browser)
 */
export async function scan(options = {}) {
  const { debug = false } = options;

  if (debug) console.log('[BrowserDNA] Collecting signals...');

  const [social, ai, device, fingerprint, engagement, hardware] = await Promise.all([
    Promise.resolve(getSocialSignals()),
    Promise.resolve(getAISignals()),
    getDeviceSignals(),
    getFingerprintSignals(),
    trackEngagement(),
    getHardwareSignals(),
  ]);

  const extensions   = getExtensionSignals();
  const creator      = getCreatorSignals();
  const creatorScore = computeCreatorScore({
    social, creator, ai, extensions, engagement, hardware, device, fingerprint,
  });

  const payload = {
    url:       typeof window !== 'undefined' ? window.location.href : null,
    timestamp: new Date().toISOString(),
    fingerprint,
    creatorScore,
    social,
    ai,
    extensions,
    creator,
    engagement,
    hardware,
    device,
  };

  if (debug) {
    console.group('[BrowserDNA] Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.groupEnd();
  }

  return payload;
}
