// src/components/common/DynamicImage.tsx
// Reusable image component: renders URL images with icon fallback.
// Used across CardGrid, ListRows, and any component needing dynamic images.

import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  name: string;        // URL string or semantic key
  backgroundColor?: string;
  borderColor?: string;
  size?: number;       // icon size for fallback
  width?: number;      // explicit width (optional)
  height?: number;
  borderRadius?: number;
}

// Semantic key → MaterialIcon name (fallback when not a URL)
const ICON_MAP: Record<string, string> = {
  car_suv: 'directions-car',
  car_hatch: 'directions-car',
  car_sports: 'time-to-leave',
  car_new: 'local-taxi',
  hand_key: 'vpn-key',
  cash: 'attach-money',
  damaged_car: 'build',
  pdi: 'find-in-page',
  check: 'check-circle',
  history: 'history',
  car_loan: 'account-balance',
  car2: 'directions-car',
  cash2: 'attach-money',
  credit: 'trending-up',
  pdi2: 'find-in-page',
  check2: 'check-circle',
  report: 'description',
  odometer: 'speed',
  rto: 'account-balance',
};

export function DynamicImage({
  name,
  backgroundColor = '#eee',
  borderColor,
  size = 44,
  width,
  height = 100,
  borderRadius = 0,
}: Props) {
  const [error, setError] = useState(false);
  const isUrl = name.startsWith('http');

  const containerStyle = [
    styles.imageBox,
    {
      backgroundColor,
      height,
      borderRadius,
      borderWidth: borderColor ? 1 : 0,
      borderColor,
      ...(width ? { width } : {}),
    },
  ];

  if (isUrl && !error) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: name }}
          style={styles.fullImage}
          resizeMode="cover"
          onError={() => setError(true)}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <MaterialIcons
        name={ICON_MAP[name] ?? 'image'}
        size={size}
        color="#888"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});
