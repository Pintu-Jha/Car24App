import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SDUIHomeScreen } from './SDUIHomeScreen';
import { StaticHomeScreen } from './StaticHomeScreen';
import { colors } from '../theme';

type ScreenState = 'sdui' | 'static' | 'sdui_unknown';

export function RootHomeScreen() {
  const [screen, setScreen] = useState<ScreenState>('sdui');

  const toggleScreen = () => {
    if (screen === 'sdui') setScreen('static');
    else if (screen === 'static') setScreen('sdui_unknown');
    else setScreen('sdui');
  };

  const getToggleText = () => {
    if (screen === 'sdui') return 'SDUI → Static';
    if (screen === 'static') return 'Static → SDUI (unknown fallback)';
    return 'Fallback demo → SDUI normal';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {screen === 'sdui' && <SDUIHomeScreen useUnknownPayload={false} />}
        {screen === 'static' && <StaticHomeScreen />}
        {screen === 'sdui_unknown' && <SDUIHomeScreen useUnknownPayload={true} />}
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
