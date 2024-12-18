import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ActionConfig } from '../types/action';
import { actionRepository } from '../repositories/actionRepository';
import { eventService } from '../services/eventService';

const EditActionScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const action = route.params?.action;
  
  if (!action) {
    Alert.alert('Error', 'No action data found');
    navigation.goBack();
    return null;
  }

  const [name, setName] = useState(action.name);
  const [url, setUrl] = useState(action.url);
  const [method, setMethod] = useState<ActionConfig['method']>(action.method);
  const [payload, setPayload] = useState(action.payload || '');

  const handleSave = async () => {
    if (!name || !url) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const updatedAction: ActionConfig = {
        ...action,
        name,
        url,
        method,
        payload: method === 'POST' ? payload : undefined,
      };

      await actionRepository.updateAction(updatedAction);
      eventService.emitActionsUpdated();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update action');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Action name"
        />

        <Text style={styles.label}>URL</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://example.com/api"
        />

        <Text style={styles.label}>Method</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={method}
            onValueChange={(value: ActionConfig['method']) => setMethod(value)}
            style={styles.picker}
          >
            <Picker.Item label="GET" value="GET" />
            <Picker.Item label="POST" value="POST" />
            <Picker.Item label="PUT" value="PUT" />
            <Picker.Item label="DELETE" value="DELETE" />
          </Picker>
        </View>

        {method === 'POST' && (
          <>
            <Text style={styles.label}>Payload (JSON)</Text>
            <TextInput
              style={[styles.input, styles.payloadInput]}
              value={payload}
              onChangeText={setPayload}
              placeholder="{ }"
              multiline
              numberOfLines={4}
            />
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  payloadInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditActionScreen; 