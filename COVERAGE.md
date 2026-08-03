# COVERAGE.md — Cars24 SDUI Generalization Analysis

## Component Registry

| Type | Renders | Key props | Data shape |
|---|---|---|---|
| `header_search` | Location pin + city, rotating search bar, avatar | `city`, `avatarInitials`, `searchPlaceholders[]` | No data array |
| `category_quicklinks` | Horizontal scrollable icon+label row, one active | `activeId` | `{label, icon}[]` |
| `card_rail` | Generic horizontal card rail, 3 themes | `header`, `cardStyle` | `{title, image}[]` |
| `icon_rail` | Horizontal icon-style items, no card bg | `header` | `{label, image}[]` |
| `card_grid` | 2-column wrapping grid | `header`, `columns` | `{title, subtitle, image}[]` |
| `list_rows` | Vertical list: icon + title + subtitle + chevron | `header` | `{title, subtitle, icon}[]` |
| `section_header` | Title + optional badge pill (standalone) | `title`, `badge?` | No data array |
| `unknown_fallback` | Dev: dashed card. Production: `null` | — | — |

---

## Expressiveness Matrix

| Feature | Supported | Notes |
|---|---|---|
| Horizontal lists / rails | ✅ | `card_rail`, `icon_rail` |
| Vertical lists | ✅ | `list_rows` |
| 2-column grids | ✅ | `card_grid` |
| Conditional visibility | ✅ | `visible: {stateKey, equals}` on any section |
| Tap actions | ✅ | `navigate`, `update_state`, `compound`, `open_sheet`, `api_call`, `deep_link` |
| Compound actions | ✅ | `update_state + navigate` in single tap |
| Card theming | ✅ | Semantic token (`cardStyle`) — no raw style values in JSON |
| Section badges | ✅ | `header.badge` on any rail/grid |
| Style overrides | ❌ | Intentional: JSON sends semantic tokens only, not raw style values |
| Tab theming (header recolour per active tab) | ❌ | Would need a `theme` token concept at the page level |
| Carousels / auto-scroll banners | ❌ | Not in this screen — would need `banner_carousel` type |
| Nested components | ❌ | Schema is intentionally flat — nesting adds complexity with little benefit for this use case |
| Pagination / infinite scroll | ❌ | Would need `load_more` action type + cursor in section props |

---

## Deliberate Design Decisions

### `card_rail` handles 3 sections (not 3 types)
`buy_car_rail`, `sell_car_rail`, and `car_check_rail` all use the single `card_rail` type, themed by `cardStyle: "dark" | "accent" | "cream"`. This is reuse over proliferation. The trade-off: adding a section that needs very different card structure (e.g. price + EMI + badge) would require either a new type or extending `card_rail` props significantly — that's the honest boundary of a token system.

### Bottom tab bar is not SDUI-driven
The tab bar is static native code. Making it SDUI-driven would require a `tab_bar` section type with `data` items and navigation actions. This is a straightforward extension but not worth building for a demo with a single screen. Noted here rather than hidden.

---

## Honest Coverage Claim

**Given a new Cars24 screen (Listing Page / Car Detail Page), an estimated 70-75% renders JSON-only using existing component types.**

Breakdown:
- ✅ Header: `header_search` — maps directly
- ✅ Filter chips row: could reuse `category_quicklinks` (icon+label, one active, fires `update_state`)
- ✅ Car card grid: `card_grid` with additional props (`price`, `emi`, `badge`) — needs prop extension, not new type
- ✅ Value prop strip: `list_rows` without chevrons — manageable
- ❌ EMI calculator widget: interactive stateful — needs new `calculator_widget` type (~2h to build given registry pattern)
- ❌ Image carousel / gallery: needs `banner_carousel` type (~1.5h)
- ❌ Specification comparison table: needs `spec_table` type (~1h)

**Estimated cost to reach 95% coverage of Listing Page: 3 new component types, ~4-5h total.**

---

## Self-Test: Listing Page Walk-Through

I mentally walked the Cars24 Listing Page (seen from usage) against the schema:

| Section | Maps to | Notes |
|---|---|---|
| Search header | `header_search` | ✅ direct |
| Body type filter chips | `category_quicklinks` | ✅ update_state → filter |
| "Sort / Filter" bar | New: `action_bar` type | ❌ needs new type |
| Car listing cards (2-col) | `card_grid` + new props | Needs `price`, `emi`, `badge` props |
| "Cars24 certified" badge row | `list_rows` | ✅ close enough |
| Load more button | New: `load_more` action | ❌ not in schema |

**Verdict**: 3 new types needed. The registry makes each one a ~1h add. The schema's extensibility holds up under this test.
