// src/components/ListRows.tsx
// Vertical list: image/icon + title + subtitle + chevron — for "Uncover frauds" section.
// Uses DynamicImage for real images with icon fallback.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SDUIAction, SDUIDataItem } from '@/schema/types';
import { useActionBus } from '@/sdui/ActionBus';
import { SectionHeader } from '@/components/SectionHeader';
import { DynamicImage } from '@/components/common/DynamicImage';
import { colors, spacing, radius } from '@/theme';

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

const ICON_BG = ['#FFF3E0', '#E8F5E9', '#E3F2FD'];

export function ListRows({ header, data }: Props) {
  const { dispatch } = useActionBus();

  return (
    <View style={styles.section}>
      {header && <SectionHeader title={header.title} badge={header.badge} />}
      <View style={styles.container}>
        {data?.map((item, index) => {
          const props = item.props as unknown as ListRowProps;
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
              {/* Icon / Image */}
              <DynamicImage
                name={props.icon}
                backgroundColor={iconBg}
                width={48}
                height={48}
                borderRadius={radius.sm}
                size={22}
              />

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
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
  },
  container: {
    paddingHorizontal: spacing.lg,
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
    color: colors.text.secondary,
    lineHeight: 17,
  },
});
