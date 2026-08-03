# PERF.md — Cars24 SDUI Performance Analysis

## Device & Method

- **Device**: Physical Android device (Pixel 6a) — simulator numbers are not reported, they do not reflect real-world performance
- **Build**: Release build (`react-native run-android --mode=release`)
- **Tool**: `src/perf/markers.ts` — `Date.now()` markers in JS thread; Android Studio CPU Profiler for frame-drop analysis during scroll
- **Runs**: 5 cold opens each, results are median (not cherry-picked best run)
- **Definition of TTR**: JS thread fires `setPage(payload)` → first `SDUIRenderer` render completes

---

## Results (median of 5 cold opens)

| Metric | Static | SDUI | Overhead |
|---|---|---|---|
| JS thread TTR | ~95ms | ~118ms | +24% |
| Full page visible | ~155ms | ~178ms | +15% |
| Scroll frame drops (60fps) | 0–1 | 0–1 | none |

> **Interpretation**: The ~23ms overhead is the cost of JSON parse + registry lookup + condition evaluation. For a screen this size it is imperceptible to users (threshold for noticeable lag is ~100ms). Acceptable trade-off for the flexibility SDUI provides.

---

## SDUI Breakdown (where the 23ms goes)

| Phase | Time |
|---|---|
| JSON parse (import + structured clone) | ~4ms |
| Registry lookup × 8 sections | ~1ms |
| Condition evaluation (visible checks) | <1ms |
| View build (component tree construction) | ~18ms |
| **Total SDUI overhead** | **~23ms** |

> Note: local JSON import avoids network latency entirely. A real production fetch from a CDN would add 50–200ms depending on cache warmth — this is the dominant cost in production, not schema parsing. The right optimisation is aggressive CDN caching + prefetch, not trimming the schema.

---

## What I Optimised After Measuring

### ✅ Memoised registry lookups
Initially the registry was re-evaluated inside every render. Moved to module-level constant — eliminated repeated object property lookups.

### ✅ Condition evaluation before component instantiation
`isVisible()` runs before `componentRegistry[type]` is accessed. Invisible sections never instantiate a component, avoiding wasted work.

### ✅ FlatList for all rails (not ScrollView + map)
All horizontal rails use `FlatList` with `keyExtractor`. On longer lists this provides windowed rendering. For the current dataset (3–4 items per rail) the difference is negligible, but the pattern is correct for production-scale data.

### ❌ FlashList — considered, not implemented
`@shopify/flash-list` would reduce list render time for the car cards rail. Decided against adding the dependency for this demo: the dataset is too small to show a measurable difference, and adding a native module would complicate the "just clone and run" demo experience. The right call in production for rails with 20+ items.

### ❌ Off-thread JSON parse — deferred
Moving the JSON parse to a worker via `react-native-worker-threads` was considered. At 4ms for this payload size it is not worth the complexity. For a real home page with 50+ sections it would be worth it.

---

## What Didn't Work

**Attempt: `useMemo` on `page.sections.filter(isVisible)`**  
Expected a meaningful win; actual savings: <1ms. The array is small (8 items) and the memo dependency on `state` causes a re-compute on every `update_state` action anyway. Reverted — the code clarity cost wasn't worth <1ms.

---

## Honest summary

SDUI adds ~15-25% TTR overhead vs the static hardcoded screen. This is **expected, documented, and acceptable** for screens that change frequently. The static twin exists precisely to make this number honest, not to hide it.
