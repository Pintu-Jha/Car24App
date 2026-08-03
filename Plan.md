# Cars24 SDUI Assignment — Build Plan (React Native + TypeScript)

## 0. What they're actually grading

| Dimension | Weight | Translation |
|---|---|---|
| Architecture & solution quality | 30% | Is your JSON schema clean, extensible, and does it not crash? |
| AI collaboration | 30% | Can you drive AI like a senior engineer — brief it, catch its mistakes, verify it? |
| Generalization (coverage) | 20% | Live test: they give you an unseen screen, you write JSON for it in front of them |
| Performance rigor | 10% | Did you measure honestly, not just claim "SDUI is fast"? |
| Ownership & judgment | 10% | Can you explain every line? Did you scope smartly under time pressure? |

**Read this twice:** the schema is the interview. Everything else (perf numbers, docs, video) exists to prove the schema holds up. Spend your best thinking hours on schema design, not on polishing the static screen.

---

## 1. Timebox strategy (72h wall clock, ~8-10h focused effort)

Don't spread evenly. Front-load schema design — it's the spine everything else hangs off.

| Phase | Time | Output |
|---|---|---|
| 1. Screen selection + JSON schema design | 1.5h | `schema.ts` types, sample JSON for home page |
| 2. Component registry + renderer core | 2h | Renderer that maps `type` → native component, handles unknown fallback |
| 3. Actions system | 1h | Tap/select/navigate driven entirely by JSON |
| 4. Build the SDUI home screen from JSON | 1.5h | Working screen matching Cars24 home page |
| 5. Build the static (hardcoded) twin screen | 1h | Same screen, zero SDUI, for benchmarking |
| 6. Perf instrumentation + PERF.md | 1h | Real TTR/TTI/scroll numbers on a real device |
| 7. Coverage exercise (pick a 2nd Cars24 screen mentally, test schema against it) | 1h | COVERAGE.md with honest %, what breaks |
| 8. AI_WORKFLOW.md + README + versioning writeup | 1h | Docs |
| 9. Screen recording | 0.5h | 3-5 min demo |

Buffer: leave ~4-6h slack in the 72h window for the unexpected (device issues, a broken carousel lib, etc.) — don't burn it all in one sitting.

---

## 2. Screen choice — real Cars24 home screen (from screen recording)

Confirmed sections, top to bottom, as they actually appear in the app:

1. **Sticky header** — location pin + city, search bar, notification/profile icons
2. **Hero banner carousel** — full-width promo banners, dot indicators, auto-scroll
3. **Category quick-links** — icon + label grid (Buy Car, Sell Car, Loan, Insurance...)
4. **"Cars in your budget" rail** — horizontal car cards: image, price, EMI, badge (e.g. "Great Price")
5. **Body type filter chips** — Hatchback / Sedan / SUV / etc., horizontally scrollable — **this is the interactive SDUI action**: selecting a chip re-filters the rail below via `update_state`, same pattern as the brief's tenure-selector example
6. **Recommended cars grid** — 2-column vertical grid, more detail per card (KM driven, fuel, year, price)
7. **Value-prop / trust strip** — icon + short text row (e.g. "5-day money back", "140-point inspection")
8. **Sell-your-car CTA banner** — single large tappable banner
9. **Footer** — links / bottom nav

That's 9 section types, two rail/carousel patterns + one grid, and a real interactive filter chip → rail update — well over the complexity bar (5 section types, 1 rail, 1 grid, 1 interactive element).

**Component registry types to build (map 1:1 to sections above):**
`header_search`, `banner_carousel`, `category_quicklinks`, `car_card_rail`, `filter_chips`, `car_card_grid`, `value_prop_strip`, `cta_banner`, `footer_links`

---

## 3. JSON Schema Design (the heart of the assignment)

Design principles:
- **Component = type + props + children/data**, nothing native leaks into JSON (no "marginTop: 12" chaos — use a constrained style token system)
- **Every interactive element expresses its behavior as an Action**, never hardcoded onPress logic
- **Unknown types must be structurally ignorable** — the schema shouldn't need a code change just to *not crash*

### 3.1 Top-level page schema

```typescript
// schema.ts
interface SDUIPage {
  schemaVersion: string;        // "1.0.0" — versioning story lives here
  pageId: string;
  meta: {
    title: string;
    minClientVersion?: string;  // client refuses/degrades if below this
  };
  sections: SDUISection[];
}

interface SDUISection {
  id: string;                   // stable key for React lists
  type: string;                 // registry lookup key, e.g. "banner_carousel"
  visible?: SDUICondition;      // optional conditional rendering
  props: Record<string, unknown>; // component-specific, typed per-component
  data?: SDUIDataItem[];        // for list/rail/grid-type components
  action?: SDUIAction;          // section-level tap action (e.g. whole banner tappable)
}

interface SDUIDataItem {
  id: string;
  props: Record<string, unknown>;
  action?: SDUIAction;
}
```

### 3.2 Action schema (this is what proves "not hardcoded")

