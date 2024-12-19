import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl, Text } from 'react-native';
import ActionTile from '../components/ActionTile';
import { ActionConfig } from '../types/action';
import { actionRepository } from '../repositories/actionRepository';
import { actionExecutor } from '../services/actionExecutor';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { eventService } from '../services/eventService';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<any>;

const HomePage = () => {
  const [actions, setActions] = useState<ActionConfig[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const loadActions = async () => {
    try {
      const loadedActions = await actionRepository.getAllActions();
      setActions(loadedActions);
    } catch (error) {
      console.error('Error loading actions:', error);
      Alert.alert('Error', 'Failed to load actions');
    }
  };

  useEffect(() => {
    loadActions();
    const unsubscribeActions = eventService.onActionsUpdated(loadActions);
    const unsubscribeMappings = eventService.onMappingsUpdated(loadActions);
    
    // Add focus listener
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadActions();
    });
    
    return () => {
      unsubscribeActions();
      unsubscribeMappings();
      unsubscribeFocus();
    };
  }, [navigation]);

  const handleActionPress = async (action: ActionConfig) => {
    try {
      await actionExecutor.executeAction(action);
      Alert.alert('Success', 'Action executed successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to execute action');
    } finally {
      await loadActions(); // Reload to update status
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActions();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Available Actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <ActionTile
            key={action.id}
            title={action.name}
            icon="play-circle"
            status={action.lastExecution?.success}
            onPress={() => handleActionPress(action)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
});

export default HomePage; 