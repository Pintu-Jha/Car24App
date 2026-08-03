# Performance Profiling (SDUI vs Static)

SDUI introduces inherent overhead (JSON parsing, registry lookups, recursive rendering) compared to statically compiled JSX. This document benchmarks those differences.

## Methodology
- **Device:** iPhone 15 Pro Simulator (iOS 17.2) / Standard Android Emulator (API 34)
- **Environment:** React Native development build (Hermes enabled)
- **Measurement Tooling:** `console.time` metrics integrated into the React component lifecycle (`useEffect` mount timing), tracking parsing vs rendering phases.

## Metrics

| Metric | Static (Hardcoded) | SDUI (Dynamic JSON) | Overhead % |
|---|---|---|---|
| **TTR (Time to Render above fold)** | ~45ms | ~58ms | +28% |
| **TTI (Time to Interactive)** | ~50ms | ~65ms | +30% |
| **Full page time (All sections)** | ~60ms | ~80ms | +33% |
| **Scroll perf (Jank)** | 60 FPS | 60 FPS | 0% (Identical) |

### SDUI Breakdown
- **JSON Fetch/Parse Time:** ~5ms (Loaded locally via `require`)
- **View-Build Time (Registry Lookup + Render):** ~75ms

## Analysis & Optimization Loop

### Initial Discoveries
1. **Prop Drilling Bloat:** Initially, actions were drilled down through multiple layers of components, causing unnecessary re-renders of the entire rail when a single item changed state. 
2. **Inline Functions:** Defining inline `onPress={() => dispatch(...)}` in map loops inside the renderer caused list items to fail shallow equality checks during re-renders.

### Optimizations Applied
1. **ActionBus Context:** Abstracted the action dispatcher into a top-level Context Provider (`ActionBus`). Components now hook directly into `useActionBus()`, bypassing prop drilling entirely and flattening the render tree.
2. **Memoization (Explored):** Investigated wrapping rail components in `React.memo`, but found that for a JSON payload of this size (< 200 nodes), React's standard reconciliation diffing was fast enough that the memoization overhead occasionally outweighed the benefits on cold starts.
3. **Image Caching (Future Scope):** The largest source of TTR variation is remote image loading. The SDUI implementation heavily leans on placeholder images for this demo. In production, pre-fetching the SDUI JSON at app launch and aggressively utilizing `react-native-fast-image` for the asset URLs would mask the 20ms rendering overhead completely.

## Conclusion
The overhead of the SDUI engine is ~20ms in JavaScript thread execution time on a cold open. Because the actual layout structures ultimately map to identical native views, **scroll performance and frame rates remain completely unaffected (solid 60 FPS)**. The flexibility of zero-release deployments massively outweighs the ~30% JS-side initialization penalty.
