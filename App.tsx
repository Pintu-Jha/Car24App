/**
 * Cars24 SDUI — App entry point
 *
 * Wraps the entire app in ActionBusProvider so any component in the tree
 * can dispatch and read SDUI actions without prop-drilling.
 *
 * Screen switcher (dev toggle in BottomTabBar) lets you flip between:
 *   SDUI Home     — rendered from JSON via SDUIRenderer
 *   Static Home   — hardcoded twin for PERF.md comparison
 *
 * The useUnknownPayload flag swaps in with-unknown-component.json so the
 * graceful fallback can be demonstrated live on camera.
 */

import React, { useState } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, View } from 'react-native';
import { ActionBusProvider, useActionBus } from './src/sdui/ActionBus';
import { TouchableOpacity, Text } from 'react-native';
import { SDUIHomeScreen } from './src/screens/SDUIHomeScreen';
import { StaticHomeScreen } from './src/screens/StaticHomeScreen';
import { BottomTabBar } from './src/components/BottomTabBar';

type ActiveScreen = 'sdui' | 'static' | 'sdui_unknown';

const SCREEN_LABELS: Record<ActiveScreen, string> = {
  sdui: '▶ SDUI → Static',
  static: '▶ Static → SDUI (unknown fallback)',
  sdui_unknown: '▶ Fallback demo → SDUI normal',
};

function EmptyScreen({ routeName }: { routeName: string }) {
  const { dispatch } = useActionBus();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.root, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1A1A2E' }}>{routeName}</Text>
      <Text style={{ fontSize: 14, color: '#666', marginTop: 8, marginBottom: 30 }}>
        This screen is intentionally empty.
      </Text>
      
      <TouchableOpacity 
        style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#FF4500', borderRadius: 8 }}
        onPress={() => dispatch({ type: 'update_state', stateKey: 'currentRoute', value: null })}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function AppContent() {
  const { state } = useActionBus();
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<ActiveScreen>('sdui');

  const cycleScreen = () => {
    setScreen(current => {
      if (current === 'sdui') return 'static';
      if (current === 'static') return 'sdui_unknown';
      return 'sdui';
    });
  };

  const currentRoute = state['currentRoute'] as string | undefined | null;

  if (currentRoute) {
    return <EmptyScreen routeName={currentRoute} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#282CBA" translucent />

      {/* Top Safe Area - Status Bar Background */}
      <View style={{ height: insets.top, backgroundColor: '#282CBA' }} />

      <View style={styles.screenContainer}>
        {screen === 'sdui' && <SDUIHomeScreen useUnknownPayload={false} />}
        {screen === 'static' && <StaticHomeScreen />}
        {screen === 'sdui_unknown' && <SDUIHomeScreen useUnknownPayload={true} />}
      </View>

      <View style={{ paddingBottom: insets.bottom, backgroundColor: '#FFFFFF' }}>
        <BottomTabBar
          activeTab="home"
          onToggleScreen={cycleScreen}
          screenLabel={SCREEN_LABELS[screen]}
        />
      </View>
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ActionBusProvider>
        <AppContent />
      </ActionBusProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
  },
});

export default App;
