# Cars24 SDUI Implementation — Enterprise Mobile Architecture

An enterprise-grade Server-Driven UI (SDUI) system built with React Native (CLI) and TypeScript, specifically engineered to eliminate app store release cycles for dynamic layout, content, and interactive design updates on Android and iOS.

---

## 1. Which screen was chosen and why?
I chose to replicate and engineer the **Cars24 Home/Landing Screen**.

**Why the Home Screen?** 
- **Highest Volatility & Business Criticality:** The landing page serves as the mission-critical traffic router for user intent (Buy Used, Sell Car, Get Loans, Car Check Services, Challan/Insurance). Marketing banners, promotions (e.g., "Up to ₹80,000 off"), and service rails change weekly; waiting for Apple/Google app store review cycles directly impacts conversion rates.
- **Structural Complexity:** Unlike simple static detail screens or linear forms, the home page demands a rich assortment of diverse UI layouts: sticky localized headers, interactive rotating search prompts, horizontally scrolling tab chips, themed banner rails, wrapping 2-column grids, and vertical fraud-check lists. 
- **State Mutation & Interaction Testing:** Tapping a category chip dynamically filters and alters the visual page content without triggering full navigation departures. Implementing this completely via JSON actions proves the capability of our global event system.

---

## 2. Architecture Overview & Design Rationale
The architecture adheres to strict separation of concerns, decoupling network schema definitions, business orchestration, and view rendering into specialized layers:

```
┌───────────────┐     JSON      ┌──────────────────┐     Inject     ┌──────────────────┐
│  Server / Mock│ ────────────> │   SDUIRenderer   │ <───────────── │ ComponentRegistry│
│    Payload    │               │  (Pure Engine)   │                │   (Native Views) │
└───────────────┘               └────────┬─────────┘                └──────────────────┘
                                         │
                                         ▼
                                ┌──────────────────┐      Events    ┌──────────────────┐
                                │ Custom UI Nodes  │ ─────────────> │     ActionBus    │
                                │  (Card, Rail...) │                │ (Context / State)│
                                └──────────────────┘                └──────────────────┘
```

1. **Strict TypeScript Schema (`src/schema/types.ts`)**: Defines the exact structural contract (`SDUIPage`, `SDUISection`, `SDUIDataItem`, `SDUIAction`, `SDUICondition`). No UI component receives amorphous raw JSON; everything is verified against typed props and explicit data item models.
2. **Injected Component Registry (`src/sdui/registry.ts`)**: A centralized dictionary mapping string keys (e.g., `card_rail`, `icon_rail`) to React Native native view components. To avoid circular dependency antipatterns and enable seamless mock testing, the registry is **injected via props** into the renderer rather than hardcoded inside it.
3. **Pure Recursive Renderer (`src/sdui/SDUIRenderer.tsx`)**: The orchestrator engine that evaluates conditional visibility rules (`visible: { stateKey, equals }`), reconciles list vs. tab layouts, resolves components from the injected registry, and memoizes individual section rendering via `React.memo` to prevent cascading render trees.
4. **Decentralized Event Machine — ActionBus (`src/sdui/ActionBus.tsx`)**: A Context-based event system that acts as an action dispatcher. Instead of hardcoding `onPress` navigation or state logic inside UI presentation components, elements trigger JSON-defined actions (`navigate`, `update_state`, `open_sheet`, `compound`). The `ActionBus` executes these actions cleanly, keeping visual components 100% reusable and logic-free.
5. **Atomic Design Token Engine (`src/theme.ts`)**: A centralized design token repository exporting standardized semantic `colors`, `spacing` (`xs` through `xxl`), and `radius` metrics. Visual themes (like `dark`, `accent`, and `cream` styles in rails) are expressed as string tokens in JSON and resolved to native styling tokens on the client.
6. **Robust Image & Asset Fallback (`src/components/common/DynamicImage.tsx`)**: All graphic renders utilize remote URLs with graceful local fallback states (`MaterialIcons`), ensuring zero broken layouts if a network image fails or is delayed.

---

