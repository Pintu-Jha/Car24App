// src/components/CardGrid.tsx
// 2-column wrapping grid — used for "Buy smarter with our checks" section.
// Not a FlatList (data is small and static) — uses View wrapping for a true grid.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SDUIAction, SDUIDataItem } from '../schema/types';
import { useActionBus } from '../sdui/ActionBus';
import { SectionHeader } from './SectionHeader';

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

const IMAGE_EMOJI: Record<string, string> = {
  pdi2: '🔍',
  check2: '✅',
};

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
              const props = item.props as GridCardProps;
              const bg = CARD_COLORS[colIdx % CARD_COLORS.length];
              const accent = ACCENT_COLORS[colIdx % ACCENT_COLORS.length];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.card, { backgroundColor: bg }]}
                  onPress={() => item.action && dispatch(item.action)}
                  activeOpacity={0.8}>
                  <View style={[styles.imageBox, { borderColor: accent + '40' }]}>
                    <Text style={styles.emoji}>
                      {IMAGE_EMOJI[props.image] ?? '🚗'}
                    </Text>
                  </View>
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
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingBottom: 16,
  },
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardEmpty: {
    flex: 1,
  },
  imageBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
  },
  emoji: {
    fontSize: 26,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
  },
});
