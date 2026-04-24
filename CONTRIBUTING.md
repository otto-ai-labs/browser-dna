# Contributing to @ottoai/browser-dna

Thanks for taking the time to contribute! Here's how to get involved.

---

## Ways to contribute

- **Report a bug** — a signal is wrong, missing, or throws an error
- **Suggest a signal** — a browser or platform signal you think belongs in the payload
- **Improve the docs** — clearer wording, better examples, typo fixes
- **Submit a fix** — patches to any collector, the score model, or the build config

---

## Reporting bugs

Open an issue and include:

1. Browser and version where the bug occurred
2. OS and device type (e.g. macOS M2, Windows 11, Android)
3. The full error message from the console (if any)
4. Which signal or collector failed (e.g. `hardware.hasProAudio`, `creator.storageArtifacts`)
5. Steps to reproduce — ideally with `data-debug="true"` enabled so you can paste the payload

---

## Suggesting a new signal

Open an issue with:

- What the signal detects
- Why it belongs in a visitor intelligence payload
- Which module it fits into (`social`, `ai`, `device`, `hardware`, `creator`, `extensions`, or new)
- How to detect it (globals, DOM selectors, navigator API, etc.)
- Confidence level and potential false-positive rate

---

## Submitting a pull request

1. **Fork** the repo and create a branch from `main`
2. **Make your changes** — keep them focused and minimal
3. **Test locally** — serve the project (`npx serve .`) and open `test.html` with `data-debug="true"` to verify the payload looks correct
4. **Run the build** — `npm run build` must complete without errors before opening a PR
5. **Open a PR** with a clear description of what changed and why

### Guidelines

- One concern per PR — don't mix a bug fix with a new signal
- Preserve the existing module structure: one concern per file, one named export per collector
- All collector functions must be synchronous or return a `Promise` — never throw, always return a safe fallback value on error
- Use `try/catch` inside collectors — a failed signal should return `null` or an empty value, never crash the whole `scan()`
- `scan()` must remain pure — no network requests, no storage writes, no side effects of any kind
- Don't add new npm dependencies without discussion — the whole point is a small, self-contained bundle
- If adding a new platform to a referrer map, add it to the correct collector file and update `README.md`
- If changing the payload shape, update the example in `README.md`

### Testing checklist

- [ ] `npm run build` completes with no errors
- [ ] `test.html` loads correctly at `http://localhost:PORT/test.html` (not `file://`)
- [ ] Console shows the full payload with `data-debug="true"` — no `undefined` fields
- [ ] The new/changed signal appears in the payload with the correct value
- [ ] No new `console.error` or unhandled promise rejections in the Network or Console tabs
- [ ] `scan()` makes no network requests (check Network tab — it should be empty until you call `send()`)
- [ ] Bundle size hasn't grown by more than ~5kB for a single new signal

---

## Code style

- JavaScript: 2-space indentation, ES2018+ syntax
- Module pattern: named exports only
- All collector functions named `get*Signals()`, `track*()`, or `compute*()`
- Error handling: wrap risky calls in `try/catch`, return `null` on failure — never throw from a collector
- Comments explain *why*, not *what* — skip obvious comments
- Keep lines under 100 characters where practical

---

## Module overview

| File | Responsibility |
|------|---------------|
| `src/core.js` | `scan()` and `send()` — pure collection + optional POST helper |
| `src/index.js` | IIFE browser entry — reads `data-*` config, exposes `window.BrowserDNA` |
| `src/npm.js` | ESM entry — re-exports all public API |
| `src/social.js` | In-app browser UA detection + social referrer mapping |
| `src/ai.js` | AI tool referrer + extension detection |
| `src/extensions.js` | Extension registry + globals/DOM detection |
| `src/device.js` | IP geolocation + UA parsing + navigator signals |
| `src/fingerprint.js` | ThumbmarkJS visitorId (pure read, no storage) |
| `src/hardware.js` | GPU, display, audio, fonts, permissions signals |
| `src/creator.js` | Creator referrers, UTM, tool artifacts, tier inference |
| `src/engagement.js` | Scroll depth, time on page, session signals |
| `src/score.js` | Creator score (0–100) + tier classification |

---

## License

By contributing you agree that your changes will be licensed under the [MIT License](LICENSE).
