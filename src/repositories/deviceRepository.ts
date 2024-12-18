import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredDevice } from '../types/device';

const STORAGE_KEY = '@stored_devices';

export const deviceRepository = {
  async getStoredDevices(): Promise<StoredDevice[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading stored devices:', error);
      return [];
    }
  },

  async storeDevice(device: StoredDevice): Promise<void> {
    try {
      const devices = await this.getStoredDevices();
      const updatedDevices = [...devices.filter(d => d.id !== device.id), device];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDevices));
    } catch (error) {
      console.error('Error storing device:', error);
    }
  },

  async removeDevice(deviceId: string): Promise<void> {
    try {
      const devices = await this.getStoredDevices();
      const updatedDevices = devices.filter(d => d.id !== deviceId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDevices));
    } catch (error) {
      console.error('Error removing device:', error);
    }
  }
}; 