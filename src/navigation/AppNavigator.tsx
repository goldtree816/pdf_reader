import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Clock3, Heart, House, Wrench} from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import RecentScreen from '../screens/RecentScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import ToolsScreen from '../screens/ToolsScreen';
import PdfViewerScreen from '../screens/PdfViewerScreen';


// =========================
// Navigation Types
// =========================

export type RootStackParamList = {
  MainTabs: undefined;

  PdfViewer: {
    uri: string;
    name: string;
  };
};

export type RootTabParamList = {
  Home: undefined;
  Recent: undefined;
  Favorite: undefined;
  Tools: undefined;
};


// =========================
// Create Navigators
// =========================

const Stack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator<RootTabParamList>();


// =========================
// Bottom Tabs
// =========================

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#EC4F70',
        tabBarInactiveTintColor: '#9295A3',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 3,
          marginVertical: 6,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },

        tabBarStyle: {
          height: 75,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
        },
      }}
    >

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => <House color={color} size={size} strokeWidth={2.3} />,
          tabBarActiveBackgroundColor: '#FFF0F3',
        }}
      />

      <Tab.Screen
        name="Recent"
        component={RecentScreen}
        options={{
          title: 'Recent',
          tabBarIcon: ({color, size}) => <Clock3 color={color} size={size} strokeWidth={2.3} />,
          tabBarActiveBackgroundColor: '#FFF0F3',
        }}
      />

      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          title: 'Favorite',
          tabBarIcon: ({color, size}) => <Heart color={color} size={size} strokeWidth={2.3} />,
          tabBarActiveBackgroundColor: '#FFF0F3',
        }}
      />

      <Tab.Screen
        name="Tools"
        component={ToolsScreen}
        options={{
          title: 'Tools',
          tabBarIcon: ({color, size}) => <Wrench color={color} size={size} strokeWidth={2.3} />,
          tabBarActiveBackgroundColor: '#FFF0F3',
        }}
      />

    </Tab.Navigator>
  );
}


// =========================
// Main Navigator
// =========================

function AppNavigator() {
  return (
    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
        />

        <Stack.Screen
          name="PdfViewer"
          component={PdfViewerScreen}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}


export default AppNavigator;