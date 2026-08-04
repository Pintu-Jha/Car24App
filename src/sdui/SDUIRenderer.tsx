import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { SDUIPage, SDUISection } from '@/schema/types';
import { useActionBus } from '@/sdui/ActionBus';
import { UnknownFallback } from '@/sdui/UnknownFallback';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { colors } from '@/theme';

const Tab = createMaterialTopTabNavigator();

const QUICKLINK_ICON_MAP: Record<string, string> = {
  'grid': 'apps',
  'car': 'directions-car',
  'key': 'vpn-key',
  'money-bag': 'account-balance-wallet',
  'document': 'description',
  'wrench': 'build',
  'shield': 'security',
};

interface Props {
  page: SDUIPage;
  registry: Record<string, React.ComponentType<any>>;
  useUnknownPayload?: boolean;
}

const MemoizedSection = React.memo(
  ({ section, registry }: { section: SDUISection; registry: Record<string, React.ComponentType<any>> }) => {
    const Component = registry[section.type];
    if (!Component) return <UnknownFallback section={section} />;

    return (
      <ErrorBoundary fallbackMessage={`Failed to render component: ${section.type}`}>
        <Component {...section.props} data={section.data} action={section.action} />
      </ErrorBoundary>
    );
  },
  (prev, next) => JSON.stringify(prev.section) === JSON.stringify(next.section)
);

export function SDUIRenderer({ page, registry }: Props) {
  const { state } = useActionBus();

  // Split sections to inject Top Tabs organically
  const headerSection = page.sections.find(s => s.type === 'header_search');
  const quicklinksSection = page.sections.find(s => s.type === 'category_quicklinks');
  const contentSections = page.sections.filter(s => s.type !== 'header_search' && s.type !== 'category_quicklinks');

  const HeaderComponent = headerSection ? registry[headerSection.type] || UnknownFallback : null;

  return (
    <View style={styles.container}>
      {HeaderComponent && headerSection && (
        <ErrorBoundary fallbackMessage="Failed to render Header">
          <HeaderComponent
            {...headerSection.props}
            data={headerSection.data}
            action={headerSection.action}
          />
        </ErrorBoundary>
      )}

      {quicklinksSection && quicklinksSection.data ? (
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarStyle: { backgroundColor: colors.brand.primary, elevation: 0, shadowOpacity: 0 },
            tabBarItemStyle: { width: 'auto', paddingHorizontal: 12, paddingBottom: 4 },
            tabBarLabelStyle: { color: colors.text.white, fontSize: 12, fontWeight: '700', textTransform: 'none' },
            tabBarIndicatorStyle: { backgroundColor: colors.background.card, height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
          }}
        >
          {quicklinksSection.data.map(quicklink => {
            // Mock the activeTab state so SDUI rendering rules apply accurately per tab
            const mockState = { ...state, activeTab: quicklink.id };

            return (
              <Tab.Screen
                key={quicklink.id}
                name={quicklink.id}
                options={{
                  tabBarLabel: quicklink.props.label as string,
                  tabBarIcon: ({ focused }) => (
                    <View style={[styles.qlCircle, focused && styles.qlCircleActive]}>
                      <MaterialIcons
                        name={QUICKLINK_ICON_MAP[quicklink.props.icon as string] || 'help-outline'}
                        size={22}
                        color={focused ? colors.brand.primary : colors.text.white}
                      />
                    </View>
                  )
                }}
              >
                {() => (
                  <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                  >
                    {contentSections
                      .filter(section => isVisible(section, mockState))
                      .map(section => (
                        <MemoizedSection key={section.id} section={section} registry={registry} />
                      ))}
                  </ScrollView>
                )}
              </Tab.Screen>
            );
          })}
        </Tab.Navigator>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {contentSections
            .filter(section => isVisible(section, state))
            .map(section => (
              <MemoizedSection key={section.id} section={section} registry={registry} />
            ))}
        </ScrollView>
      )}
    </View>
  );
}

function isVisible(section: SDUISection, state: Record<string, unknown>): boolean {
  if (!section.visible) return true;

  const val = state[section.visible.stateKey];
  if (section.visible.equals !== undefined) {
    return val === section.visible.equals;
  }
  if (section.visible.in !== undefined) {
    return section.visible.in.includes(val);
  }
  return true;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  content: {
    paddingBottom: 16,
  },
  qlCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.glass,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  qlCircleActive: {
    backgroundColor: colors.background.card
  },
});
