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
import { SDUIDataItem, SDUIAction } from '../schema/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Location row */}
      <View style={styles.locationRow}>
        <View style={styles.locationLeft}>
          <MaterialIcons name="location-on" size={18} color="#FFFFFF" />
          <Text style={styles.cityText}>{city}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={18} color="#FFFFFF" />
        </View>
        <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color="#B0B2F2" style={styles.searchIconStyle} />
        {searchValue.length === 0 && (
          <Animated.Text style={[styles.searchPlaceholder, { opacity: fadeAnim }]} pointerEvents="none">
            {placeholder}
          </Animated.Text>
        )}
        <TextInput 
          style={styles.searchInput} 
          value={searchValue}
          onChangeText={setSearchValue}
          placeholderTextColor="#B0B2F2"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282CBA',
    paddingBottom: 4,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#282CBA',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIconStyle: {
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#B0B2F2',
    position: 'absolute',
    left: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    padding: 0,
  },
});
