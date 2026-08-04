// src/components/HeaderSearch.tsx
// Sticky header — location pin + city, rotating search placeholder, avatar initials.
// Props from JSON: city, avatarInitials, searchPlaceholders

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SDUIDataItem, SDUIAction } from '@/schema/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/theme';

interface Props {
  city: string;
  avatarInitials: string;
  searchPlaceholders: string[];
  data?: SDUIDataItem[];
  action?: SDUIAction;
}

export function HeaderSearch({ city, avatarInitials, searchPlaceholders }: Props) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!searchPlaceholders || searchPlaceholders.length === 0) return;

    const rotate = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setPlaceholderIndex(i => (i + 1) % searchPlaceholders.length);
    };

    const interval = setInterval(rotate, 2500);
    return () => clearInterval(interval);
  }, [fadeAnim, searchPlaceholders]);

  const placeholder =
    searchPlaceholders && searchPlaceholders.length > 0
      ? searchPlaceholders[placeholderIndex]
      : 'Search cars';

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.md) }]}>
      {/* Location row */}
      <View style={styles.locationRow}>
        <View style={styles.locationLeft}>
          <MaterialIcons name="location-on" size={20} color={colors.text.white} />
          <Text style={styles.cityText}>{city}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.text.white} />
        </View>
        <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar — solid white on blue header, matching Cars24 screenshot */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={22} color={colors.text.placeholder} style={styles.searchIconStyle} />
        {searchValue.length === 0 && (
          <Animated.Text style={[styles.searchPlaceholder, { opacity: fadeAnim }]} pointerEvents="none">
            {placeholder}
          </Animated.Text>
        )}
        <TextInput 
          style={styles.searchInput} 
          value={searchValue}
          onChangeText={setSearchValue}
          placeholderTextColor={colors.text.placeholder}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand.primary,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.white,
    marginLeft: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.brand.primary,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: 'relative',
  },
  searchIconStyle: {
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.text.placeholder,
    position: 'absolute',
    left: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    padding: 0,
  },
});
