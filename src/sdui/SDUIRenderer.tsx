// src/sdui/SDUIRenderer.tsx
// Core renderer — maps section.type → registered component.
// RULE: must never crash on an unknown type. Fallback is always UnknownFallback.

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SDUIPage, SDUISection } from '../schema/types';
import { useActionBus } from './ActionBus';
import { componentRegistry } from './registry';
import { UnknownFallback } from './UnknownFallback';

interface Props {
  page: SDUIPage;
}

export function SDUIRenderer({ page }: Props) {
  const { state } = useActionBus();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {page.sections
        .filter(section => isVisible(section, state))
        .map(section => {
          const Component = componentRegistry[section.type];

          if (!Component) {
            return <UnknownFallback key={section.id} section={section} />;
          }

          // Props are spread from section.props; data + action are passed explicitly.
          // Components must NOT read section internals — they only receive what's here.
          return (
            <Component
              key={section.id}
              {...section.props}
              data={section.data}
              action={section.action}
            />
          );
        })}
    </ScrollView>
  );
}

/**
 * Evaluates the optional `visible` condition against ActionBus state.
 * A section with no `visible` field is always shown.
 */
function isVisible(section: SDUISection, state: Record<string, unknown>): boolean {
  if (!section.visible) {
    return true;
  }
  const val = state[section.visible.stateKey];
  if (section.visible.equals !== undefined) {
    return val === section.visible.equals;
  }
  if (section.visible.in !== undefined) {
    return section.visible.in.includes(val);
  }
  return true;
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    paddingBottom: 16,
  },
});
