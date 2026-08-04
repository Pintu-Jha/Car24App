// src/components/IconRail.tsx
// Horizontal icon-style rail — circular image on top, label below, no card background.
// Used for the "Get loans" section.

import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SDUIAction, SDUIDataItem } from '@/schema/types';
import { useActionBus } from '@/sdui/ActionBus';
import { SectionHeader } from '@/components/SectionHeader';
import { colors } from '@/theme';

interface Header {
  title: string;
  badge?: string;
}

interface IconItemProps {
  label: string;
  image: string;
}

interface Props {
  header?: Header;
  data?: SDUIDataItem[];
  action?: SDUIAction;
}

const IMAGE_EMOJI: Record<string, string> = {
  car_loan: '🏦',
  car2: '🚗',
  cash2: '💳',
  credit: '📊',
};

const CIRCLE_COLORS = ['#E3F2FD', '#FFF3E0', '#E8F5E9', '#F3E5F5'];

export function IconRail({ header, data }: Props) {
  const { dispatch } = useActionBus();

  return (
    <View style={styles.section}>
      {header && <SectionHeader title={header.title} badge={header.badge} />}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const props = item.props as unknown as IconItemProps;
          const circleBg = CIRCLE_COLORS[index % CIRCLE_COLORS.length];

          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => item.action && dispatch(item.action)}
              activeOpacity={0.7}>
              <View style={[styles.circle, { backgroundColor: circleBg }]}>
                <Text style={styles.emoji}>
                  {IMAGE_EMOJI[props.image] ?? '💼'}
                </Text>
              </View>
              <Text style={styles.label} numberOfLines={2}>
                {props.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.background.card,
    marginBottom: 8,
    paddingBottom: 16,
  },
  list: {
    paddingHorizontal: 16,
    gap: 16,
  },
  item: {
    alignItems: 'center',
    width: 80,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
});
