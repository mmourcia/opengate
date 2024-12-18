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
import { ActionConfig } from '../types/action';
import { actionRepository } from '../repositories/actionRepository';

const AddActionScreen = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<ActionConfig['config']['method']>('GET');

  const handleSave = async () => {
    if (!name || !url) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const newAction: ActionConfig = {
        id: Date.now().toString(),
        name,
        type: 'HTTP_REQUEST',
        config: {
          url,
          method,
          headers: {},
          authType: 'none'
        },
        triggerType: 'SINGLE'
      };

      await actionRepository.createAction(newAction);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving action:', error);
      Alert.alert('Error', 'Failed to save action');
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Action</Text>
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

export default AddActionScreen; 