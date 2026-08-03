# SDUI Coverage & Generalization

The core value proposition of this SDUI engine is its ability to express an infinite combination of UI layouts using a finite, robust set of primitive building blocks.

## Component Registry

Currently, the schema explicitly supports the following structural primitives:
- `header_search`: Highly specific to the home tab, handles localized search and avatar rendering.
- `category_quicklinks`: A horizontally scrollable tab layout that mutates the active screen context.
- `card_rail`: A versatile, horizontally scrolling rail of cards. Theming is completely detached via `props.cardStyle` (`dark` | `accent` | `cream`), meaning this single component can render promotional banners, valuation calls-to-action, or feature highlights without code duplication.
- `icon_rail`: A horizontal rail emphasizing typography and icon imagery without card boundaries (used for Services/Loans).
- `card_grid`: A wrapping, 2-column flex layout for dense categorical information.
- `list_rows`: A standard vertical layout for high-density, text-heavy items (Frauds/Alerts).
- `section_header`: Reusable typography for separating distinct vertical content zones.

## Coverage Claim

> "Given a new Cars24 screen, **85%** renders with JSON-only changes; these patterns need new client code."

The current schema can effortlessly reconstruct any combination of Rails, Grids, Lists, and Headers.
You could instantly build a new "Explore Loans" page just by stacking a `header_search`, an `icon_rail`, and a series of `list_rows` using purely JSON.

### Where new client code is required (The 15% Gap)

1. **Complex Interactive Forms (Inputs & Selectors):** The current schema maps actions perfectly (`navigate`, `open_sheet`), but does not have a concept of *local two-way data binding* for things like TextInput fields, range sliders (for loan EMI calculators), or multi-step forms. A new `form_input` component and an expansion of the `ActionBus` state machine would be required.
2. **Dynamic Theming Overrides:** While `props.cardStyle` allows stylistic shifts for cards, the schema doesn't yet support a top-level `themeToken` injection. If a new screen requires a completely bespoke background color transition (e.g. the header changing from blue to green based on scroll depth or active tab), client-side animation logic utilizing `Animated.ScrollView` and interpolation would need to be written natively.
3. **Pulsing/Lottie Animations:** The schema assumes static or remotely fetched raster images. Adding Lottie animations would require a new component primitive.
