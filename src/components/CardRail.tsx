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
import { SDUIAction, SDUIDataItem } from '@/schema/types';
import { useActionBus } from '@/sdui/ActionBus';
import { SectionHeader } from '@/components/SectionHeader';
import { DynamicImage } from '@/components/common/DynamicImage';
import { colors } from '@/theme';

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
    bg: colors.background.darkRail,
    text: colors.text.white,
    imageBg: colors.background.darkRailAccent,
    imageBorder: '#2A4A6A',
  },
  accent: {
    bg: colors.background.greenRail,
    text: colors.text.white,
    imageBg: colors.background.greenRailAccent,
    imageBorder: '#40916C',
  },
  cream: {
    bg: colors.background.creamRail,
    text: colors.text.primary,
    imageBg: colors.background.creamRailAccent,
    imageBorder: '#FFCFA0',
  },
};

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
              <DynamicImage 
                name={props.image} 
                backgroundColor={theme.imageBg} 
                borderColor={theme.imageBorder} 
                height={100}
                size={44}
              />
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
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    padding: 10,
    lineHeight: 18,
  },
});
