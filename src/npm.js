/**
 * @ottoai/browser-dna — npm / ESM entry
 *
 *   import { scan } from '@ottoai/browser-dna'
 *
 *   const data = await scan()
 *   console.log(data.creatorScore)
 *   console.log(data.device.browser)
 *   // do whatever you want with data — send to your API, push to analytics, store it
 */

export { scan } from './core.js';

// Individual collectors for tree-shaking / selective use
export { getSocialSignals }      from './social.js';
export { getAISignals }          from './ai.js';
export { getDeviceSignals }      from './device.js';
export { getFingerprintSignals } from './fingerprint.js';
export { getExtensionSignals }   from './extensions.js';
export { getCreatorSignals }     from './creator.js';
export { trackEngagement }       from './engagement.js';
export { getHardwareSignals }    from './hardware.js';
export { computeCreatorScore }   from './score.js';
