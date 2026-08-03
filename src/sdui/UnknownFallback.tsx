// src/sdui/UnknownFallback.tsx
// Renderer falls back here for any unrecognised section type.
// Rule: the app MUST NEVER crash on an unknown component type.
// Dev: show a dashed-border diagnostic card (great for screen-recording the fallback demo).
// Production: return null — silent, invisible, no crash.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SDUISection } from '../schema/types';

interface Props {
  section: SDUISection;
}

export function UnknownFallback({ section }: Props) {
  if (__DEV__) {
    return (
      <View style={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>UNKNOWN COMPONENT</Text>
        </View>
        <Text style={styles.typeLabel}>
          type: <Text style={styles.typeValue}>"{section.type}"</Text>
        </Text>
        <Text style={styles.propsLabel}>props:</Text>
        <Text style={styles.propsValue}>
          {JSON.stringify(section.props, null, 2)}
        </Text>
        <Text style={styles.hint}>
          Register this type in registry.ts to render it.
        </Text>
      </View>
    );
  }
  // Production: fail silently — page keeps rendering, no crash, no visible garbage.
  return null;
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#FF8F00',
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: '#FFF8E1',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF8F00',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  typeLabel: {
    fontSize: 13,
    color: '#5D4037',
    marginBottom: 6,
  },
  typeValue: {
    fontWeight: '700',
    color: '#E65100',
  },
  propsLabel: {
    fontSize: 12,
    color: '#5D4037',
    fontWeight: '600',
    marginBottom: 4,
  },
  propsValue: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#4E342E',
    backgroundColor: '#FFECB3',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  hint: {
    fontSize: 11,
    color: '#8D6E63',
    fontStyle: 'italic',
  },
});
