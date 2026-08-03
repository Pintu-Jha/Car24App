// src/screens/StaticHomeScreen.tsx
// Hardcoded twin of the SDUI home screen — zero SDUI, zero JSON.
// Used for PERF.md comparison: measures the overhead SDUI adds.
// Visual output should be identical to SDUIHomeScreen with sample-home.json.

import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { markEnd, markStart, printReport } from '../perf/markers';
import { Alert } from 'react-native';

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

const LOAN_ITEMS = [
  { id: '1', label: 'Used car loan', emoji: '🏦', bg: '#E3F2FD' },
  { id: '2', label: 'Loan against car', emoji: '🚗', bg: '#FFF3E0' },
  { id: '3', label: 'Personal loan', emoji: '💳', bg: '#E8F5E9' },
  { id: '4', label: 'Credit score', emoji: '📊', bg: '#F3E5F5' },
];

const CHECK_CARDS = [
  { id: '1', title: 'New car PDI', emoji: '🔍' },
  { id: '2', title: 'Used car check', emoji: '✅' },
  { id: '3', title: 'Vehicle history', emoji: '📋' },
];

const GRID_CARDS = [
  { id: '1', title: 'New car PDI', subtitle: 'Pre delivery inspection', emoji: '🔍', bg: '#E3F2FD', accent: '#1565C0' },
  { id: '2', title: 'Used car check', subtitle: '300+ point evaluation', emoji: '✅', bg: '#E8F5E9', accent: '#1B5E20' },
];

const FRAUD_ROWS = [
  { id: '1', title: 'Vehicle history report', subtitle: 'Service records and Accidental check', emoji: '📃', bg: '#FFF3E0' },
  { id: '2', title: 'Odometer fraud check', subtitle: '20% cars show odometer fraud', emoji: '🔢', bg: '#E8F5E9' },
  { id: '3', title: 'RTO check', subtitle: '15% cars have RC mismatches', emoji: '🏛', bg: '#E3F2FD' },
];

const QUICKLINKS = [
  { id: 'all', label: 'All', emoji: '◼' },
  { id: 'buy', label: 'Buy used car', emoji: '🚗' },
  { id: 'sell', label: 'Sell car', emoji: '🔑' },
  { id: 'loans', label: 'Loans', emoji: '💰' },
  { id: 'challan', label: 'Challan', emoji: '📋' },
  { id: 'car_check', label: 'Car check', emoji: '🔧' },
  { id: 'insurance', label: 'Insurance', emoji: '🛡' },
];

