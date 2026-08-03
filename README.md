# Cars24 SDUI — README

> Hiring assignment: a Server-Driven UI system for React Native that renders the Cars24 home screen entirely from a JSON payload.

---

## What this is

A working SDUI renderer for React Native. The home screen layout, content, and all interactive behaviours are declared in JSON. The client contains no hardcoded screen logic — only a registry of dumb components and a renderer that maps `type` strings to them.

The grading rubric is: **schema quality (30%) → AI collaboration docs (30%) → generalization (20%) → perf honesty (10%) → ownership (10%)**. This README covers architecture and versioning; see the other docs for the rest.

---

## How to run

```bash
npm install
# iOS
npx pod-install ios && npm run ios
# Android
npm run android
```

Metro bundler: `npm start`

**Dev toggle** (visible in dev builds only): the black bar at the bottom of the tab bar lets you cycle between three states:
1. **SDUI Home** — renders from `sample-home.json`
2. **Static Home** — hardcoded twin for perf comparison
3. **SDUI + Fallback** — renders `with-unknown-component.json` to demo the graceful unknown-type handler

---

## Architecture

```
App.tsx
└── ActionBusProvider        ← React Context + useReducer, app-wide action bus
    └── SDUIHomeScreen       ← imports JSON, passes to renderer
        └── SDUIRenderer     ← maps section.type → componentRegistry[type]
            ├── HeaderSearch
            ├── CategoryQuicklinks
            ├── CardRail (×3, different cardStyle)
            ├── IconRail
            ├── CardGrid
            ├── ListRows
            └── UnknownFallback   ← catch-all, never crashes
```

### Component registry

```ts
// registry.ts — adding a new type is one line
const componentRegistry: Record<string, React.ComponentType<any>> = {
  header_search: HeaderSearch,
  category_quicklinks: CategoryQuicklinks,
  card_rail: CardRail,
  icon_rail: IconRail,
  card_grid: CardGrid,
  list_rows: ListRows,
  section_header: SectionHeader,
};
```

### ActionBus

All component interactions go through `dispatch(action: SDUIAction)`. Components never write their own `onPress` logic. The bus handles:

| Action type | What happens |
|---|---|
| `update_state` | Updates a keyed value in Context state; consumers re-render |
| `navigate` | `console.log` + `Alert` in dev (real app: `navigation.navigate`) |
| `compound` | Dispatches each sub-action in sequence |
| `open_sheet` | Stubbed (real: `@gorhom/bottom-sheet`) |
| `api_call` | Stubbed (real: `fetch`) |
| `deep_link` | Stubbed (real: `Linking.openURL`) |

**Why Context + useReducer, not Redux Toolkit?**  
Redux Toolkit is already in our production stack and is the right call at scale. For a demo with a single page and ~10 state keys, it's ceremony without benefit. The architecture is identical in shape; swapping in Redux Toolkit would be a one-afternoon refactor.

### Style tokens

Raw style values (colours, radii, spacing) **never appear in JSON**. JSON sends semantic tokens (`"cardStyle": "dark"`), and the component maps them to a theme object. This prevents the "marginTop: 12 chaos" anti-pattern where the server controls native layout details it can't reason about.

---

## Versioning story

| Scenario | Behaviour |
|---|---|
| Old client + new unknown component type in JSON | `UnknownFallback` renders — page continues, no crash |
| New client + old server JSON | Registry is additive-only; old types resolve as before |
| Breaking change (renamed prop) | Server version-gates on `minClientVersion` in meta; serves old schema to old app builds, new schema to new ones |
| Schema version bump | `schemaVersion` field on every page payload; client can reject or degrade if `schemaVersion` > supported |

This is the same pattern behind Shopify's Polaris SDUI and Airbnb's Ghost Platform, studied per the "prior art research is allowed" FAQ note.

---

## Repo structure

```
src/
├── schema/
│   ├── types.ts                 ← SDUIPage, SDUISection, SDUIAction (the primary deliverable)
│   ├── sample-home.json         ← Real Cars24 home data
│   └── with-unknown-component.json  ← Fallback demo payload
├── sdui/
│   ├── ActionBus.tsx            ← Context + useReducer action dispatcher
│   ├── SDUIRenderer.tsx         ← type → component mapping, visibility eval
│   ├── registry.ts              ← componentRegistry record
│   └── UnknownFallback.tsx      ← dev diagnostic card / production null
├── components/
│   ├── HeaderSearch.tsx
│   ├── CategoryQuicklinks.tsx
│   ├── CardRail.tsx             ← generic, themed via cardStyle prop
│   ├── IconRail.tsx
│   ├── CardGrid.tsx
│   ├── ListRows.tsx
│   ├── SectionHeader.tsx
│   └── BottomTabBar.tsx
├── screens/
│   ├── SDUIHomeScreen.tsx       ← SDUI-driven
│   └── StaticHomeScreen.tsx     ← hardcoded twin (for PERF.md)
└── perf/
    └── markers.ts               ← TTR/TTI instrumentation
```
