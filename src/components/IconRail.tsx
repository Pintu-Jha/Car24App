// src/components/IconRail.tsx
// Horizontal icon-style rail — rectangular image card on top, label below.
// Used for the "Get loans" section. Matches Cars24 screenshot layout.

import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SDUIAction, SDUIDataItem } from '@/schema/types';
import { useActionBus } from '@/sdui/ActionBus';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, spacing, radius } from '@/theme';

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

// Icon fallback for non-URL images
const ICON_FALLBACK: Record<string, string> = {
  car_loan: 'account-balance',
  car2: 'directions-car',
  cash2: 'attach-money',
  credit: 'trending-up',
};

const ICON_BG_COLORS = ['#E8F4FD', '#FFF5E6', '#E8F5E9', '#F3E5F5'];

function ItemImage({ uri, index }: { uri: string; index: number }) {
  const isUrl = uri.startsWith('http');
  const [error, setError] = React.useState(false);
  const bg = ICON_BG_COLORS[index % ICON_BG_COLORS.length];

  if (isUrl && !error) {
    return (
      <View style={[styles.imageContainer, { backgroundColor: bg }]}>
        <Image
          source={{ uri }}
          style={styles.itemImage}
          resizeMode="cover"
          onError={() => setError(true)}
        />
      </View>
    );
  }

  // Fallback: MaterialIcon in colored circle
  const iconName = ICON_FALLBACK[uri] ?? 'image';
  return (
    <View style={[styles.imageContainer, { backgroundColor: bg }]}>
      <MaterialIcons name={iconName} size={28} color="#666" />
    </View>
  );
}

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

          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => item.action && dispatch(item.action)}
              activeOpacity={0.7}>
              <ItemImage uri={props.image} index={index} />
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
    marginBottom: spacing.sm,
    paddingBottom: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  item: {
    alignItems: 'center',
    width: 80,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
});
