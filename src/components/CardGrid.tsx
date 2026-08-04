// src/components/CardGrid.tsx
// 2-column wrapping grid — used for "Buy smarter with our checks" section.
// Uses DynamicImage for real images with icon fallback.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SDUIAction, SDUIDataItem } from '@/schema/types';
import { useActionBus } from '@/sdui/ActionBus';
import { SectionHeader } from '@/components/SectionHeader';
import { DynamicImage } from '@/components/common/DynamicImage';
import { colors, spacing, radius } from '@/theme';

interface Header {
  title: string;
  badge?: string;
}

interface GridCardProps {
  title: string;
  subtitle: string;
  image: string;
}

interface Props {
  header?: Header;
  columns?: number;
  data?: SDUIDataItem[];
  action?: SDUIAction;
}

const CARD_COLORS = ['#E3F2FD', '#E8F5E9'];
const ACCENT_COLORS = ['#1565C0', '#1B5E20'];

export function CardGrid({ header, data }: Props) {
  const { dispatch } = useActionBus();

  // Pair up items for 2-column rows
  const rows: SDUIDataItem[][] = [];
  if (data) {
    for (let i = 0; i < data.length; i += 2) {
      rows.push(data.slice(i, i + 2));
    }
  }

  return (
    <View style={styles.section}>
      {header && <SectionHeader title={header.title} badge={header.badge} />}
      <View style={styles.container}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((item, colIdx) => {
              const props = item.props as unknown as GridCardProps;
              const bg = CARD_COLORS[colIdx % CARD_COLORS.length];
              const accent = ACCENT_COLORS[colIdx % ACCENT_COLORS.length];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.card, { backgroundColor: bg }]}
                  onPress={() => item.action && dispatch(item.action)}
                  activeOpacity={0.8}>
                  <DynamicImage
                    name={props.image}
                    backgroundColor="transparent"
                    width={52}
                    height={52}
                    borderRadius={26}
                    size={28}
                  />
                  <Text style={[styles.cardTitle, { color: accent }]}>{props.title}</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={2}>{props.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
            {/* Fill empty cell in odd-length data */}
            {row.length < 2 && <View style={styles.cardEmpty} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.background.card,
    marginBottom: spacing.sm,
    paddingBottom: spacing.lg,
  },
  container: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardEmpty: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 17,
  },
});