```typescript
type SDUIAction =
  | { type: "navigate"; screen: string; params?: Record<string, unknown> }
  | { type: "open_sheet"; sheetId: string; payload?: Record<string, unknown> }
  | { type: "update_state"; stateKey: string; value: unknown }  // e.g. tenure selector -> EMI recompute
  | { type: "api_call"; endpoint: string; method: string }       // stubbed/mocked
  | { type: "deep_link"; url: string };
```

The tenure-selector-updates-EMI example from the brief: chip selection fires `update_state`, a local state store keyed by `stateKey` re-renders any section whose props reference that key (simple pub-sub or just React context + reducer — don't over-engineer this with Redux for a demo, though mention Redux Toolkit as the "at scale" answer in your README since it's your real production stack).

### 3.3 Component registry

```typescript
// registry.ts
const componentRegistry: Record<string, React.ComponentType<any>> = {
  header_search: HeaderSearch,
  banner_carousel: BannerCarousel,
  category_quicklinks: CategoryQuicklinks,
  car_card_rail: CarCardRail,
  filter_chips: FilterChips,       // drives car_card_rail via update_state
  car_card_grid: CarCardGrid,
  value_prop_strip: ValuePropStrip,
  cta_banner: CTABanner,
  footer_links: FooterLinks,
};

function SDUIRenderer({ page }: { page: SDUIPage }) {
  return (
    <ScrollView>
      {page.sections.map((section) => {
        const Component = componentRegistry[section.type];
        if (!Component) {
          return <UnknownComponentFallback key={section.id} section={section} />;
        }
        return <Component key={section.id} {...section} />;
      })}
    </ScrollView>
  );
}
```

### 3.4 Unknown component fallback

Two things to actually build (not just describe):
1. **Silent-safe fallback**: renders a zero-height/empty view + logs a warning — page never crashes, never shows visible garbage to a real user.
2. **Dev-mode visible fallback**: a dashed-border placeholder card showing `type` and raw props — this is what you show in the screen recording, since "graceful fallback" needs to be *demonstrated*, not just claimed.

```typescript
function UnknownComponentFallback({ section }: { section: SDUISection }) {
  if (__DEV__) {
    return (
      <View style={styles.fallbackDev}>
        <Text>Unknown component: {section.type}</Text>
      </View>
    );
  }
  return null; // production: fail silently, never crash
}
```

### 3.5 Versioning story (README section, not necessarily code)

Cover:
- `schemaVersion` on the page payload + `minClientVersion` in meta
- Old client + new unknown component type → falls back gracefully (already built above)
- New client + old server payload → registry is additive-only; old types still resolve
- Breaking changes (e.g., renamed prop) → version-gate on the server: serve v1 schema to old app builds via a client-version header, v2 to new ones
- Mention this is exactly the pattern behind tools like Shopify's or Airbnb's SDUI — you studied the prior art per the FAQ allowance, but built your own

---

## 4. Tech stack (map to what you already know — don't learn new tools this week)

