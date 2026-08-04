import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SDUIHomeScreen } from '@/screens/SDUIHomeScreen';
import { StaticHomeScreen } from '@/screens/StaticHomeScreen';
import { colors } from '@/theme';
import { useActionBus } from '@/sdui/ActionBus';

type ScreenState = 'sdui' | 'static' | 'sdui_unknown';

import { ScreenLoader } from '@/components/common/ScreenLoader';

export function RootHomeScreen() {
  const { state, dispatch } = useActionBus();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const screen = (state['homeScreenMode'] as ScreenState) || 'sdui';

  const toggleScreen = () => {
    setIsTransitioning(true);
    let next: ScreenState = 'sdui';
    if (screen === 'sdui') next = 'static';
    else if (screen === 'static') next = 'sdui_unknown';

    dispatch({ type: 'update_state', stateKey: 'homeScreenMode', value: next });

    setTimeout(() => {
      setIsTransitioning(false);
    }, 180);
  };

  const getToggleText = () => {
    if (screen === 'sdui') return 'SDUI → Static';
    if (screen === 'static') return 'Static → SDUI (unknown fallback)';
    return 'Fallback demo → SDUI normal';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isTransitioning ? (
          <ScreenLoader message={`Switching to ${screen === 'sdui' ? 'Static' : 'SDUI'} mode...`} />
        ) : (
          <>
            {screen === 'sdui' && <SDUIHomeScreen useUnknownPayload={false} />}
            {screen === 'static' && <StaticHomeScreen />}
            {screen === 'sdui_unknown' && <SDUIHomeScreen useUnknownPayload={true} />}
          </>
        )}
      </View>

      {/* Dev Toggle at the bottom of the home content */}
      <TouchableOpacity
        style={styles.devToggle}
        onPress={toggleScreen}
        activeOpacity={0.9}
      >
        <Text style={styles.devToggleText}>
          ▶ {getToggleText()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.main },
  content: { flex: 1 },
  devToggle: {
    backgroundColor: '#111118', // Keep this explicitly dark as a developer tool
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devToggleText: {
    color: colors.brand.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
