import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomePage from '../screens/HomePage';
import BluetoothSettings from '../screens/BluetoothSettings';
import ActionsSettings from '../screens/ActionsSettings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddActionScreen from '../screens/AddActionScreen';
import EditActionScreen from '../screens/EditActionScreen';

const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const SettingsTabs = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
      }}
    >
      <TopTab.Screen 
        name="Bluetooth" 
        component={BluetoothSettings}
        options={{ 
          tabBarLabel: 'Bluetooth',
          tabBarIcon: ({ color }) => (
            <Icon name="bluetooth-searching" size={24} color={color} />
          ),
        }}
      />
      <TopTab.Screen 
        name="Actions" 
        component={ActionsSettings}
        options={{ 
          tabBarLabel: 'Actions',
          tabBarIcon: ({ color }) => (
            <Icon name="vpn-key" size={24} color={color} />
          ),
        }}
      />
    </TopTab.Navigator>
  );
};

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen 
      name="HomeTab" 
      component={HomePage}
      options={{
        title: 'Home',
        tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />
      }}
    />
    <Tab.Screen 
      name="SettingsTab" 
      component={SettingsTabs}
      options={{
        title: 'Settings',
        tabBarIcon: ({ color }) => <Icon name="settings" size={24} color={color} />
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Main" 
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="AddAction" component={AddActionScreen} />
    <Stack.Screen name="EditAction" component={EditActionScreen} />
  </Stack.Navigator>
);

export default AppNavigator; 