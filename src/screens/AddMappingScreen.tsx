import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ButtonMapping } from '../types/buttonMapping';
import { buttonMappingRepository } from '../repositories/buttonMappingRepository';
import { actionRepository } from '../repositories/actionRepository';
import { deviceRepository } from '../repositories/deviceRepository';
import { ActionConfig } from '../types/action';
import { StoredDevice } from '../types/device';
import { eventService } from '../services/eventService';

const AddMappingScreen = ({ navigation }: { navigation: any }) => {
  const [devices, setDevices] = useState<StoredDevice[]>([]);
  const [actions, setActions] = useState<ActionConfig[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [pressType, setPressType] = useState<'SINGLE' | 'DOUBLE'>('SINGLE');

  useEffect(() => {
    loadDevicesAndActions();
  }, []);

  const loadDevicesAndActions = async () => {
    const storedDevices = await deviceRepository.getStoredDevices();
    const storedActions = await actionRepository.getAllActions();
    setDevices(storedDevices);
    setActions(storedActions);
  };

  const handleSave = async () => {
    if (!selectedDevice || !selectedAction) {
      Alert.alert('Error', 'Please select both a device and an action');
      return;
    }

    const device = devices.find(d => d.id === selectedDevice);
    const action = actions.find(a => a.id === selectedAction);

    if (!device || !action) {
      Alert.alert('Error', 'Invalid device or action selection');
      return;
    }

    try {
      const newMapping: ButtonMapping = {
        id: Date.now().toString(),
        buttonId: device.id,
        buttonName: device.name,
        characteristicUuid: "87654321-4321-4321-4321-210987654321",
        pressType,
        actionId: action.id,
        actionName: action.name
      };

      await buttonMappingRepository.createMapping(newMapping);
      eventService.emitMappingsUpdated();
      navigation.goBack();
    } catch (error) {
      console.error('Error saving mapping:', error);
      Alert.alert('Error', 'Failed to save mapping');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Select Device</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDevice}
            onValueChange={setSelectedDevice}
          >
            <Picker.Item label="Select a device..." value="" />
            {devices.map(device => (
              <Picker.Item 
                key={device.id} 
                label={device.name} 
                value={device.id} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Select Action</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedAction}
            onValueChange={setSelectedAction}
          >
            <Picker.Item label="Select an action..." value="" />
            {actions.map(action => (
              <Picker.Item 
                key={action.id} 
                label={action.name} 
                value={action.id} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Press Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pressType}
            onValueChange={(value) => setPressType(value)}
          >
            <Picker.Item label="Single Press" value="SINGLE" />
            <Picker.Item label="Double Press" value="DOUBLE" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Mapping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddMappingScreen; 