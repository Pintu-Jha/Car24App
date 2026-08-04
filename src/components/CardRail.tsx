// src/components/CardRail.tsx
// Generic horizontal card rail — reused for Buy, Sell, and Car Check sections.
// Layout: title at TOP-LEFT, image at BOTTOM-RIGHT (matching Cars24 screenshot).
// Theme is controlled via props.cardStyle: "dark" | "accent" | "cream"

import React from 'react';
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
  text: string;
}> = {
  dark: {
    bg: colors.background.darkRail,
    text: colors.text.white,
  },
  accent: {
    bg: colors.background.greenRail,
    text: colors.text.white,
  },
  cream: {
    bg: colors.background.creamRail,
    text: colors.text.primary,
  },
};

// Icon fallback map for when image URL fails or is a semantic string
const ICON_FALLBACK: Record<string, string> = {
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
};

function CardImage({ uri, cardStyle }: { uri: string; cardStyle: CardStyle }) {
  const isUrl = uri.startsWith('http');
  const [error, setError] = React.useState(false);

  if (isUrl && !error) {
    return (
      <Image
        source={{ uri }}
        style={styles.cardImage}
        resizeMode="contain"
        onError={() => setError(true)}
      />
    );
  }

  // Fallback: MaterialIcon
  const iconName = ICON_FALLBACK[uri] ?? 'image';
  const iconColor = cardStyle === 'cream' ? '#A0845C' : 'rgba(255,255,255,0.6)';
  return (
    <View style={styles.cardImageFallback}>
      <MaterialIcons name={iconName} size={40} color={iconColor} />
    </View>
  );
}

export function CardRail({ header, cardStyle = 'dark', data }: Props) {
  const { dispatch } = useActionBus();
  const theme = CARD_THEMES[cardStyle] ?? CARD_THEMES.dark;
  const isCream = cardStyle === 'cream';

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
                isCream && styles.cardCream,
              ]}
              onPress={() => item.action && dispatch(item.action)}
              activeOpacity={0.85}>
              {/* Title at top-left */}
              <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>
                {props.title}
              </Text>
              {/* Image at bottom-right */}
              <View style={styles.cardImageContainer}>
                <CardImage uri={props.image} cardStyle={cardStyle} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

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
    width: 140,
    height: 150,
    borderRadius: radius.md,
    overflow: 'hidden',
    padding: spacing.md,
    position: 'relative',
  },
  cardCream: {
    borderWidth: 1,
    borderColor: colors.border.cream,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    zIndex: 1,
    maxWidth: '70%',
  },
  cardImageContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 90,
    height: 90,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
