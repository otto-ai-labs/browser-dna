/**
 * Visitor fingerprinting via ThumbmarkJS
 * - Generates a stable visitorId hash (~90% accuracy, no server needed)
 * - Pure read — no localStorage writes, no side effects
 */

import { getFingerprint } from '@thumbmarkjs/thumbmarkjs';

export async function getFingerprintSignals() {
  try {
    const id = await getFingerprint();
    return { id };
  } catch (_) {
    return { id: null };
  }
}
