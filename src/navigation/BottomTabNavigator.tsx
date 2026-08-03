import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Types
import { BottomTabParamList } from './types';

// Screens
import { RootHomeScreen } from '../screens/RootHomeScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { GarageScreen } from '../screens/GarageScreen';
import { ShowroomsScreen } from '../screens/ShowroomsScreen';
import { ExploreScreen } from '../screens/ExploreScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#282CBA', // Cars24 Brand Blue
        tabBarInactiveTintColor: '#9B9B9B',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
          height: 60,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'help-outline';
          
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Activity') iconName = 'receipt-long';
          else if (route.name === 'Garage') iconName = 'directions-car';
          else if (route.name === 'Showrooms') iconName = 'storefront';
          else if (route.name === 'Explore') iconName = 'explore';

          return <MaterialIcons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={RootHomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Garage" component={GarageScreen} options={{ tabBarLabel: 'My Garage' }} />
      <Tab.Screen name="Showrooms" component={ShowroomsScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
    </Tab.Navigator>
  );
}
