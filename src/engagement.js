/**
 * Engagement signals
 *
 * Tracks visitor behavior before the payload fires:
 *   - Scroll depth (% of page scrolled)
 *   - Time on page (ms)
 *   - Tab visibility (was the tab actually in focus?)
 *   - Session hour (what time of day locally)
 */

export function trackEngagement() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let maxScrollDepth = 0;
    let hiddenMs = 0;
    let hiddenSince = null;

    // ── Scroll depth ────────────────────────────────────────────────────────
    function updateScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0) {
        const pct = Math.round((scrolled / total) * 100);
        if (pct > maxScrollDepth) maxScrollDepth = Math.min(pct, 100);
      }
    }

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll(); // capture initial position

    // ── Tab visibility ──────────────────────────────────────────────────────
    function onVisibilityChange() {
      if (document.hidden) {
        hiddenSince = Date.now();
      } else if (hiddenSince !== null) {
        hiddenMs += Date.now() - hiddenSince;
        hiddenSince = null;
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    // ── Resolve after a short observation window ────────────────────────────
    // Wait up to 4s so scroll/visibility have time to register,
    // but don't block longer than that.
    const OBSERVE_MS = 4000;

    setTimeout(() => {
      window.removeEventListener('scroll', updateScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      const totalMs = Date.now() - startTime;
      const activeMs = totalMs - hiddenMs;
      const now = new Date();

      resolve({
        scrollDepth:  maxScrollDepth,           // 0–100 %
        timeOnPage:   Math.round(totalMs / 1000), // seconds
        activeTime:   Math.round(activeMs / 1000), // seconds (tab was focused)
        tabWasHidden: hiddenMs > 500,            // true if tab lost focus at any point
        sessionHour:  now.getHours(),            // 0–23 local hour
        sessionDay:   now.getDay(),              // 0=Sun … 6=Sat
      });
    }, OBSERVE_MS);
  });
}
