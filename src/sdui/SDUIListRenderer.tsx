import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SDUISection } from '@/schema/types';
import { colors } from '@/theme';

interface Props {
  sections: SDUISection[];
  registry: Record<string, React.ComponentType<any>>;
  mockState?: Record<string, unknown>;
  renderSection: (section: SDUISection, registry: Record<string, React.ComponentType<any>>) => React.ReactNode;
}

export function SDUIListRenderer({ sections, registry, mockState, renderSection }: Props) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {sections.map(section => {
        // If mockState is passed, this list is inside a Tab and we filter based on that state
        // In reality, isVisible checks should ideally be lifted up, but we keep it close for simplicity
        if (mockState) {
          if (!isVisible(section, mockState)) return null;
        }
        return renderSection(section, registry);
      })}
    </ScrollView>
  );
}

// Reused visibility checker
function isVisible(section: SDUISection, state: Record<string, unknown>): boolean {
  if (!section.visible) return true;

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
    backgroundColor: colors.background.main,
  },
  content: {
    paddingBottom: 16,
  },
});
