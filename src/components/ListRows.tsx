// src/components/ListRows.tsx
// Vertical list: icon + title + subtitle + chevron — for "Uncover frauds" section.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SDUIAction, SDUIDataItem } from '@/schema/types';
import { useActionBus } from '@/sdui/ActionBus';
import { SectionHeader } from '@/components/SectionHeader';
import { colors } from '@/theme';

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

// Map icon name from JSON → MaterialIcons glyph
const ICON_MAP: Record<string, string> = {
  report: 'description',
  odometer: 'speed',
  rto: 'account-balance',
};

const ICON_COLORS = ['#FF8F00', '#2E7D32', '#1565C0'];
const ICON_BG = ['#FFF3E0', '#E8F5E9', '#E3F2FD'];

export function ListRows({ header, data }: Props) {
  const { dispatch } = useActionBus();

  return (
    <View style={styles.section}>
      {header && <SectionHeader title={header.title} badge={header.badge} />}
      <View style={styles.container}>
        {data?.map((item, index) => {
          const props = item.props as unknown as ListRowProps;
          const iconName = ICON_MAP[props.icon] ?? 'article';
          const iconColor = ICON_COLORS[index % ICON_COLORS.length];
          const iconBg = ICON_BG[index % ICON_BG.length];

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
                <MaterialIcons name={iconName} size={22} color={iconColor} />
              </View>

              {/* Text */}
              <View style={styles.textBlock}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                  {props.subtitle}
                </Text>
              </View>

              {/* Chevron */}
              <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.background.card,
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
    borderBottomColor: colors.border.light,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    lineHeight: 17,
  },
});
