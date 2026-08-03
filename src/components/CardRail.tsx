// src/components/CardRail.tsx
// Generic horizontal card rail — reused for Buy, Sell, and Car Check sections.
// Theme is controlled via props.cardStyle: "dark" | "accent" | "cream"
// This deliberate reuse is called out in COVERAGE.md as a schema design decision.

import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SDUIAction, SDUIDataItem } from '../schema/types';
import { useActionBus } from '../sdui/ActionBus';
import { SectionHeader } from './SectionHeader';

type CardStyle = 'dark' | 'accent' | 'cream';

interface Header {
  title: string;
  badge?: string;
}

interface RailCardProps {
  title: string;
  image: string;
}

interface Props {
  header?: Header;
  cardStyle?: CardStyle;
  data?: SDUIDataItem[];
  action?: SDUIAction;
}

// Theme tokens — all styling decisions live in code, not in JSON.
// JSON only sends a semantic token ("dark"), never raw style values.
const CARD_THEMES: Record<CardStyle, {
  bg: string;
  text: string;
  imageBg: string;
  imageBorder: string;
}> = {
  dark: {
    bg: '#0F1F33',
    text: '#FFFFFF',
    imageBg: '#1A3050',
    imageBorder: '#2A4A6A',
  },
  accent: {
    bg: '#1B4332',
    text: '#FFFFFF',
    imageBg: '#2D6A4F',
    imageBorder: '#40916C',
  },
  cream: {
    bg: '#FFF8F0',
    text: '#2C2C2C',
    imageBg: '#FFE8CC',
    imageBorder: '#FFCFA0',
  },
};

// Image placeholder: colored block with a stylised car emoji
// Covers the missing image files gracefully for demo purposes.
function CardImage({ name, theme }: { name: string; theme: typeof CARD_THEMES[CardStyle] }) {
  const emojiMap: Record<string, string> = {
    'car_suv.png': '🚙',
    'car_hatch.png': '🚗',
    'car_sports.png': '🏎',
    'car_new.png': '🚘',
    'hand_key.png': '🔑',
    'cash.png': '💵',
    'damaged_car.png': '🚧',
    'pdi.png': '🔍',
    'check.png': '✅',
    'history.png': '📋',
  };
  return (
    <View style={[styles.imageBox, { backgroundColor: theme.imageBg, borderColor: theme.imageBorder }]}>
      <Text style={styles.imageEmoji}>{emojiMap[name] ?? '🚗'}</Text>
    </View>
  );
}

export function CardRail({ header, cardStyle = 'dark', data }: Props) {
  const { dispatch } = useActionBus();
  const theme = CARD_THEMES[cardStyle] ?? CARD_THEMES.dark;

  return (
    <View style={styles.section}>
      {header && <SectionHeader title={header.title} badge={header.badge} />}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const props = item.props as unknown as RailCardProps;
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.bg }]}
              onPress={() => item.action && dispatch(item.action)}
              activeOpacity={0.85}>
              <CardImage name={props.image} theme={theme} />
              <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>
                {props.title}
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
    marginBottom: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  card: {
    width: 140,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  imageBox: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  imageEmoji: {
    fontSize: 44,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    padding: 10,
    lineHeight: 18,
  },
});
