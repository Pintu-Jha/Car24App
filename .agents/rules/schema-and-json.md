---
trigger: always_on
---

# Cars24 SDUI — TypeScript Schema & Sample JSON

Part 2 of 3. See `screen-and-registry.md` (part 1: screen spec + component registry) and
`build-plan.md` (part 3: actions/fallback/perf/build-order). This file: the full schema
types and a ready-to-use sample JSON payload with real Cars24 data.

## 3. Full TypeScript schema

```typescript
// src/schema/types.ts

export interface SDUIPage {
  schemaVersion: string;          // e.g. "1.0.0"
  pageId: string;                 // "home"
  meta: {
    title: string;
    minClientVersion?: string;
  };
  sections: SDUISection[];
}

export interface SDUISection {
  id: string;
  type:
    | "header_search"
    | "category_quicklinks"
    | "card_rail"
    | "icon_rail"
    | "card_grid"
    | "list_rows"
    | "section_header";
  visible?: SDUICondition;
  props: Record<string, unknown>;   // typed per-component in each component file
  data?: SDUIDataItem[];
  action?: SDUIAction;              // section-level tap (rare — most actions are per-item)
}

export interface SDUIDataItem {
  id: string;
  props: Record<string, unknown>;
  action?: SDUIAction;
}

export type SDUIAction =
  | { type: "navigate"; screen: string; params?: Record<string, unknown> }
  | { type: "open_sheet"; sheetId: string; payload?: Record<string, unknown> }
  | { type: "update_state"; stateKey: string; value: unknown }
  | { type: "api_call"; endpoint: string; method: "GET" | "POST" }
  | { type: "deep_link"; url: string }
  | { type: "compound"; actions: SDUIAction[] };  // for quicklink tap = update_state + navigate

export interface SDUICondition {
  stateKey: string;
  equals: unknown;
}
```

---

## 4. Sample JSON payload (real data, ready to use as `sample-home.json`)

