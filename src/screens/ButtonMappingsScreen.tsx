import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ButtonMapping } from '../types/buttonMapping';
import { buttonMappingRepository } from '../repositories/buttonMappingRepository';
import { useNavigation } from '@react-navigation/native';
import { eventService } from '../services/eventService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<any>;

const ButtonMappingsScreen = () => {
  const [mappings, setMappings] = useState<ButtonMapping[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const loadMappings = async () => {
    try {
      const loadedMappings = await buttonMappingRepository.getMappings();
      setMappings(loadedMappings);
    } catch (error) {
      console.error('Error loading mappings:', error);
      Alert.alert('Error', 'Failed to load button mappings');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMappings();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMappings();
    const unsubscribeMappings = eventService.onMappingsUpdated(loadMappings);
    
    // Add focus listener
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadMappings();
    });
    
    return () => {
      unsubscribeMappings();
      unsubscribeFocus();
    };
  }, [navigation]);

  const handleDeleteMapping = async (mappingId: string) => {
    try {
      await buttonMappingRepository.deleteMapping(mappingId);
      eventService.emitMappingsUpdated();
      await loadMappings();
    } catch (error) {
      console.error('Error deleting mapping:', error);
      Alert.alert('Error', 'Failed to delete mapping');
    }
  };

  const renderMappingItem = ({ item }: { item: ButtonMapping }) => (
    <View style={styles.mappingItem}>
      <View style={styles.mappingHeader}>
        <Icon name="bluetooth" size={24} color="#007AFF" />
        <Text style={styles.deviceName}>{item.buttonName}</Text>
      </View>
      <View style={styles.mappingDetails}>
        <Text style={styles.detailText}>Press Type: {item.pressType}</Text>
        <Text style={styles.detailText}>Action: {item.actionName}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            'Delete Mapping',
            'Are you sure you want to delete this mapping?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Delete', 
                onPress: () => handleDeleteMapping(item.id),
                style: 'destructive'
              },
            ]
          );
        }}
      >
        <Icon name="delete" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mappings}
        renderItem={renderMappingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMapping')}
      >
        <Icon name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add New Mapping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  mappingItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mappingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mappingDetails: {
    flex: 1,
    marginLeft: 32,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ButtonMappingsScreen; 