import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, radius, spacing } from '@/theme';

interface Props {
  message?: string;
}

export function ScreenLoader({ message = 'Loading layout...' }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.loaderBox}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="directions-car" size={28} color={colors.brand.primary} />
        </View>
        <ActivityIndicator size="large" color={colors.brand.primary} style={styles.spinner} />
        <Text style={styles.message}>{message}</Text>
      </View>

      {/* Skeleton placeholders */}
      <View style={styles.skeletonContainer}>
        <View style={styles.skeletonHeader} />
        <View style={styles.skeletonRail}>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loaderBox: {
    backgroundColor: colors.background.card,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.lg,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF0FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  spinner: {
    marginVertical: spacing.sm,
  },
  message: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  skeletonContainer: {
    width: '100%',
    paddingHorizontal: spacing.md,
    opacity: 0.4,
  },
  skeletonHeader: {
    height: 18,
    width: 140,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  skeletonRail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: '30%',
    height: 110,
    backgroundColor: '#E0E0E0',
    borderRadius: radius.md,
  },
});
