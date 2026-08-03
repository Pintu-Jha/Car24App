# Cars24 SDUI Implementation

An enterprise-grade Server-Driven UI (SDUI) architecture built with React Native and TypeScript, solving the problem of deploying layout changes without App Store releases.

## Which screen was chosen and why?
I chose to implement the **Cars24 Home/Landing Screen**.
**Why:** The Home Screen acts as the central router for the user's intent (Buy, Sell, Loans, Services) and possesses the highest structural volatility. It demands diverse UI layouts (sticky headers, horizontal rails, wrapping grids, and vertical lists) and complex interactive states (tab filters that mutate the visible page content dynamically). This makes it the ultimate stress test for an SDUI engine's action bus and component registry.

## Architecture Overview
The system is built on a clean, decoupled architecture:
1. **Schema (`src/schema/types.ts`)**: Deeply typed TypeScript interfaces that dictate the exact contract between the server payload and client renderer.
2. **Registry (`src/sdui/registry.ts`)**: A dictionary mapping string types (e.g. `card_rail`) to physical React Native components.
3. **Renderer (`src/sdui/SDUIRenderer.tsx`)**: The recursive engine that iterates over the JSON payload, checks visibility conditions, resolves components from the registry, and injects data props.
4. **ActionBus (`src/sdui/ActionBus.tsx`)**: A Context-based global event dispatcher. It intercepts server-driven actions (like `navigate` or `update_state`) and executes them natively, removing hardcoded `onPress` business logic from UI components.
5. **Theme (`src/theme.ts`)**: A centralized design token system ensuring SDUI layouts maintain brand consistency dynamically.

## Versioning Story
As the schema evolves, older app versions will inevitably receive JSON payloads containing new component types they do not understand.
- **Graceful Degradation:** The renderer implements an `UnknownFallback` component. If a section type is missing from the local registry, it safely returns `null` in production (or a visible diagnostic boundary in `__DEV__`), ensuring the app **never crashes**.
- **`minClientVersion` flag:** The schema's `meta` object supports a `minClientVersion`. The client checks this before parsing. If the payload is fundamentally incompatible (e.g., Schema V2 vs V1), the client can reject the payload entirely and load a bundled, safe fallback JSON from disk, prompting the user to update the app.

## Project Setup
1. `npm install` or `yarn install`
2. `npx expo start`

## Testing the Capabilities
The app includes a built-in Developer Toggle at the bottom of the screen to swap between three states instantly:
1. **SDUI normal:** Renders the screen purely from `sample-home.json`.
2. **Static:** Renders the identical screen using hardcoded React Native components (for A/B performance profiling).
3. **Fallback demo:** Injects a payload with a purposely unrecognized `"type": "future_3d_carousel"` to demonstrate the engine safely isolating and rendering the `UnknownFallback` boundary without crashing the surrounding content.
