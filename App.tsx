/**
 * Cars24 SDUI — App entry point
 *
 * Wraps the entire app in ActionBusProvider so any component in the tree
 * can dispatch and read SDUI actions without prop-drilling.
 */

import React from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { ActionBusProvider, useActionBus } from '@/sdui/ActionBus';
import { RootNavigator } from '@/navigation/RootNavigator';

function EmptyScreen({ routeName, onBack }: { routeName: string, onBack: () => void }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.root, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1A1A2E' }}>{routeName}</Text>
      <Text style={{ fontSize: 14, color: '#666', marginTop: 8, marginBottom: 30 }}>
        This screen is intentionally empty.
      </Text>
      
      <TouchableOpacity 
        style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#FF4500', borderRadius: 8 }}
        onPress={onBack}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

import { GlobalBottomSheet } from '@/components/common/GlobalBottomSheet';

function AppContent() {
  const { state, dispatch } = useActionBus();
  const currentRoute = state['currentRoute'] as string | undefined;

  if (currentRoute) {
    return (
      <>
        <EmptyScreen 
          routeName={currentRoute} 
          onBack={() => dispatch({ type: 'update_state', stateKey: 'currentRoute', value: undefined })} 
        />
        <GlobalBottomSheet />
      </>
    );
  }

  return (
    <>
      <RootNavigator />
      <GlobalBottomSheet />
    </>
  );
}

function App(props?: { screen?: string }) {
  const initialMode = (props?.screen === 'sdui' || props?.screen === 'sdui_unknown') ? props.screen : 'static';
  const initialState = { homeScreenMode: initialMode };

  return (
    <SafeAreaProvider>
      <ActionBusProvider initialState={initialState}>
        <AppContent />
      </ActionBusProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
});

export default App;
