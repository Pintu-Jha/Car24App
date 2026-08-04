// src/components/CategoryQuicklinks.tsx
// Horizontal scrollable icon+label row. One item is "active" (white bg + bold label).
// Tapping fires the item's action via ActionBus.

import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SDUIAction, SDUIDataItem } from '@/schema/types';
import { useActionBus } from '@/sdui/ActionBus';
import { colors, spacing } from '@/theme';

// Map icon name from JSON → MaterialIcons glyph name
const ICON_MAP: Record<string, string> = {
  grid: 'apps',
  car: 'directions-car',
  key: 'vpn-key',
  'money-bag': 'account-balance-wallet',
  document: 'description',
  wrench: 'build',
  shield: 'security',
};

interface QuickLinkItemProps {
  label: string;
  icon: string;
}

interface Props {
  activeId?: string;
  data?: SDUIDataItem[];
  action?: SDUIAction;
}

export function CategoryQuicklinks({ data }: Props) {
  const { state, dispatch } = useActionBus();

  const activeId = (state['activeTab'] as string | undefined) ?? 'all';

  const handlePress = (item: SDUIDataItem) => {
    if (item.action) {
      dispatch(item.action);
    } else {
      dispatch({ type: 'update_state', stateKey: 'activeTab', value: item.id });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const itemProps = item.props as unknown as QuickLinkItemProps;
          const isActive = item.id === activeId;
          const iconName = ICON_MAP[itemProps.icon] ?? 'help-outline';

          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}>
              <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
                <MaterialIcons
                  name={iconName}
                  size={26}
                  color={isActive ? colors.brand.primary : colors.text.white}
                />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {itemProps.label}
              </Text>
              {isActive && <View style={styles.activeLine} />}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand.primary,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  item: {
    alignItems: 'center',
    width: 76,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.lg,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.background.glass,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconCircleActive: {
    backgroundColor: colors.text.white,
  },
  label: {
    fontSize: 11,
    color: colors.text.white,
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
  activeLine: {
    position: 'absolute',
    bottom: 0,
    left: spacing.sm,
    right: spacing.sm,
    height: 3,
    backgroundColor: colors.text.white,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
