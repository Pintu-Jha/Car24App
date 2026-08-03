# AI Collaboration & Workflow Evidence

This project was built using an intensive, AI-native engineering workflow. Rather than delegating unverified boilerplate creation to an LLM, the AI was leveraged as an interactive pair programmer, architectural sounding board, and systemic refactoring multiplier. 

---

## 1. Tool Stack & Context Engineering
- **Primary AI Agent:** Antigravity (Google DeepMind advanced agentic assistant).
- **Development CLI Environment:** Headless system integrating deep static type verification (`npx tsc --noEmit`), precise file mutation tools (`multi_replace_file_content`, `replace_file_content`), and git orchestration.
- **Context & Rule Injection:** To maintain rigorous adherence to architectural constraints across sessions, we structured custom context files directly within the repository's workspace `.agents/` folder:
  - `build-plan.md`: Codified architectural milestones, performance target guidelines, and testing methodologies.
  - `schema-and-json.md`: Provided strict TypeScript interfaces and reference JSON payload models to prevent hallucinations during typing development.
  - `screen-and-registry.md`: Established clear visual mapping rules and design specifications for component translation.

---

## 2. Three Prompt → Outcome Stories (Real Evidence)

### Story 1: From Simple Rows to Organic State Navigation
- **The Prompt:** *"Refactor the category quick-link chips so that tapping an item dynamically filters and renders targeted content directly below the fold without triggering a distracting full-screen navigation departure. Utilize our SDUI action framework to update local state cleanly."*
- **What AI Produced Initially:** The AI originally built `CategoryQuicklinks` as a passive horizontal row that emitted simple navigation intents, assuming clicking "Buy used car" would redirect to a brand new screen.
- **What Was Rejected & Why:** We rejected simple screen-push navigation because in modern high-converting e-commerce apps, users expect instant category toggling directly on the landing page without friction or loading spinners.
- **The Rewrite:** The AI restructured the architecture to combine `@react-navigation/material-top-tabs` directly with our SDUI JSON payload. By interpreting compound actions (`update_state` + `navigate`) inside our `ActionBus`, clicking a quicklink seamlessly filters visible sections below the fold via state evaluation while retaining deep-linkable URLs.

### Story 2: Establishing Enterprise Design Tokens & Asset Integrity
- **The Prompt:** *"Elevate the entire repository to strict senior-developer enterprise standards. Extract all inline hex color strings and magic numbers into a centralized, modular design token theme file (theme.ts). Additionally, strip out all temporary Unicode emojis across both static and dynamic JSON layers; implement a production-ready asset rendering pipeline utilizing real CDN imagery with error-resilient native vector icon fallbacks."*
- **What AI Produced Initially:** The initial MVP code littered components with inline hardcoded hex strings (`#0F1F33`, `#E8F5E9`) and relied heavily on literal Unicode emojis (`🚙`, `💵`) for quick demo mockups.
- **What Was Rejected & Why:** Emojis render inconsistently across iOS and diverse Android OS builds (looking amateurish), and hardcoded inline styles violate DRY design engineering standards.
- **The Rewrite:** We tasked the AI with an exhaustive codebase refactor. It created a completely independent, atomic design token engine (`src/theme.ts`) exporting structured `colors`, `spacing`, and `radius` metrics. It systematically stripped every emoji out of both the dynamic JSON and hardcoded static twins, replacing them with a custom-built, error-tolerant `DynamicImage` component featuring Unsplash CDN support and elegant Material vector fallback icons.

