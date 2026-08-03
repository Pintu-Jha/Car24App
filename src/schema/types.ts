// src/schema/types.ts
// SDUI schema — the primary deliverable of this assignment.
// Every interactive element's behaviour is expressed as an SDUIAction here;
// no hardcoded onPress logic is permitted in component code.

export interface SDUIPage {
  schemaVersion: string; // e.g. "1.0.0"
  pageId: string; // "home"
  meta: {
    title: string;
    minClientVersion?: string;
  };
  sections: SDUISection[];
}

export interface SDUISection {
  id: string;
  type:
    | 'header_search'
    | 'category_quicklinks'
    | 'card_rail'
    | 'icon_rail'
    | 'card_grid'
    | 'list_rows'
    | 'section_header'
    | string; // allows unknown types — renderer handles via fallback
  visible?: SDUICondition;
  props: Record<string, unknown>; // typed per-component in each component file
  data?: SDUIDataItem[];
  action?: SDUIAction; // section-level tap (rare — most actions are per-item)
}

export interface SDUIDataItem {
  id: string;
  props: Record<string, unknown>;
  action?: SDUIAction;
}

export type SDUIAction =
  | { type: 'navigate'; screen: string; params?: Record<string, unknown> }
  | { type: 'open_sheet'; sheetId: string; payload?: Record<string, unknown> }
  | { type: 'update_state'; stateKey: string; value: unknown }
  | { type: 'api_call'; endpoint: string; method: 'GET' | 'POST' }
  | { type: 'deep_link'; url: string }
  | { type: 'compound'; actions: SDUIAction[] }; // update_state + navigate combined

export interface SDUICondition {
  stateKey: string;
  equals?: unknown;
  in?: unknown[];
}
