// src/screens/StaticHomeScreen.tsx
// Hardcoded twin of the SDUI home screen — zero SDUI, zero JSON.
// Used for PERF.md comparison: measures the overhead SDUI adds.
// Visual output should be identical to SDUIHomeScreen with sample-home.json.

import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { markEnd, markStart, printReport } from '../perf/markers';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

// ── Static data (mirrors sample-home.json exactly) ────────────────────────────

const BUY_CARDS = [
  { id: '1', title: 'All used cars', emoji: '🚙' },
  { id: '2', title: 'Budget used cars', emoji: '🚗' },
  { id: '3', title: 'Premium used cars', emoji: '🏎' },
  { id: '4', title: 'New cars', emoji: '🚘' },
];

const SELL_CARDS = [
  { id: '1', title: 'Sell your car', emoji: '🔑' },
  { id: '2', title: 'Check car valuation', emoji: '💵' },
  { id: '3', title: 'Scrap your car', emoji: '🚧' },
];

const LOAN_ITEMS: { id: string; label: string; icon: string; bg: string }[] = [
  { id: '1', label: 'Used car loan', icon: 'account-balance', bg: '#E3F2FD' },
  { id: '2', label: 'Loan against car', icon: 'directions-car', bg: '#FFF3E0' },
  { id: '3', label: 'Personal loan', icon: 'credit-card', bg: '#E8F5E9' },
  { id: '4', label: 'Credit score', icon: 'bar-chart', bg: '#F3E5F5' },
];

const CHECK_CARDS = [
  { id: '1', title: 'New car PDI', emoji: '🔍' },
  { id: '2', title: 'Used car check', emoji: '✅' },
  { id: '3', title: 'Vehicle history', emoji: '📋' },
];

const GRID_CARDS = [
  { id: '1', title: 'New car PDI', subtitle: 'Pre delivery inspection', emoji: 'search', bg: '#E3F2FD', accent: '#1565C0' },
  { id: '2', title: 'Used car check', subtitle: '300+ point evaluation', emoji: 'verified', bg: '#E8F5E9', accent: '#1B5E20' },
];

const FRAUD_ROWS = [
  { id: '1', title: 'Vehicle history report', subtitle: 'Service records and Accidental check', icon: 'description', iconColor: '#FF8F00', bg: '#FFF3E0' },
  { id: '2', title: 'Odometer fraud check', subtitle: '20% cars show odometer fraud', icon: 'speed', iconColor: '#2E7D32', bg: '#E8F5E9' },
  { id: '3', title: 'RTO check', subtitle: '15% cars have RC mismatches', icon: 'account-balance', iconColor: '#1565C0', bg: '#E3F2FD' },
];

const QUICKLINKS: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'buy', label: 'Buy used car', icon: 'directions-car' },
  { id: 'sell', label: 'Sell car', icon: 'vpn-key' },
  { id: 'loans', label: 'Loans', icon: 'account-balance-wallet' },
  { id: 'challan', label: 'Challan', icon: 'description' },
  { id: 'car_check', label: 'Car check', icon: 'build' },
  { id: 'insurance', label: 'Insurance', icon: 'security' },
];

const onPress = (label: string) => {
  if (__DEV__) { console.log('Tapped', label); }
};

// ── Sub-components (all inline — no abstraction, that's the point) ─────────────

function StaticSectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {badge ? <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View> : null}
    </View>
  );
}

