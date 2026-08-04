import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, radius } from '@/theme';

interface Props {
  text: string;
}

export function Badge({ text }: Props) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.brand.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.text.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
