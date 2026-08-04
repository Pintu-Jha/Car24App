import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SDUISection } from '@/schema/types';
import { colors } from '@/theme';
import { SDUIListRenderer } from './SDUIListRenderer';
import { useActionBus } from './ActionBus';

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
  quicklinksSection: SDUISection;
  contentSections: SDUISection[];
  registry: Record<string, React.ComponentType<any>>;
  renderSection: (section: SDUISection, registry: Record<string, React.ComponentType<any>>) => React.ReactNode;
}

const TabScreenContent = React.memo(
  ({
    quicklinkId,
    contentSections,
    registry,
    renderSection,
  }: {
    quicklinkId: string;
    contentSections: SDUISection[];
    registry: Record<string, React.ComponentType<any>>;
    renderSection: (section: SDUISection, registry: Record<string, React.ComponentType<any>>) => React.ReactNode;
  }) => {
    const { state } = useActionBus();
    const mockState = React.useMemo(() => ({ ...state, activeTab: quicklinkId }), [state, quicklinkId]);

    return (
      <SDUIListRenderer
        sections={contentSections}
        registry={registry}
        mockState={mockState}
        renderSection={renderSection}
      />
    );
  }
);

export function SDUITabRenderer({ quicklinksSection, contentSections, registry, renderSection }: Props) {
  if (!quicklinksSection.data) return null;

  return (
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
              <TabScreenContent
                quicklinkId={quicklink.id}
                contentSections={contentSections}
                registry={registry}
                renderSection={renderSection}
              />
            )}
          </Tab.Screen>
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
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
