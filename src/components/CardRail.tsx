// src/components/CardRail.tsx
// Generic horizontal card rail — reused for Buy, Sell, and Car Check sections.
// Layout: Image fills card as background, colored overlay ensures readable title.
// Theme is controlled via props.cardStyle: "dark" | "accent" | "cream"

import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SDUIAction, SDUIDataItem } from '@/schema/types';
import { useActionBus } from '@/sdui/ActionBus';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, spacing, radius } from '@/theme';

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
const CARD_THEMES: Record<CardStyle, {
  bg: string;
  overlay: string;
  text: string;
  fallbackIconColor: string;
  borderColor?: string;
}> = {
  dark: {
    bg: '#0D1B2A',
    overlay: 'rgba(13,27,42,0.60)',
    text: colors.text.white,
    fallbackIconColor: 'rgba(255,255,255,0.15)',
  },
  accent: {
    bg: '#14532D',
    overlay: 'rgba(20,83,45,0.60)',
    text: colors.text.white,
    fallbackIconColor: 'rgba(255,255,255,0.15)',
  },
  cream: {
    bg: '#FFF8F0',
    overlay: 'rgba(255,248,240,0.6)',
    text: '#3D2C1E',
    fallbackIconColor: 'rgba(160,132,92,0.2)',
    borderColor: '#F0D9A8',
  },
};

function CardImage({ uri, cardStyle }: { uri: string; cardStyle: CardStyle }) {
  const isUrl = uri.startsWith('http');
  const [error, setError] = useState(false);
  const theme = CARD_THEMES[cardStyle];

  if (isUrl && !error) {
    return (
      <Image
        source={{ uri }}
        style={styles.cardImage}
        resizeMode="cover"
        onError={() => setError(true)}
      />
    );
  }

  // Fallback: large subtle icon centered in card
  return (
    <View style={styles.cardImageFallback}>
      <MaterialIcons name="directions-car" size={64} color={theme.fallbackIconColor} />
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
              style={[
                styles.card,
                { backgroundColor: theme.bg },
                theme.borderColor ? { borderWidth: 1, borderColor: theme.borderColor } : undefined,
              ]}
              onPress={() => item.action && dispatch(item.action)}
              activeOpacity={0.85}>
              {/* Image fills entire card as background */}
              <View style={styles.imageLayer}>
                <CardImage uri={props.image} cardStyle={cardStyle} />
              </View>

              {/* Semi-transparent colored overlay for text readability */}
              <View style={[styles.overlay, { backgroundColor: theme.overlay }]} />

              {/* Title text on top */}
              <View style={styles.textLayer}>
                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>
                  {props.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const CARD_WIDTH = 150;
const CARD_HEIGHT = 155;

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    position: 'relative',
    // Premium shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  imageLayer: {
    ...StyleSheet.absoluteFill,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageFallback: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  textLayer: {
    ...StyleSheet.absoluteFill,
    padding: spacing.md + 2,
    justifyContent: 'flex-start',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    letterSpacing: 0.1,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
