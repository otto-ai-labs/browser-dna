/**
 * Creator Score
 *
 * Aggregates all collected signals into a single creator score (0–100)
 * and a tier label. Higher score = stronger creator signal.
 *
 * Tiers:
 *   consumer      0–24
 *   aspiring     25–49
 *   active       50–74
 *   pro          75–100
 */

const TIER_LABELS = [
  { min: 75, label: 'pro' },
  { min: 50, label: 'active' },
  { min: 25, label: 'aspiring' },
  { min: 0,  label: 'consumer' },
];

export function computeCreatorScore({ social, creator, ai, extensions, engagement, hardware, device, fingerprint }) {
  let score = 0;
  const reasons = [];

  // ── Creator referrer (how they arrived) ──────────────────────────────────

  const cref = creator?.referrer;
  if (cref?.tier === 'monetized') {
    score += 25; reasons.push('monetized-platform-referrer');
  } else if (cref?.type === 'creator-platform') {
    score += 15; reasons.push('creator-platform-referrer');
  } else if (cref?.type === 'bio-link') {
    score += 10; reasons.push('bio-link-referrer');
  }

  // YouTube Studio specifically → confirmed active creator
  if (social?.referrer?.platform === 'YouTube Studio') {
    score += 20; reasons.push('youtube-studio-referrer');
  }

  // ── UTM signals ───────────────────────────────────────────────────────────

  const utm = creator?.utm;
  if (utm?.medium === 'bio-link' || utm?.medium === 'linkinbio') {
    score += 8; reasons.push('utm-bio-link');
  }
  if (utm?.source?.channel === 'newsletter') {
    score += 8; reasons.push('utm-newsletter');
  }
  if (utm?.source?.channel === 'video') {
    score += 10; reasons.push('utm-video');
  }

  // ── AI extensions ─────────────────────────────────────────────────────────

  const extCount = extensions?.length || 0;
  if (extCount >= 3) {
    score += 12; reasons.push('multiple-ai-extensions');
  } else if (extCount >= 1) {
    score += 6; reasons.push('ai-extension-detected');
  }

  // High-specificity creator tools — near-zero false positive
  if (extensions?.some(e => e.name === 'vidIQ')) {
    score += 20; reasons.push('vidiq-detected');
  }
  if (extensions?.some(e => e.name === 'TubeBuddy')) {
    score += 20; reasons.push('tubebuddy-detected');
  }
  if (extensions?.some(e => e.name === 'Loom')) {
    score += 12; reasons.push('loom-detected');
  }
  if (extensions?.some(e => e.name === 'Notion Web Clipper')) {
    score += 8; reasons.push('notion-clipper-detected');
  }
  if (extensions?.some(e => e.name === 'Grammarly')) {
    score += 5; reasons.push('grammarly-installed');
  }

  // ── In-app browser ────────────────────────────────────────────────────────

  const iab = social?.inAppBrowser;
  if (iab === 'Instagram' || iab === 'TikTok') {
    score += 8; reasons.push('creator-platform-iab');
  }

  // ── localStorage storage hits ─────────────────────────────────────────────

  const storageHits = creator?.storageHits || [];
  if (storageHits.some(h => h.tool === 'vidIQ' || h.tool === 'TubeBuddy')) {
    score += 20; reasons.push('youtube-tool-storage');
  } else if (storageHits.some(h => h.confidence === 'high')) {
    score += 12; reasons.push('creator-tool-storage-high');
  } else if (storageHits.length > 0) {
    score += 5;  reasons.push('creator-tool-storage');
  }

  // ── Hardware signals ──────────────────────────────────────────────────────

  const gpu = hardware?.gpu?.tier;
  if (gpu === 'apple-silicon') {
    score += 10; reasons.push('apple-silicon');
  } else if (gpu === 'high-end-nvidia' || gpu === 'workstation-nvidia' || gpu === 'workstation-amd') {
    score += 8; reasons.push('pro-gpu');
  }

  if (hardware?.media?.hasProAudio) {
    score += 12; reasons.push('pro-audio-setup');
  }
  if (hardware?.media?.hasProVideo) {
    score += 12; reasons.push('pro-video-setup');
  }
  if ((hardware?.media?.audioInputs || 0) >= 2) {
    score += 5; reasons.push('multiple-audio-inputs');
  }

  // AudioContext — pro audio interface signal
  const audioTier = hardware?.audioContext?.audioTier;
  if (audioTier === 'pro-interface') {
    score += 15; reasons.push('pro-audio-interface');
  } else if (audioTier === 'pro-or-interface') {
    score += 7;  reasons.push('possible-pro-audio');
  }

  // Permissions — pre-granted mic/camera = used a recording tool before
  if (hardware?.permissions?.hasRecordingAccess) {
    score += 12; reasons.push('recording-access-granted');
  }
  if (hardware?.permissions?.notifications === 'granted') {
    score += 4;  reasons.push('notifications-granted');
  }

  // Display quality — P3 / HDR = pro display
  if (hardware?.displayQuality?.p3ColorGamut) {
    score += 6;  reasons.push('p3-display');
  }
  if (hardware?.displayQuality?.hdrDisplay) {
    score += 4;  reasons.push('hdr-display');
  }

  // Display
  const displayType = hardware?.display?.displayType;
  if (displayType === 'ultrawide' || displayType === 'large-monitor') {
    score += 6; reasons.push('large-monitor');
  }
  if (displayType === 'retina-laptop' || displayType === '4k-retina') {
    score += 5; reasons.push('retina-display');
  }

  // Fonts
  const fontSignals = hardware?.fonts?.signals || [];
  if (fontSignals.includes('adobe-suite')) {
    score += 10; reasons.push('adobe-fonts');
  } else if (fontSignals.includes('premium-fonts')) {
    score += 6; reasons.push('premium-fonts');
  }
  if (fontSignals.includes('developer')) {
    score += 4; reasons.push('developer-fonts');
  }

  // ── Device / browser signals ──────────────────────────────────────────────

  const mem = device?.deviceMemory || 0;
  const cpu = device?.cpuCores || 0;
  if (mem >= 16 && cpu >= 8) {
    score += 8; reasons.push('pro-hardware');
  } else if (mem >= 8 && cpu >= 4) {
    score += 4; reasons.push('mid-hardware');
  }

  // ── Engagement signals ────────────────────────────────────────────────────

  if ((engagement?.scrollDepth || 0) >= 60) {
    score += 5; reasons.push('high-scroll-depth');
  }

  // Creator hours: early morning (6–9) or evening (19–22)
  const hour = engagement?.sessionHour;
  if (hour !== undefined && ((hour >= 6 && hour <= 9) || (hour >= 19 && hour <= 22))) {
    score += 4; reasons.push('creator-hours');
  }

  // ── Returning visitor ─────────────────────────────────────────────────────

  const visits = hardware === undefined ? 1 : (creator?.referrer ? 1 : 1); // placeholder
  // Use fingerprint visitCount if available in the payload — handled by caller

  // ── Cap at 100 ────────────────────────────────────────────────────────────

  score = Math.min(score, 100);

  const tier = TIER_LABELS.find(t => score >= t.min)?.label || 'consumer';

  return { score, tier, reasons };
}
