// src/components/CategoryQuicklinks.tsx
// Horizontal scrollable icon+label row. One item is "active" (orange underline).
// Tapping fires the item's action (compound: update_state + navigate) via ActionBus.

import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SDUIAction, SDUIDataItem } from '../schema/types';
import { useActionBus } from '../sdui/ActionBus';

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
                  size={24}
                  color={isActive ? '#282CBA' : '#FFFFFF'}
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
    backgroundColor: '#282CBA',
  },
  list: {
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
  },
  item: {
    alignItems: 'center',
    width: 72,
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconCircleActive: {
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 11,
    color: '#FFFFFF',
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
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
