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
                  color={isActive ? '#FF4500' : '#555'}
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
    backgroundColor: '#FFFFFF',
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  list: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  item: {
    alignItems: 'center',
    width: 72,
    paddingHorizontal: 4,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconCircleActive: {
    backgroundColor: '#FFF0EB',
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  label: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  labelActive: {
    color: '#FF4500',
    fontWeight: '700',
  },
  activeLine: {
    position: 'absolute',
    bottom: -4,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: '#FF4500',
    borderRadius: 2,
  },
});
