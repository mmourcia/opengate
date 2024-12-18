import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsTabs" 
        component={SettingsTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddAction" 
        component={AddActionScreen}
        options={{ title: 'Add New Action' }}
      />
      <Stack.Screen 
        name="EditAction" 
        component={EditActionScreen}
        options={{ title: 'Edit Action' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: true,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomePage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="door-front" size={size} color={color} />
            ),
            headerTitle: 'Open Gate',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="tune" size={size} color={color} />
            ),
            headerTitle: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 