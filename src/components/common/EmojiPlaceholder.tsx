import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  name: string;
  backgroundColor?: string;
  borderColor?: string;
  size?: number;
  height?: number;
  borderRadius?: number;
}

const EMOJI_MAP: Record<string, string> = {
  car_suv: '🚙',
  car_hatch: '🚗',
  car_sports: '🏎',
  car_new: '🚘',
  hand_key: '🔑',
  cash: '💵',
  damaged_car: '🚧',
  pdi: '🔍',
  check: '✅',
  history: '📋',
  car_loan: '🏦',
  car2: '🚙',
  cash2: '💸',
  credit: '📈',
  pdi2: '🔎',
  check2: '✔️',
};

export function EmojiPlaceholder({ name, backgroundColor = '#eee', borderColor, size = 44, height = 100, borderRadius = 0 }: Props) {
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
      <Text style={[styles.imageEmoji, { fontSize: size }]}>{EMOJI_MAP[name] ?? '🚗'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageEmoji: {
    textAlign: 'center',
  },
});
