// src/screens/StaticHomeScreen.tsx
// Hardcoded twin of the SDUI home screen — zero SDUI, zero JSON.
// Used for PERF.md comparison: measures the overhead SDUI adds.
// Visual output should be identical to SDUIHomeScreen with sample-home.json.

import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { markEnd, markStart, printReport } from '@/perf/markers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/theme';

// ── Static data (mirrors sample-home.json exactly) ────────────────────────────

const BUY_CARDS = [
  { id: '1', title: 'All used cars', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80' },
  { id: '2', title: 'Budget used cars', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80' },
  { id: '3', title: 'Premium used cars', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80' },
  { id: '4', title: 'New cars', image: 'https://images.unsplash.com/photo-1502877338535-349c672aa56c?auto=format&fit=crop&w=400&q=80' },
];

const SELL_CARDS = [
  { id: '1', title: 'Sell your car', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80' },
  { id: '2', title: 'Check car valuation', image: 'https://images.unsplash.com/photo-1580519542036-ed47f3e42f9d?auto=format&fit=crop&w=400&q=80' },
  { id: '3', title: 'Scrap your car', image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&w=400&q=80' },
];

const LOAN_ITEMS: { id: string; label: string; icon: string; bg: string; image: string }[] = [
  { id: '1', label: 'Used car loan', icon: 'account-balance', bg: '#E8F4FD', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80' },
  { id: '2', label: 'Loan against car', icon: 'directions-car', bg: '#FFF5E6', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80' },
  { id: '3', label: 'Personal loan', icon: 'credit-card', bg: '#E8F5E9', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80' },
  { id: '4', label: 'Credit score', icon: 'bar-chart', bg: '#F3E5F5', image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=400&q=80' },
];

const CHECK_CARDS = [
  { id: '1', title: 'New car PDI', image: 'https://images.unsplash.com/photo-1632731835773-8968038817a1?auto=format&fit=crop&w=400&q=80' },
  { id: '2', title: 'Used car check', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80' },
  { id: '3', title: 'Vehicle history', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80' },
];

const GRID_CARDS = [
  { id: '1', title: 'New car PDI', subtitle: 'Pre delivery inspection', icon: 'search', bg: '#E3F2FD', accent: '#1565C0' },
  { id: '2', title: 'Used car check', subtitle: '300+ point evaluation', icon: 'verified', bg: '#E8F5E9', accent: '#1B5E20' },
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

// Overlay colors matching SDUI CardRail themes
const OVERLAY_COLORS: Record<string, string> = {
  [colors.background.darkRail]: 'rgba(13,27,42,0.60)',
  [colors.background.greenRail]: 'rgba(20,83,45,0.60)',
  [colors.background.creamRail]: 'rgba(255,248,240,0.6)',
};

function CardImageBg({ uri, fallbackColor }: { uri: string; fallbackColor: string }) {
  const [error, setError] = React.useState(false);
  if (!error) {
    return (
      <Image
        source={{ uri }}
        style={styles.railCardBgImage}
        resizeMode="cover"
        onError={() => setError(true)}
      />
    );
  }
  return (
    <View style={styles.railCardFallback}>
      <MaterialIcons name="directions-car" size={64} color={fallbackColor} />
    </View>
  );
}

function StaticCard({ title, image, bg, textColor = '#FFF' }: { title: string; image: string; bg: string; textColor?: string }) {
  const overlay = OVERLAY_COLORS[bg] ?? 'rgba(0,0,0,0.5)';
  const fallbackIcon = bg === colors.background.creamRail ? 'rgba(160,132,92,0.2)' : 'rgba(255,255,255,0.15)';
  const borderStyle = bg === colors.background.creamRail ? { borderWidth: 1, borderColor: '#F0D9A8' } : undefined;
  return (
    <TouchableOpacity style={[styles.railCard, { backgroundColor: bg }, borderStyle]} onPress={() => onPress(title)} activeOpacity={0.85}>
      {/* Image fills entire card */}
      <View style={styles.railCardImageLayer}>
        <CardImageBg uri={image} fallbackColor={fallbackIcon} />
      </View>
      {/* Colored overlay */}
      <View style={[styles.railCardOverlay, { backgroundColor: overlay }]} />
      {/* Title text */}
      <View style={styles.railCardTextLayer}>
        <Text style={[styles.railCardTitle, { color: textColor }]} numberOfLines={2}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

function LoanItemInline({ uri, bg }: { uri: string; bg: string }) {
  const [error, setError] = React.useState(false);
  if (!error) {
    return (
      <View style={[styles.loanImageBox, { backgroundColor: bg }]}>
        <Image
          source={{ uri }}
          style={styles.loanImage}
          resizeMode="cover"
          onError={() => setError(true)}
        />
      </View>
    );
  }
  return (
    <View style={[styles.loanImageBox, { backgroundColor: bg }]}>
      <MaterialIcons name="image" size={28} color="#666" />
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function TabContent({ tabId }: { tabId: string }) {
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
            renderItem={({ item }) => <StaticCard title={item.title} image={item.image} bg={colors.background.darkRail} />} />
        </>
      )}

      {/* Sell car rail */}
      {showSell && (
        <>
          <StaticSectionHeader title="Sell your car" />
          <FlatList data={SELL_CARDS} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id} contentContainerStyle={styles.railList}
            renderItem={({ item }) => <StaticCard title={item.title} image={item.image} bg={colors.background.greenRail} />} />
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
                <LoanItemInline uri={item.image} bg={item.bg} />
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
            renderItem={({ item }) => <StaticCard title={item.title} image={item.image} bg={colors.background.creamRail} textColor={colors.text.primary} />} />
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
                  <MaterialIcons name={card.icon} size={28} color={card.accent} />
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

  if (!hasReported.current) {
    markStart('static_total');
    markStart('view_build');
  }

  useEffect(() => {
    if (!hasReported.current) {
      markEnd('view_build');
      markEnd('static_total');
      printReport('Static Perf Report');
      hasReported.current = true;
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.main }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, spacing.md) }]}>
        <View style={styles.locationRow}>
          <View style={styles.locationLeft}>
            <MaterialIcons name="location-on" size={20} color={colors.text.white} />
            <Text style={styles.city}>Bangalore</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.text.white} />
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>PJ</Text></View>
        </View>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color={colors.text.placeholder} style={{ marginRight: spacing.sm }} />
          <Text style={styles.searchPlaceholder}>Search Swift</Text>
        </View>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarStyle: { backgroundColor: colors.brand.primary, elevation: 0, shadowOpacity: 0 },
          tabBarItemStyle: { width: 'auto', paddingHorizontal: spacing.md, paddingBottom: spacing.xs },
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
  content: { paddingBottom: spacing.lg },
  // Header — white search bar on blue
  header: { backgroundColor: colors.brand.primary, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm, zIndex: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  locationLeft: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  city: { fontSize: 16, fontWeight: '700', color: colors.text.white, marginLeft: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.card, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  searchPlaceholder: { fontSize: 14, color: colors.text.placeholder },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background.card, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.brand.primary, fontWeight: '700', fontSize: 15 },
  // Quicklinks
  qlCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background.glass, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  qlCircleActive: { backgroundColor: colors.background.card },
  // Section header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.sm + 2, gap: spacing.sm + 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary, letterSpacing: -0.3 },
  badge: { backgroundColor: colors.brand.accent, borderRadius: radius.pill, paddingHorizontal: spacing.sm + 2, paddingVertical: 3 },
  badgeText: { color: colors.text.white, fontSize: 11, fontWeight: '700' },
  // Rail cards — image bg + colored overlay + title on top
  railList: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  railCard: { width: 150, height: 155, borderRadius: radius.lg, overflow: 'hidden', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 6 },
  railCardImageLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  railCardBgImage: { width: '100%', height: '100%' },
  railCardFallback: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 16 },
  railCardOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  railCardTextLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: spacing.md + 2, justifyContent: 'flex-start' },
  railCardTitle: { fontSize: 15, fontWeight: '800', lineHeight: 21, letterSpacing: 0.1, textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  // Icon rail — rectangular image cards
  iconSection: { backgroundColor: colors.background.card, marginBottom: spacing.sm, paddingBottom: spacing.lg },
  iconList: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  iconItem: { alignItems: 'center', width: 80 },
  iconLabel: { fontSize: 12, color: colors.text.primary, textAlign: 'center', fontWeight: '600', lineHeight: 16 },
  loanImageBox: { width: 72, height: 72, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: spacing.sm },
  loanImage: { width: '100%', height: '100%' },
  // Grid
  gridSection: { backgroundColor: colors.background.card, marginBottom: spacing.sm, paddingBottom: spacing.lg },
  gridRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.md },
  gridCard: { flex: 1, borderRadius: radius.lg, padding: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  gridImageBox: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm + 2 },
  gridTitle: { fontSize: 14, fontWeight: '700', marginBottom: spacing.xs },
  gridSubtitle: { fontSize: 12, color: colors.text.secondary, lineHeight: 17 },
  // List rows
  listSection: { backgroundColor: colors.background.card, marginBottom: spacing.sm, paddingBottom: spacing.sm },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: spacing.lg, gap: 14 },
  listRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.light },
  listIcon: { width: 48, height: 48, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  listText: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: '600', color: colors.text.primary, marginBottom: 3 },
  listSubtitle: { fontSize: 12, color: colors.text.secondary, lineHeight: 17 },
});
