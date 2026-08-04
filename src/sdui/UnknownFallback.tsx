// src/sdui/UnknownFallback.tsx
// Renderer falls back here for any unrecognised section type.
// Rule: the app MUST NEVER crash on an unknown component type.
// Dev: show a dashed-border diagnostic card (great for screen-recording the fallback demo).
// Production: return null — silent, invisible, no crash.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SDUISection } from '@/schema/types';
import { colors } from '@/theme';

import { useActionBus } from '@/sdui/ActionBus';

interface Props {
  section: SDUISection;
}

export function UnknownFallback({ section }: Props) {
  const { state } = useActionBus();
  const mode = state['homeScreenMode'] as string | undefined;
  const showDiagnostic = __DEV__ || mode === 'sdui_unknown';

  if (showDiagnostic) {
    return (
      <View style={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>UNKNOWN COMPONENT FALLBACK</Text>
        </View>
        <Text style={styles.typeLabel}>
          Type: <Text style={styles.typeValue}>{section?.type || 'unknown'}</Text>
        </Text>
        <Text style={styles.hint}>
          The renderer encountered a component type it doesn't recognize. Instead of crashing, it safely rendered this fallback block.
        </Text>
        <View style={styles.iconBox}>
          <MaterialIcons name="bug-report" size={24} color={colors.status.error} />
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.status.warning,
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: colors.background.unknown,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.status.warning,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  badgeText: {
    color: colors.text.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  typeLabel: {
    fontSize: 13,
    color: colors.text.unknownPrimary,
    marginBottom: 6,
  },
  typeValue: {
    fontWeight: '700',
    color: colors.text.unknownSecondary,
  },
  hint: {
    fontSize: 11,
    color: '#8D6E63',
    fontStyle: 'italic',
  },
  iconBox: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.2,
  },
});