```json
{
  "schemaVersion": "1.0.0",
  "pageId": "home",
  "meta": { "title": "Cars24 Home", "minClientVersion": "1.0.0" },
  "sections": [
    {
      "id": "header",
      "type": "header_search",
      "props": {
        "city": "Bangalore",
        "avatarInitials": "PJ",
        "searchPlaceholders": ["Search Swift", "Search Alto", "Search Baleno"]
      }
    },
    {
      "id": "quicklinks",
      "type": "category_quicklinks",
      "props": { "activeId": "all" },
      "data": [
        { "id": "all", "props": { "label": "All", "icon": "grid" } },
        { "id": "buy", "props": { "label": "Buy used car", "icon": "car" },
          "action": { "type": "compound", "actions": [
            { "type": "update_state", "stateKey": "activeTab", "value": "buy" },
            { "type": "navigate", "screen": "BuyUsedCar" }
          ]}},
        { "id": "sell", "props": { "label": "Sell car", "icon": "key" },
          "action": { "type": "compound", "actions": [
            { "type": "update_state", "stateKey": "activeTab", "value": "sell" },
            { "type": "navigate", "screen": "SellCar" }
          ]}},
        { "id": "loans", "props": { "label": "Loans", "icon": "money-bag" },
          "action": { "type": "update_state", "stateKey": "activeTab", "value": "loans" }},
        { "id": "challan", "props": { "label": "Challan", "icon": "document" },
          "action": { "type": "update_state", "stateKey": "activeTab", "value": "challan" }},
        { "id": "car_check", "props": { "label": "Car check", "icon": "wrench" },
          "action": { "type": "update_state", "stateKey": "activeTab", "value": "car_check" }},
        { "id": "insurance", "props": { "label": "Insurance", "icon": "shield" },
          "action": { "type": "update_state", "stateKey": "activeTab", "value": "insurance" }}
      ]
    },
    {
      "id": "buy_car_rail",
      "type": "card_rail",
      "props": {
        "header": { "title": "Buy car", "badge": "Up to ₹80,000 off" },
        "cardStyle": "dark"
      },
      "data": [
        { "id": "all_used", "props": { "title": "All used cars", "image": "car_suv.png" },
          "action": { "type": "navigate", "screen": "Listing", "params": { "filter": "all" } }},
        { "id": "budget", "props": { "title": "Budget used cars", "image": "car_hatch.png" },
          "action": { "type": "navigate", "screen": "Listing", "params": { "filter": "budget" } }},
        { "id": "premium", "props": { "title": "Premium used cars", "image": "car_sports.png" },
          "action": { "type": "navigate", "screen": "Listing", "params": { "filter": "premium" } }},
        { "id": "new_cars", "props": { "title": "New cars", "image": "car_new.png" },
          "action": { "type": "navigate", "screen": "Listing", "params": { "filter": "new" } }}
      ]
    },
    {
      "id": "sell_car_rail",
      "type": "card_rail",
      "props": { "header": { "title": "Sell your car" }, "cardStyle": "accent" },
      "data": [
        { "id": "sell", "props": { "title": "Sell your car", "image": "hand_key.png" },
          "action": { "type": "navigate", "screen": "SellCar" }},
        { "id": "valuation", "props": { "title": "Check car valuation", "image": "cash.png" },
          "action": { "type": "navigate", "screen": "Valuation" }},
        { "id": "scrap", "props": { "title": "Scrap your car", "image": "damaged_car.png" },
          "action": { "type": "navigate", "screen": "Scrap" }}
      ]
    },
    {
      "id": "loans_rail",
      "type": "icon_rail",
      "props": { "header": { "title": "Get loans" } },
      "data": [
        { "id": "used_car_loan", "props": { "label": "Used car loan", "image": "car_loan.png" },
          "action": { "type": "navigate", "screen": "Loans", "params": { "type": "used_car" } }},
        { "id": "loan_against_car", "props": { "label": "Loan against car", "image": "car2.png" },
          "action": { "type": "navigate", "screen": "Loans", "params": { "type": "against_car" } }},
        { "id": "personal_loan", "props": { "label": "Personal loan", "image": "cash2.png" },
          "action": { "type": "navigate", "screen": "Loans", "params": { "type": "personal" } }},
        { "id": "credit_score", "props": { "label": "Credit score", "image": "credit.png" },
          "action": { "type": "navigate", "screen": "CreditScore" }}
      ]
    },
    {
      "id": "car_check_rail",
      "type": "card_rail",
      "props": { "header": { "title": "Car check services" }, "cardStyle": "cream" },
      "data": [
        { "id": "new_pdi", "props": { "title": "New car PDI", "image": "pdi.png" },
          "action": { "type": "navigate", "screen": "PDI" }},
        { "id": "used_check", "props": { "title": "Used car check", "image": "check.png" },
          "action": { "type": "navigate", "screen": "UsedCarCheck" }},
        { "id": "vehicle_history", "props": { "title": "Vehicle history", "image": "history.png" },
          "action": { "type": "navigate", "screen": "VehicleHistory" }}
      ]
    },
    {
      "id": "smart_checks_grid",
      "type": "card_grid",
      "props": { "header": { "title": "Buy smarter with our checks" }, "columns": 2 },
      "data": [
        { "id": "pdi_grid", "props": {
            "title": "New car PDI", "subtitle": "Pre delivery inspection", "image": "pdi2.png" },
          "action": { "type": "navigate", "screen": "PDI" }},
        { "id": "used_check_grid", "props": {
            "title": "Used car check", "subtitle": "300+ point evaluation", "image": "check2.png" },
          "action": { "type": "navigate", "screen": "UsedCarCheck" }}
      ]
    },
    {
      "id": "fraud_list",
      "type": "list_rows",
      "props": { "header": { "title": "Uncover frauds before you buy" } },
      "data": [
        { "id": "vhr", "props": {
            "title": "Vehicle history report",
            "subtitle": "Service records and Accidental check", "icon": "report.png" },
          "action": { "type": "navigate", "screen": "VehicleHistoryReport" }},
        { "id": "odometer", "props": {
            "title": "Odometer fraud check",
            "subtitle": "20% cars show odometer fraud", "icon": "odometer.png" },
          "action": { "type": "navigate", "screen": "OdometerCheck" }},
        { "id": "rto", "props": {
            "title": "RTO check",
            "subtitle": "15% cars have RC mismatches", "icon": "rto.png" },
          "action": { "type": "navigate", "screen": "RTOCheck" }}
      ]
    }
  ]
}
```

Use local placeholder images (any car stock photos) — the brief says nobody expects live
data, just "real-feeling."