## 3. Graceful Fallback & Fault Tolerance (No Crashes Guaranteed)

In server-driven apps, the server will inevitably send payloads featuring new component types (or malformed props) to older client binaries. Our system enforces zero crashes through two distinct defensive barriers:

- **Registry Level — Unknown Component Fallback:** When `SDUIRenderer` encounters an unmapped section type (e.g., `"type": "future_3d_carousel"`), it gracefully routes the data to `UnknownFallback`. By default this renders nothing (`null`) to real users, preserving normal screen operation. The diagnostic card (showing the unrecognized type and its raw props) is shown in `__DEV__` builds, and can also be triggered on-demand in a release build via the app's Developer Mode toggle ("Fallback Demo" mode) — this is what the submission's screen recording uses, so the behavior is visible on camera without weakening the real-user guarantee: a genuine production release, with the toggle untouched, always resolves an unknown type to `null`.
- **Runtime Level — Granular Error Boundaries:** Every section rendered through the registry is wrapped in a dedicated `ErrorBoundary` (`src/components/common/ErrorBoundary.tsx`). If a custom native component throws a runtime exception during rendering or lifecycle evaluation, the boundary traps the failure locally and displays a stylized error placeholder, keeping the surrounding rails and tabs functioning normally.

---

## 4. The Versioning Strategy & Backward Compatibility

To allow legacy mobile builds and modern server engines to coexist without regression, our enterprise versioning architecture is designed around three complementary specification tiers:

1. **Payload Metadata Gatekeeping (`minClientVersion`):** Every SDUI JSON payload specifies a `meta: { schemaVersion, minClientVersion }` object. In a production network integration, the client's HTTP gateway compares `minClientVersion` against the app binary version. If a major server payload update exceeds the client's supported features, the gateway rejects the remote payload, falls back to a safe embedded local bundle, and triggers an "App Update Required" modal.
2. **Additive Schema Evolution:** New fields, actions, or style tokens are specified as *optional* attributes in TypeScript interfaces. If a future v1.1 payload includes a new `"badgeColor": "gold"` property on a v1.0 client build, the component ignores the unrecognized property and safely applies default design tokens.
3. **Server-Side Negotiation via Request Headers:** When requesting SDUI screens (e.g. `/api/v1/sdui/home`), the client passes `X-Client-Version` and `X-Supported-Components` headers. The Backend For Frontend (BFF) engine uses this manifest to down-sample or omit unsupported component nodes prior to payload delivery.

---

## 5. Project Setup & Execution
The project is configured as a standard native React Native project (using React Native CLI with Hermes compiler enabled, no Expo dependence).

### Requirements
- Node.js >= 18.x
- Ruby / Cocoapods (for iOS)
- Android SDK & Android Studio (for Android)

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Install iOS CocoaPods (Mac only)
cd ios && pod install && cd ..

# 3. Start Metro bundler (with reset cache for fresh resolution)
npx react-native start --reset-cache

# 4. Run natively on device/emulator
npm run android
# or
npm run ios
```

---

## 6. Verification & Demo Mode (Developer Toggle)
To demonstrate the system's capabilities, speed, and safety in real-time, the app incorporates a floating **Developer Mode Toggle** at the bottom of the root screen. Tapping it seamlessly switches between three operational modes without restarting the bundler:

1. **SDUI (Normal Mode):** Renders the screen dynamically from `sample-home.json`, showcasing tab switching, action bus routing, theme token resolution, and image background rendering.
2. **Static Twin (Control Mode):** Renders `StaticHomeScreen.tsx` — a 100% hardcoded, traditional React Native implementation with identical visual UI and structure, used as the strict A/B test baseline for our performance benchmarking (`PERF.md`).
3. **Fallback Demo (Safety Mode):** Instantly injects `with-unknown-component.json`, which inserts an unrecognised `"type": "future_3d_carousel"` section right in the middle of the home rails. Demonstrates the visual diagnostic `UnknownFallback` component containing the unrecognized section while all surrounding cards, tabs, and rails remain interactive and fully functional.