- **State**: React Context + useReducer for the SDUI action bus (simple, demonstrable). Note in README that Zustand/Redux Toolkit is what you'd use in production — you already have that skill, no need to prove it here.
- **Lists**: FlatList for rails/grids (or FlashList if you want a perf argument — you can cite it in PERF.md as an optimization attempt)
- **Carousel**: build a thin one on top of FlatList with `pagingEnabled` rather than pulling in a heavy lib — fewer unknowns, matches "own the schema" spirit
- **Bottom sheet**: `@gorhom/bottom-sheet` is fine to use as-is (not part of what they're evaluating)
- **Navigation**: React Navigation (you already know this)
- **Perf measurement**: `react-native-performance` or manual `Date.now()` markers + Android Studio Profiler / Xcode Instruments for frame drops — you already used adb screenrecord + GPU rendering bars for the Pilgrim audit, reuse that exact toolkit here
- **Mock server**: local JSON file imported directly, OR a tiny Express server if you want the "network fetch" step to be real in your TTR breakdown (JSON fetch/parse vs view-build time is a required metric — a local static import won't show fetch time, so lean toward a tiny local Express server or JSON Server for honesty)

---

## 5. PERF.md structure

```markdown
# PERF.md

## Device & Method
- Device: [physical device model, not simulator — simulators lie about perf]
- Build: release build (not dev/debug — debug numbers are meaningless)
- Tool: adb screenrecord + frame counting, Android Studio Profiler for GPU bars
- Runs: [N] cold opens each, report median not single run

## Metrics

| Metric | Static | SDUI | Overhead |
|---|---|---|---|
| TTR | Xms | Yms | +Z% |
| TTI | Xms | Yms | +Z% |
| Full page render | Xms | Yms | +Z% |
| Dropped frames (scroll) | X | Y | +Z% |

## SDUI breakdown
- JSON fetch: Xms
- JSON parse: Xms
- View build: Xms

## What I optimized after measuring
- [e.g., memoized registry lookups, moved JSON parse off first render, virtualized rails]
- [what didn't work and why — this is what they want, not just wins]
```

Be honest if SDUI is 15-20% slower on TTR — that's expected and fine. The scoring text explicitly says "no pass/fail number," they're scoring honesty + the optimize loop.

---

## 6. COVERAGE.md structure

```markdown
# COVERAGE.md

## Component registry
[table: type, what it renders, props it accepts]

## Expressiveness
- Lists/grids: yes, via `data` array on any section
- Conditionals: yes, via `visible` condition object
- Actions: yes, via SDUIAction union
- Style overrides: [what's tokenized vs hardcoded — be honest about limits]

## Honest coverage claim
"Given a new Cars24 screen (e.g., Car Detail Page), an estimated X% renders
JSON-only using existing component types (header, image gallery as a rail,
value-prop strip, CTA). The remaining Y% — e.g., a spec-comparison table,
an EMI calculator widget — would need N new component types, estimated
M minutes each to add given the registry pattern already in place."

## Self-test
I mentally walked the [Car Details / Listing / Filter] page against my
schema. Findings: [what worked, what a new component would need]
```

Do this self-test on a *second real screen* before submission — it's exactly what they'll do live in the interview, so rehearsing it once yourself is the highest-leverage prep you can do.

---

## 7. AI_WORKFLOW.md structure

This is 30% of the score — treat it like a real deliverable, not an afterthought.

```markdown
# AI_WORKFLOW.md

## Tool stack
[Claude Code / Cursor / Copilot — whatever you actually used]

## Context/rules files
[Paste or summarize the CLAUDE.md / .cursorrules you wrote to brief the AI
on your schema conventions, naming, folder structure]

## Three prompt → outcome stories
1. Prompt: "..." 
   Output: [what AI gave you]
   Rejected/rewrote: [specifically what was wrong and why]

2. ...
3. ...

## One AI failure
[e.g., AI suggested storing style overrides as raw inline style objects
in JSON — you caught that this breaks the "no native leaking into JSON"
principle and re-designed with a style-token enum instead]

## Verification strategy
- TypeScript strict mode catches schema drift
- [manual testing per component]
- [how you verified the fallback actually doesn't crash — did you feed
it a deliberately malformed payload?]
```

Write this section for real, as you go — don't reconstruct it from memory on day 3. Keep a running scratch note of prompts you send.

---

## 8. Repo structure

```
cars24-sdui/
├── README.md
├── PERF.md
├── COVERAGE.md
├── AI_WORKFLOW.md
├── src/
│   ├── schema/
│   │   ├── types.ts          # SDUIPage, SDUISection, SDUIAction
│   │   └── sample-home.json  # mock server payload
│   ├── sdui/
│   │   ├── SDUIRenderer.tsx
│   │   ├── registry.ts
│   │   ├── ActionBus.tsx     # context + reducer for update_state actions
│   │   └── UnknownFallback.tsx
│   ├── components/           # the actual native components in the registry
│   │   ├── HeaderSearch.tsx
│   │   ├── BannerCarousel.tsx
│   │   ├── CategoryQuicklinks.tsx
│   │   ├── CarCardRail.tsx
│   │   ├── FilterChips.tsx        # interactive: filters CarCardRail via update_state
│   │   ├── CarCardGrid.tsx
│   │   ├── ValuePropStrip.tsx
│   │   ├── CTABanner.tsx
│   │   └── FooterLinks.tsx
│   ├── static/
│   │   └── StaticHomeScreen.tsx   # hardcoded twin, for PERF.md comparison
│   ├── perf/
│   │   └── markers.ts        # TTR/TTI instrumentation
│   └── mock-server/          # optional tiny Express/JSON-server
├── android/ ios/              # RN scaffolding
└── package.json
```

---

## 9. Screen recording checklist (3-5 min)

1. Cold open SDUI screen — full page renders (0:30)
2. Tap category chip → content changes via `update_state` action, no hardcoded logic visible in a quick code cutaway (0:45)
3. Tap a car card → navigation intent fires (0:20)
4. Trigger unknown component fallback — swap JSON to include a bogus `type`, reload, show it degrades instead of crashing (0:45)
5. **Live JSON edit**: change a prop (e.g., banner image or chip label) in the JSON file, re-run without touching client code, show the page changed (1:00)
6. Quick voiceover on PERF numbers + coverage claim (0:30)

---

## 10. Cut list if you run short on time

Priority order — cut from the bottom if the 8-10h budget is tight:
1. ~~Never cut~~: schema, registry, fallback, one action type, PERF.md, AI_WORKFLOW.md
2. Cut second AI failure story down to one paragraph
3. Cut FlashList optimization attempt — note it as "considered but not implemented, here's why" in PERF.md
4. Cut footer CTA to a static, non-SDUI element with a written note
5. Never cut the live JSON-edit demo — it's the single highest-signal 60 seconds in the whole submission

---

## Bottom line

They're not grading whether you can build a home screen. They're grading whether your schema would survive being handed to someone else, on a screen you've never seen, under time pressure — while you explain your AI usage like a senior engineer would. Spend disproportionate time on section 3 (schema) and section 7 (AI workflow docs); those two carry 60% of the score between them.