function StaticCard({ title, emoji, bg, textColor = '#FFF' }: { title: string; emoji: string; bg: string; textColor?: string }) {
  return (
    <TouchableOpacity style={[styles.railCard, { backgroundColor: bg }]} onPress={() => onPress(title)} activeOpacity={0.85}>
      <View style={[styles.railCardImage, { backgroundColor: bg === '#0F1F33' ? '#1A3050' : bg === '#1B4332' ? '#2D6A4F' : '#FFE8CC' }]}>
        <Text style={styles.railCardEmoji}>{emoji}</Text>
      </View>
      <Text style={[styles.railCardTitle, { color: textColor }]} numberOfLines={2}>{title}</Text>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function TabContent({ tabId }: { tabId: string }) {
  // Determine visibility logic exactly as SDUI does
  const showBuy = tabId === 'all' || tabId === 'buy';
  const showSell = tabId === 'all' || tabId === 'sell';
  const showLoans = tabId === 'all' || tabId === 'loans';
  const showCarCheck = tabId === 'all' || tabId === 'car_check';
  const showSmartChecks = tabId === 'all' || tabId === 'buy' || tabId === 'car_check';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Buy car rail */}
      {showBuy && (
        <>
          <StaticSectionHeader title="Buy car" badge="Up to ₹80,000 off" />
          <FlatList data={BUY_CARDS} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} contentContainerStyle={styles.railList}
            renderItem={({ item }) => <StaticCard title={item.title} emoji={item.emoji} bg="#0F1F33" />} />
        </>
      )}

      {/* Sell car rail */}
      {showSell && (
        <>
          <StaticSectionHeader title="Sell your car" />
          <FlatList data={SELL_CARDS} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} contentContainerStyle={styles.railList}
            renderItem={({ item }) => <StaticCard title={item.title} emoji={item.emoji} bg="#1B4332" />} />
        </>
      )}

      {/* Loans icon rail */}
      {showLoans && (
        <View style={styles.iconSection}>
          <StaticSectionHeader title="Get loans" />
          <FlatList data={LOAN_ITEMS} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} contentContainerStyle={styles.iconList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.iconItem} onPress={() => onPress(item.label)} activeOpacity={0.7}>
                <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                  <MaterialIcons name={item.icon} size={28} color="#555" />
                </View>
                <Text style={styles.iconLabel}>{item.label}</Text>
              </TouchableOpacity>
            )} />
        </View>
      )}

      {/* Car check rail */}
      {showCarCheck && (
        <>
          <StaticSectionHeader title="Car check services" />
          <FlatList data={CHECK_CARDS} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} contentContainerStyle={styles.railList}
            renderItem={({ item }) => <StaticCard title={item.title} emoji={item.emoji} bg="#FFF8F0" textColor="#2C2C2C" />} />
        </>
      )}

      {/* Grid */}
      {showSmartChecks && (
        <View style={styles.gridSection}>
          <StaticSectionHeader title="Buy smarter with our checks" />
          <View style={styles.gridRow}>
            {GRID_CARDS.map(card => (
              <TouchableOpacity key={card.id} style={[styles.gridCard, { backgroundColor: card.bg }]}
                onPress={() => onPress(card.title)} activeOpacity={0.8}>
                <View style={styles.gridImageBox}>
                  <MaterialIcons name={card.emoji} size={28} color={card.accent} />
                </View>
                <Text style={[styles.gridTitle, { color: card.accent }]}>{card.title}</Text>
                <Text style={styles.gridSubtitle}>{card.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Fraud list */}
      {showSmartChecks && (
        <View style={styles.listSection}>
          <StaticSectionHeader title="Uncover frauds before you buy" />
          {FRAUD_ROWS.map((row, index) => (
            <TouchableOpacity key={row.id} style={[styles.listRow, index < FRAUD_ROWS.length - 1 && styles.listRowBorder]}
              onPress={() => onPress(row.title)} activeOpacity={0.7}>
              <View style={[styles.listIcon, { backgroundColor: row.bg }]}>
                <MaterialIcons name={row.icon} size={22} color={row.iconColor} />
              </View>
              <View style={styles.listText}>
                <Text style={styles.listTitle}>{row.title}</Text>
                <Text style={styles.listSubtitle}>{row.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

export function StaticHomeScreen() {
  const hasReported = useRef(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    markStart('static_total');
    markStart('static_view_build');
  }, []);

  useEffect(() => {
    if (!hasReported.current) {
      markEnd('static_view_build');
      markEnd('static_total');
      printReport();
      hasReported.current = true;
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.main }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.locationRow}>
          <View style={styles.locationLeft}>
            <MaterialIcons name="location-on" size={18} color={colors.text.white} />
            <Text style={styles.city}>Bangalore</Text>
            <MaterialIcons name="keyboard-arrow-down" size={18} color={colors.text.white} />
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>PJ</Text></View>
        </View>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={colors.text.placeholder} style={{ marginRight: 10 }} />
          <Text style={styles.searchPlaceholder}>Search Swift</Text>
        </View>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarStyle: { backgroundColor: colors.brand.primary, elevation: 0, shadowOpacity: 0 },
          tabBarItemStyle: { width: 'auto', paddingHorizontal: 12, paddingBottom: 4 },
          tabBarLabelStyle: { color: colors.text.white, fontSize: 12, fontWeight: '700', textTransform: 'none' },
          tabBarIndicatorStyle: { backgroundColor: colors.background.card, height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
        }}
      >
        {QUICKLINKS.map(link => (
          <Tab.Screen 
            key={link.id} 
            name={link.id}
            options={{
              tabBarLabel: link.label,
              tabBarIcon: ({ focused }) => (
                <View style={[styles.qlCircle, focused && styles.qlCircleActive]}>
                  <MaterialIcons
                    name={link.icon}
                    size={22}
                    color={focused ? colors.brand.primary : colors.text.white}
                  />
                </View>
              )
            }}
          >
            {() => <TabContent tabId={link.id} />}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </View>
  );
}



const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.main },
  content: { paddingBottom: 16 },
  // Header
  header: { backgroundColor: colors.brand.primary, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, zIndex: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  locationLeft: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  pin: { fontSize: 14 },
  city: { fontSize: 16, fontWeight: '700', color: colors.text.white, marginLeft: 2 },
  chevron: { fontSize: 14, color: colors.text.white },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.glass, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.border.glass },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchPlaceholder: { fontSize: 14, color: colors.text.placeholder },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.background.card, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.brand.primary, fontWeight: '700', fontSize: 14 },
  // Quicklinks
  quicklinksWrap: { backgroundColor: colors.brand.primary },
  quicklinksList: { paddingHorizontal: 12, paddingTop: 12, gap: 8 },
  qlItem: { alignItems: 'center', width: 72, paddingHorizontal: 4, paddingBottom: 16 },
  qlCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background.glass, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  qlCircleActive: { backgroundColor: colors.background.card },
  qlEmoji: { fontSize: 20 },
  qlLabel: { fontSize: 11, color: colors.text.white, textAlign: 'center', lineHeight: 14, fontWeight: '500' },
  qlLabelActive: { fontWeight: '700' },
  qlActiveLine: { position: 'absolute', bottom: 0, left: 8, right: 8, height: 3, backgroundColor: colors.text.white, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  // Section header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary, letterSpacing: -0.3 },
  badge: { backgroundColor: colors.brand.accent, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { color: colors.text.white, fontSize: 11, fontWeight: '700' },
  // Rail cards
  railList: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  railCard: { width: 140, borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
  railCardImage: { height: 100, alignItems: 'center', justifyContent: 'center' },
  railCardEmoji: { fontSize: 44 },
  railCardTitle: { fontSize: 13, fontWeight: '600', padding: 10, lineHeight: 18 },
  // Icon rail
  iconSection: { backgroundColor: colors.background.card, marginBottom: 8, paddingBottom: 16 },
  iconList: { paddingHorizontal: 16, gap: 16 },
  iconItem: { alignItems: 'center', width: 80 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  iconEmoji: { fontSize: 28 },
  iconLabel: { fontSize: 12, color: colors.text.secondary, textAlign: 'center', fontWeight: '500', lineHeight: 16 },
  // Grid
  gridSection: { backgroundColor: colors.background.card, marginBottom: 8, paddingBottom: 16 },
  gridRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  gridCard: { flex: 1, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  gridImageBox: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  gridEmoji: { fontSize: 26 },
  gridTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  gridSubtitle: { fontSize: 12, color: colors.text.secondary, lineHeight: 17 },
  // List rows
  listSection: { backgroundColor: colors.background.card, marginBottom: 8, paddingBottom: 8 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 14 },
  listRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.light },
  listIcon: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  listIconEmoji: { fontSize: 22 },
  listText: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: '600', color: colors.text.primary, marginBottom: 3 },
  listSubtitle: { fontSize: 12, color: colors.text.secondary, lineHeight: 17 },
  listChevron: { fontSize: 22, color: '#BDBDBD' },
});
