import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from '@/navigation/BottomTabNavigator';

export function RootNavigator() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
