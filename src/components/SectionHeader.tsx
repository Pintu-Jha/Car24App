// src/components/SectionHeader.tsx
// Reusable section header: title + optional badge pill.
// Used as props.header on rails/grids, or as a standalone section_header type.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/common/Badge';
import { colors } from '@/theme';

export interface SectionHeaderProps {
  title: string;
  badge?: string;
  // Additional props passed when used as a standalone section_header:
  data?: unknown;
  action?: unknown;
}

export function SectionHeader({ title, badge }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {badge ? <Badge text={badge} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  }
});
