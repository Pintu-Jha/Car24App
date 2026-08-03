---
trigger: always_on
---

# Cars24 SDUI — Screen Spec & Component Registry

Part 1 of 3. Read alongside `schema-and-json.md` (part 2: TS types + sample JSON) and
`build-plan.md` (part 3: actions/fallback/perf/build-order) before writing code. This file:
what the real screen looks like, and the component registry it maps to.

---

## 0. What this project is

A Server-Driven UI (SDUI) system for React Native that renders the Cars24 app home screen
entirely from a JSON payload — no hardcoded layout. Deliverable for a hiring assignment.
Grading: 30% architecture, 30% AI-collaboration docs, 20% generalization/coverage,
10% perf rigor, 10% ownership/judgment. **The schema is the actual product being evaluated.**

Non-negotiables:
- Renderer must NEVER crash on an unknown component type — graceful fallback required
- Every interactive element's behavior must be expressed in JSON as an "action," never
  as hardcoded onPress logic in a component
- Must also build a hardcoded static twin of the same screen, for perf comparison
- Must produce README.md, PERF.md, COVERAGE.md, AI_WORKFLOW.md
- Must produce a 3-5 min screen recording (build the app so this is easy to demo: keep a
  toggle or two JSON files — "with-unknown-component.json" and normal — so the fallback
  demo and live-edit demo are trivial to trigger on camera)

---

## 1. Reference screen (real data, from a screen recording of the live Cars24 app)

The home screen, top to bottom, in actual order:

1. **Sticky header** — location pin + city name ("Bangalore"), dropdown chevron, search bar
   with placeholder text that cycles ("Search Swift", "Search Alto", "Search Baleno" —
   rotating placeholder, treat as a prop `searchPlaceholders: string[]`), profile avatar
   circle (initials, e.g. "PJ") top right.
2. **Category quick-links row** — horizontal icon+label items just under the search bar:
   All, Buy used car, Sell car, Loans, Challan, Car check, Insurance (scrollable, more off
   right edge). Each has a circular icon background and a label below. One is "active"
   (underlined) at a time — tapping switches the active state AND changes the page below
   (in the real app it deep-links to a different tab; for this assignment treat it as
   `update_state` + `navigate` combined action).
3. **Buy car banner rail** — section header "Buy car" with a red pill badge ("Up to
   ₹80,000 off"), horizontal rail of dark-blue cards: "All used cars", "Budget used cars",
   "Premium used cars", "New cars" (partially visible) — each card has a title + car image.
4. **Sell your car rail** — section header "Sell your car", horizontal rail of green cards:
   "Sell your car", "Check car valuation", "Scrap your car", one more off-edge — each with
   an icon/photo (hand exchanging keys, cash, damaged car).
5. **Get loans rail** — section header "Get loans", horizontal rail of circular-image items
   (not cards — icon-style): "Used car loan", "Loan against car", "Personal loan",
   "Credit score" — image on top, label below, no card background.
6. **Car check services rail** — section header "Car check services", horizontal rail of
   cream/beige cards: "New car PDI", "Used car check", "Vehicle history" (+ more) — each
   with a photo and title.
7. **"Buy smarter with our checks" grid** — 2-up card grid (not a rail — wraps),
   e.g. "New car PDI — Pre delivery inspection" / "Used car check — 300+ point evaluation",
   each with a photo.
8. **"Uncover frauds before you buy" list** — vertical list rows (not cards), each row:
   small square photo/icon left, title + subtitle text middle, chevron right.
   Items: "Vehicle history report — Service records and Accidental check",
   "Odometer fraud check — 20% cars show odometer fraud",
   "RTO check — 15% cars have RC mismatches".
9. **Bottom tab bar** (persistent, not part of scroll content): Home, Activity, My Garage,
   Showrooms, Explore.

Color theming note: each category tab, when active, recolors the whole top header/rail
zone (blue → green → dark red → brown as you switch tabs in the real app). **Skip this
theming complexity for the assignment** — note in COVERAGE.md as an example of something
that would need a new "theme token" concept in the schema, which is a good honest coverage
gap to report rather than something to build.

---

## 2. Component registry (build these 8 component types)

| type | renders | data shape |
|---|---|---|
| `header_search` | location + search bar + avatar | static props, no data array |
| `category_quicklinks` | horizontal icon+label row, one active | `data: QuickLink[]` |
| `card_rail` | generic horizontal rail — reused for buy-car, sell-car, car-check sections (theme via `props.cardStyle: "dark"｜"accent"｜"cream"`) | `data: RailCard[]` |
| `icon_rail` | horizontal rail, icon-style no card bg — for loans section | `data: IconItem[]` |
| `card_grid` | 2-column wrapping grid — for "Buy smarter" section | `data: GridCard[]` |
| `list_rows` | vertical list, icon+title+subtitle+chevron — for "Uncover frauds" section | `data: ListRow[]` |
| `section_header` | title text + optional badge pill (e.g. "Up to ₹80,000 off") — used standalone above rails OR as `props.header` on a rail/grid section, your call which is cleaner | `props: {title, badge?}` |
| `unknown_fallback` | never sent by server — internal registry entry the renderer falls back to | n/a |

Keep `card_rail` generic and themed via props rather than making `buy_car_rail`,
`sell_car_rail`, `car_check_rail` as separate types — this is exactly the kind of
reuse-vs-proliferation decision COVERAGE.md should call out as a deliberate choice.

---