### Story 3: Redesigning Premium Cards via Visual Criticism
- **The Prompt:** *"Audit the current CardRail presentation against modern automotive e-commerce design benchmarks. The current layout feels flat and basic—redesign the visual hierarchy to achieve a premium, sophisticated feel with enhanced contrast, elevated shadows, and responsive typography that remains legible across varied vehicle photography."*
- **What AI Produced Initially:** A standard boxed layout where a tiny thumbnail rectangle sat uncomfortably beneath plain white text on a flat colored box.
- **What Was Rejected & Why:** It felt like a "minimum viable product" rather than a premium, polished automotive e-commerce experience.
- **The Rewrite:** The AI re-architected the `CardRail` layout from the ground up:
  - **Image as Full Background:** Expanded the car photograph to fill the entire card bounds (`resizeMode="cover"`).
  - **Semi-Transparent Colored Overlay:** Applied a dynamic tinted overlay (`rgba(13,27,42,0.60)`) corresponding to each card's theme (`dark`, `accent`, `cream`). This guarantees crisp text contrast over unpredictable car imagery without needing heavy third-party gradient packages.
  - **Typography & Depth:** Injected elevated shadow properties, border Radii tokens (`radius.lg`), and `textShadow` enhancements to title headings. Finally, synced the identical structural improvements to `StaticHomeScreen` to preserve performance bench parity.

---

## 3. Notable AI Failures & How We Caught Them

### Failure 1: The Ephemeral Navigation State Trap (Lifecycle Blindness)
- **Where AI Led Us Wrong:** While constructing the fallback verification demo, the AI attempted to create a fake navigation interceptor that replaced the root screen with a temporary "EmptyScreen". However, it failed to anticipate standard React lifecycle consequences: unmounting the primary navigator destroyed `RootHomeScreen`'s local memory tree. When the user clicked "Go Back", the component remounted from scratch, resetting the Developer Mode toggle (`'sdui' | 'static' | 'fallback'`) back to its default state and breaking the fallback demonstration flow.
- **How We Caught & Fixed It:** During interactive QA verification, we observed: *"When running in Fallback Demo mode, triggering a card navigation event and subsequently returning via the hardware back button resets the UI view back to normal SDUI mode instead of preserving our diagnostic fallback state. Investigate why our operational mode state is failing to persist across screen transitions."* We analyzed the component lifecycle graph, immediately diagnosed the ephemeral unmount bug, and corrected it by lifting the Developer Toggle configuration out of local UI state and anchoring it securely into our persistent, top-level `ActionBus` context dictionary.

### Failure 2: Hallucinating Deprecated React Native Stylesheet APIs
- **Where AI Led Us Wrong:** During the rapid redesign of the premium image-background cards, the AI generated code utilizing `...StyleSheet.absoluteFillObject` across multiple styling definitions in `CardRail.tsx`.
- **How We Caught & Fixed It:** We enforce a strict automated verification rule where code cannot be committed without compiling against TypeScript (`npx tsc --noEmit`). The compiler instantly rejected the commit with `error TS2551: Property 'absoluteFillObject' does not exist on type 'typeof StyleSheet'. Did you mean 'absoluteFill'?` We immediately intercepted the failure, identified the correct modern RN API property (`StyleSheet.absoluteFill`), applied an automated replacement across the codebase, and verified clean compilation before proceeding.

---

## 4. Verification Strategy for AI-Generated Code

To maintain uncompromising senior-developer code quality, every single line of AI-proposed code was subjected to a rigid 3-tier verification pipeline:

1. **Automated Compiler Guards (Pre-Commit Barrier):**
   - No code change was permitted to merge without running our diagnostic test chain: `npx tsc --noEmit`. Any type mismatches, missing optional chaining operators, or undeclared design tokens instantly aborted the operation for correction.
2. **Visual A/B Twin Control Group Verification:**
   - Building the hardcoded `StaticHomeScreen` served as an essential debugging asset. By rapidly alternating between `SDUI (normal)` and `Static Twin` via our live Developer Toggle, we conducted strict visual regressions. Any layout shifts, font misalignment, or padding discrepancy during switching immediately revealed CSS/styling errors in the dynamic JSON renderer.
3. **Defensive Runtime Sandbox (Fault-Tolerance Injection):**
   - We intentionally stressed the system by injecting intentionally broken or future-version JSON schemas (`with-unknown-component.json`). We manually verified on running Android and iOS simulators that unrecognized types smoothly isolated within our `UnknownFallback` boundaries without crashing the surrounding execution tree or throwing React fatal exceptions.
