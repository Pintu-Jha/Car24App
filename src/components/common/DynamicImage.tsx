import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

interface Props {
  name: string;
  backgroundColor?: string;
  borderColor?: string;
  size?: number;
  height?: number;
  borderRadius?: number;
}

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
};

export function DynamicImage({ name, backgroundColor = '#eee', borderColor, size = 44, height = 100, borderRadius = 0 }: Props) {
  const [error, setError] = useState(false);
  const isUrl = name.startsWith('http');

  if (isUrl && !error) {
    return (
      <View style={[styles.imageBox, { backgroundColor, height, borderRadius, borderWidth: borderColor ? 1 : 0, borderColor }]}>
        <Image
          source={{ uri: name }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          onError={() => setError(true)}
        />
      </View>
    );
  }

  return (
    <View style={[
      styles.imageBox,
      {
        backgroundColor,
        height,
        borderRadius,
        borderWidth: borderColor ? 1 : 0,
        borderColor
      }
    ]}>
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
});
