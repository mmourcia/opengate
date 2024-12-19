import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ActionConfig } from '../types/action';
import { actionRepository } from '../repositories/actionRepository';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { eventService } from '../services/eventService';

type NavigationProp = NativeStackNavigationProp<any>;

const ActionsSettings = () => {
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
    
    // Add focus listener
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadActions();
    });
    
    return () => {
      unsubscribeActions();
      unsubscribeFocus();
    };
  }, [navigation]);

  const handleDeleteAction = async (id: string) => {
    try {
      await actionRepository.deleteAction(id);
      setActions(actions.filter(action => action.id !== id));
    } catch (error) {
      console.error('Error deleting action:', error);
      Alert.alert('Error', 'Failed to delete action');
    }
  };

  const handleEditPress = (item: ActionConfig) => {
    navigation.navigate('EditAction', { action: item });
  };

  const renderActionItem = ({ item }: { item: ActionConfig }) => {
    if (!item?.config) {
      return null;
    }

    return (
      <TouchableOpacity 
        style={styles.actionItem}
        onPress={() => handleEditPress(item)}
      >
        <View style={styles.actionHeader}>
          <Icon name="touch-app" size={24} color="#007AFF" />
          <Text style={styles.actionName}>{item.name}</Text>
        </View>
        <View style={styles.actionDetails}>
          <Text style={styles.detailText}>URL: {item.config.url}</Text>
          <Text style={styles.detailText}>Method: {item.config.method}</Text>
          <Text style={styles.detailText}>
            Auth: {item.config.authType === 'none' ? 'None' : item.config.authType}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditPress(item)}
          >
            <Icon name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Action',
                'Are you sure you want to delete this action?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    onPress: () => handleDeleteAction(item.id),
                    style: 'destructive'
                  },
                ]
              );
            }}
          >
            <Icon name="delete" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={actions}
        renderItem={renderActionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddAction')}
      >
        <Icon name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add New Action</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  actionItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  actionDetails: {
    marginLeft: 32,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 16,
    margin: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default ActionsSettings; 