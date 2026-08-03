// src/components/BottomTabBar.tsx
// Persistent bottom tab bar: Home, Activity, My Garage, Showrooms, Explore.
// Static — not SDUI-driven (noted as honest coverage gap in COVERAGE.md).
// Includes a dev-mode toggle button to switch between SDUI and Static screens.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TABS: { id: string; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'activity', label: 'Activity', icon: 'list-alt' },
  { id: 'garage', label: 'My Garage', icon: 'directions-car' },
  { id: 'showrooms', label: 'Showrooms', icon: 'store' },
  { id: 'explore', label: 'Explore', icon: 'explore' },
];

interface Props {
  activeTab?: string;
  onToggleScreen?: () => void;
  screenLabel?: string;
}

export function BottomTabBar({ activeTab = 'home', onToggleScreen, screenLabel }: Props) {
  return (
    <View style={styles.container}>
      {/* Dev toggle — visible in __DEV__ only */}
      {__DEV__ && onToggleScreen && (
        <TouchableOpacity style={styles.devToggle} onPress={onToggleScreen}>
          <Text style={styles.devToggleText}>
            {screenLabel ?? 'Toggle Screen'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.tabRow}>
        {TABS.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              activeOpacity={0.7}>
              <MaterialIcons
                name={tab.icon}
                size={24}
                color={isActive ? '#FF4500' : '#BDBDBD'}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  devToggle: {
    backgroundColor: '#1A1A2E',
    paddingVertical: 6,
    alignItems: 'center',
  },
  devToggleText: {
    color: '#FF4500',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabRow: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 4,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    color: '#BDBDBD',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#FF4500',
    fontWeight: '700',
  },
  activeDot: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF4500',
  },
});
