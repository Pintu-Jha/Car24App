// src/components/SectionHeader.tsx
// Reusable section header: title + optional badge pill.
// Used as props.header on rails/grids, or as a standalone section_header type.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
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
    color: '#1A1A2E',
    letterSpacing: -0.3,
  },
  badge: {
    backgroundColor: '#FF4500',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
