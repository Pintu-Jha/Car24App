// src/sdui/ActionBus.tsx
// Central action dispatcher for all SDUI interactive elements.
// Components MUST dispatch actions through here — no hardcoded onPress logic.

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import { SDUIAction } from '@/schema/types';

// ── State ────────────────────────────────────────────────────────────────────

type SDUIState = Record<string, unknown>;

type InternalAction =
  | { type: 'UPDATE_STATE'; key: string; value: unknown }
  | { type: 'RESET' };

function reducer(state: SDUIState, action: InternalAction): SDUIState {
  switch (action.type) {
    case 'UPDATE_STATE':
      return { ...state, [action.key]: action.value };
    case 'RESET':
      return {};
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface ActionBusContextValue {
  state: SDUIState;
  dispatch: (action: SDUIAction) => void;
  getState: (key: string) => unknown;
}

const ActionBusContext = createContext<ActionBusContextValue>({
  state: {},
  dispatch: () => { },
  getState: () => undefined,
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function ActionBusProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatchInternal] = useReducer(reducer, {});

  const dispatch = useCallback((action: SDUIAction) => {
    switch (action.type) {
      case 'update_state':
        dispatchInternal({ type: 'UPDATE_STATE', key: action.stateKey, value: action.value });
        break;

      case 'navigate':
        console.log('[SDUI] navigate →', action.screen, action.params ?? '');
        dispatchInternal({ type: 'UPDATE_STATE', key: 'currentRoute', value: action.screen });
        break;

      case 'compound':
        // Execute each sub-action sequentially
        action.actions.forEach(a => dispatch(a));
        break;

      case 'open_sheet':
        console.log('[SDUI] open_sheet →', action.sheetId, action.payload ?? '');
        break;

      case 'api_call':
        console.log('[SDUI] api_call →', action.method, action.endpoint);
        break;

      case 'deep_link':
        console.log('[SDUI] deep_link →', action.url);
        break;

      default:
        console.warn('[SDUI] Unknown action type:', (action as { type: string }).type);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getState = useCallback((key: string) => state[key], [state]);

  return (
    <ActionBusContext.Provider value={{ state, dispatch, getState }}>
      {children}
    </ActionBusContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useActionBus(): ActionBusContextValue {
  return useContext(ActionBusContext);
}
