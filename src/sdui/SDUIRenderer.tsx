import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SDUIPage, SDUISection } from '../schema/types';
import { useActionBus } from './ActionBus';
import { componentRegistry } from './registry';
import { UnknownFallback } from './UnknownFallback';

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
  useUnknownPayload?: boolean;
}

export function SDUIRenderer({ page }: Props) {
  const { state } = useActionBus();

  // Split sections to inject Top Tabs organically
  const headerSection = page.sections.find(s => s.type === 'header_search');
  const quicklinksSection = page.sections.find(s => s.type === 'category_quicklinks');
  const contentSections = page.sections.filter(s => s.type !== 'header_search' && s.type !== 'category_quicklinks');

  const HeaderComponent = headerSection ? componentRegistry[headerSection.type] || UnknownFallback : null;

  return (
    <View style={styles.container}>
      {HeaderComponent && headerSection && (
        <HeaderComponent 
          {...headerSection.props} 
          data={headerSection.data} 
          action={headerSection.action} 
        />
      )}

      {quicklinksSection && quicklinksSection.data ? (
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarStyle: { backgroundColor: '#282CBA', elevation: 0, shadowOpacity: 0 },
            tabBarItemStyle: { width: 'auto', paddingHorizontal: 12, paddingBottom: 4 },
            tabBarLabelStyle: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', textTransform: 'none' },
            tabBarIndicatorStyle: { backgroundColor: '#FFFFFF', height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
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
                        color={focused ? '#282CBA' : '#FFFFFF'}
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
                      .map(section => {
                        const Component = componentRegistry[section.type];
                        if (!Component) return <UnknownFallback key={section.id} section={section} />;

                        return (
                          <Component
                            key={section.id}
                            {...section.props}
                            data={section.data}
                            action={section.action}
                          />
                        );
                      })}
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
            .map(section => {
              const Component = componentRegistry[section.type];
              if (!Component) return <UnknownFallback key={section.id} section={section} />;
              
              return (
                <Component
                  key={section.id}
                  {...section.props}
                  data={section.data}
                  action={section.action}
                />
              );
            })}
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
    backgroundColor: '#F7F7F7',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    paddingBottom: 16,
  },
  qlCircle: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 4 
  },
  qlCircleActive: { 
    backgroundColor: '#FFFFFF' 
  },
});