const onPress = (label: string) => {
  if (__DEV__) {Alert.alert('Tapped', label);}
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

export function StaticHomeScreen() {
  const hasReported = useRef(false);

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
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <Text style={styles.pin}>📍</Text>
          <Text style={styles.city}>Bangalore</Text>
          <Text style={styles.chevron}>▾</Text>
        </View>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search Swift</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>PJ</Text></View>
      </View>

      {/* Quicklinks */}
      <View style={styles.quicklinksWrap}>
        <FlatList data={QUICKLINKS} horizontal showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id} contentContainerStyle={styles.quicklinksList}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.qlItem} onPress={() => onPress(item.label)} activeOpacity={0.7}>
              <View style={[styles.qlCircle, index === 0 && styles.qlCircleActive]}>
                <Text style={styles.qlEmoji}>{item.emoji}</Text>
              </View>
              <Text style={[styles.qlLabel, index === 0 && styles.qlLabelActive]}>{item.label}</Text>
            </TouchableOpacity>
          )} />
      </View>

      {/* Buy car rail */}
      <StaticSectionHeader title="Buy car" badge="Up to ₹80,000 off" />
      <FlatList data={BUY_CARDS} horizontal showsHorizontalScrollIndicator={false}
        keyExtractor={i => i.id} contentContainerStyle={styles.railList}
        renderItem={({ item }) => <StaticCard title={item.title} emoji={item.emoji} bg="#0F1F33" />} />

      {/* Sell car rail */}
      <StaticSectionHeader title="Sell your car" />
      <FlatList data={SELL_CARDS} horizontal showsHorizontalScrollIndicator={false}
        keyExtractor={i => i.id} contentContainerStyle={styles.railList}
        renderItem={({ item }) => <StaticCard title={item.title} emoji={item.emoji} bg="#1B4332" />} />

      {/* Loans icon rail */}
      <View style={styles.iconSection}>
        <StaticSectionHeader title="Get loans" />
        <FlatList data={LOAN_ITEMS} horizontal showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id} contentContainerStyle={styles.iconList}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.iconItem} onPress={() => onPress(item.label)} activeOpacity={0.7}>
              <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                <Text style={styles.iconEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.iconLabel}>{item.label}</Text>
            </TouchableOpacity>
          )} />
      </View>

      {/* Car check rail */}
      <StaticSectionHeader title="Car check services" />
      <FlatList data={CHECK_CARDS} horizontal showsHorizontalScrollIndicator={false}
        keyExtractor={i => i.id} contentContainerStyle={styles.railList}
        renderItem={({ item }) => <StaticCard title={item.title} emoji={item.emoji} bg="#FFF8F0" textColor="#2C2C2C" />} />

      {/* Grid */}
      <View style={styles.gridSection}>
        <StaticSectionHeader title="Buy smarter with our checks" />
        <View style={styles.gridRow}>
          {GRID_CARDS.map(card => (
            <TouchableOpacity key={card.id} style={[styles.gridCard, { backgroundColor: card.bg }]}
              onPress={() => onPress(card.title)} activeOpacity={0.8}>
              <View style={styles.gridImageBox}>
                <Text style={styles.gridEmoji}>{card.emoji}</Text>
              </View>
              <Text style={[styles.gridTitle, { color: card.accent }]}>{card.title}</Text>
              <Text style={styles.gridSubtitle}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Fraud list */}
      <View style={styles.listSection}>
        <StaticSectionHeader title="Uncover frauds before you buy" />
        {FRAUD_ROWS.map((row, index) => (
          <TouchableOpacity key={row.id} style={[styles.listRow, index < FRAUD_ROWS.length - 1 && styles.listRowBorder]}
            onPress={() => onPress(row.title)} activeOpacity={0.7}>
            <View style={[styles.listIcon, { backgroundColor: row.bg }]}>
              <Text style={styles.listIconEmoji}>{row.emoji}</Text>
            </View>
            <View style={styles.listText}>
              <Text style={styles.listTitle}>{row.title}</Text>
              <Text style={styles.listSubtitle}>{row.subtitle}</Text>
            </View>
            <Text style={styles.listChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F7F7F7' },
  content: { paddingBottom: 16 },
  // Header
  header: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4, position: 'relative' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  pin: { fontSize: 14 },
  city: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginLeft: 4 },
  chevron: { fontSize: 14, color: '#666', marginLeft: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchPlaceholder: { fontSize: 14, color: '#9E9E9E' },
  avatar: { position: 'absolute', top: 12, right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: '#FF4500', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  // Quicklinks
  quicklinksWrap: { backgroundColor: '#FFF', paddingBottom: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  quicklinksList: { paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  qlItem: { alignItems: 'center', width: 72, paddingHorizontal: 4 },
  qlCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  qlCircleActive: { backgroundColor: '#FFF0EB', borderWidth: 2, borderColor: '#FF4500' },
  qlEmoji: { fontSize: 20 },
  qlLabel: { fontSize: 11, color: '#555', textAlign: 'center', lineHeight: 14, fontWeight: '500' },
  qlLabelActive: { color: '#FF4500', fontWeight: '700' },
  // Section header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.3 },
  badge: { backgroundColor: '#FF4500', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  // Rail cards
  railList: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  railCard: { width: 140, borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
  railCardImage: { height: 100, alignItems: 'center', justifyContent: 'center' },
  railCardEmoji: { fontSize: 44 },
  railCardTitle: { fontSize: 13, fontWeight: '600', padding: 10, lineHeight: 18 },
  // Icon rail
  iconSection: { backgroundColor: '#FFF', marginBottom: 8, paddingBottom: 16 },
  iconList: { paddingHorizontal: 16, gap: 16 },
  iconItem: { alignItems: 'center', width: 80 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  iconEmoji: { fontSize: 28 },
  iconLabel: { fontSize: 12, color: '#333', textAlign: 'center', fontWeight: '500', lineHeight: 16 },
  // Grid
  gridSection: { backgroundColor: '#FFF', marginBottom: 8, paddingBottom: 16 },
  gridRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  gridCard: { flex: 1, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  gridImageBox: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  gridEmoji: { fontSize: 26 },
  gridTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  gridSubtitle: { fontSize: 12, color: '#666', lineHeight: 17 },
  // List rows
  listSection: { backgroundColor: '#FFF', marginBottom: 8, paddingBottom: 8 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 14 },
  listRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EEE' },
  listIcon: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  listIconEmoji: { fontSize: 22 },
  listText: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 3 },
  listSubtitle: { fontSize: 12, color: '#777', lineHeight: 17 },
  listChevron: { fontSize: 22, color: '#BDBDBD' },
});
