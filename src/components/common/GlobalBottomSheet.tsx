import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useActionBus } from '@/sdui/ActionBus';
import { colors, radius, spacing } from '@/theme';

export function GlobalBottomSheet() {
  const { state, dispatch } = useActionBus();
  const activeSheet = state['activeSheet'] as { sheetId: string; payload?: Record<string, any> } | undefined;

  if (!activeSheet) return null;

  const close = () => {
    dispatch({ type: 'update_state', stateKey: 'activeSheet', value: undefined });
  };

  const payload = activeSheet.payload || {};
  const title = (payload.title as string) || 'Modal Sheet';
  const subtitle = (payload.subtitle as string) || 'Powered by Server-Driven UI (open_sheet action)';

  return (
    <Modal
      transparent
      animationType="slide"
      visible={true}
      onRequestClose={close}
    >
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="bolt" size={24} color={colors.brand.primary} />
            </View>
            <TouchableOpacity onPress={close} style={styles.closeBtn}>
              <MaterialIcons name="close" size={22} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.infoBox}>
            <MaterialIcons name="check-circle" size={18} color={colors.status.success} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>Executed via SDUI Action: open_sheet ({activeSheet.sheetId})</Text>
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={close}>
            <Text style={styles.actionBtnText}>Continue</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.main,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: colors.brand.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  actionBtnText: {
    color: colors.text.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
