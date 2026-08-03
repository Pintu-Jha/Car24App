// src/components/ListRows.tsx
// Vertical list: icon + title + subtitle + chevron — for "Uncover frauds" section.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SDUIAction, SDUIDataItem } from '../schema/types';
import { useActionBus } from '../sdui/ActionBus';
import { SectionHeader } from './SectionHeader';

interface Header {
  title: string;
  badge?: string;
}

interface ListRowProps {
  title: string;
  subtitle: string;
  icon: string;
}

interface Props {
  header?: Header;
  data?: SDUIDataItem[];
  action?: SDUIAction;
}

const ICON_EMOJI: Record<string, string> = {
  report: '📃',
  odometer: '🔢',
  rto: '🏛',
};

const ICON_COLORS = ['#FFF3E0', '#E8F5E9', '#E3F2FD'];

export function ListRows({ header, data }: Props) {
  const { dispatch } = useActionBus();

  return (
    <View style={styles.section}>
      {header && <SectionHeader title={header.title} badge={header.badge} />}
      <View style={styles.container}>
        {data?.map((item, index) => {
          const props = item.props as ListRowProps;
          const iconBg = ICON_COLORS[index % ICON_COLORS.length];

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.row,
                index < (data.length - 1) && styles.rowBorder,
              ]}
              onPress={() => item.action && dispatch(item.action)}
              activeOpacity={0.7}>
              {/* Icon */}
              <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                <Text style={styles.iconEmoji}>
                  {ICON_EMOJI[props.icon] ?? '📄'}
                </Text>
              </View>

              {/* Text */}
              <View style={styles.textBlock}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                  {props.subtitle}
                </Text>
              </View>

              {/* Chevron */}
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingBottom: 8,
  },
  container: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: {
    fontSize: 22,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    lineHeight: 17,
  },
  chevron: {
    fontSize: 22,
    color: '#BDBDBD',
    fontWeight: '300',
    marginLeft: 4,
  },
});
