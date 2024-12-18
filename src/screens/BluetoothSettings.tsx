import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Switch, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { StoredDevice } from '../types/device';
import { deviceRepository } from '../repositories/deviceRepository';

const manager = new BleManager();

interface ButtonPayload {
  CHARACTERISTIC_UUID: string;
  MAC_ADDRESS: string;
  TYPE: 'SINGLE' | 'DOUBLE';
  TIMESTAMP: string;
}

const BUTTON_SERVICE_UUID = "12345678-1234-1234-1234-123456789012"; // Replace with your device's service UUID
const BUTTON_CHARACTERISTIC_UUID = "87654321-4321-4321-4321-210987654321";

const BluetoothSettings = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [storedDevices, setStoredDevices] = useState<StoredDevice[]>([]);

  useEffect(() => {
    loadStoredDevices();
  }, []);

  useEffect(() => {
    const initBluetooth = async () => {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        console.log('Bluetooth permissions not granted');
        return;
      }

      const bluetoothState = await manager.state();
      console.log('Current Bluetooth state:', bluetoothState);
      setIsEnabled(bluetoothState === 'PoweredOn');

      if (bluetoothState === 'PoweredOn') {
        const storedDevices = await deviceRepository.getStoredDevices();
        for (const storedDevice of storedDevices) {
          if (storedDevice.autoConnect) {
            try {
              console.log('Attempting to connect to stored device:', storedDevice.id);
              await connectWithRetry(storedDevice.id);
            } catch (error) {
              console.error('Auto-connect failed for device:', storedDevice.id, error);
            }
          }
        }
      }

      // Subscribe to state changes
      const subscription = manager.onStateChange((state) => {
        console.log('Bluetooth state changed:', state);
        setIsEnabled(state === 'PoweredOn');
      }, true);

      return () => subscription.remove();
    };

    initBluetooth();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ];

      try {
        const results = await Promise.all(
          permissions.map(permission =>
            PermissionsAndroid.request(permission, {
              title: 'Bluetooth Permissions',
              message: 'Application needs access to your bluetooth and location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            })
          )
        );

        return results.every(result => result === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startScan = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Error', 'Bluetooth scanning requires location permission');
      return;
    }

    const state = await manager.state();
    console.log('Pre-scan Bluetooth state check:', state);
    
    if (state !== 'PoweredOn') {
      Alert.alert('Bluetooth Error', 'Bluetooth is not enabled');
      return;
    }

    setIsScanning(true);
    setDevices([]);
    console.log('Starting BLE scan...');

    try {
      const discoveredDevices = new Set<string>();

      manager.startDeviceScan(null, {
        allowDuplicates: true,
        scanMode: 2,
        callbackType: 1,
        matchMode: 1,
        matchNum: 0,
        phy: 1,
      }, async (error, device) => {
        if (error) {
          console.error('Scanning error:', error);
          setIsScanning(false);
          Alert.alert('Error', 'Failed to scan for devices');
          return;
        }

        if (device && !discoveredDevices.has(device.id)) {
          discoveredDevices.add(device.id);
          
          // Try to get the device name in different ways
          let deviceName = device.name;
          
          if (!deviceName) {
            try {
              deviceName = device.localName || 'Unknown';
            } catch (nameError) {
              console.log('Could not read name for device:', device.id);
            }
          }

          console.log('New device discovered:', {
            name: deviceName || 'Unknown',
            id: device.id,
            rssi: device.rssi,
            localName: device.localName,
          });

          setDevices(prevDevices => {
            const deviceExists = prevDevices.some(d => d.id === device.id);
            if (!deviceExists) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });
        }
      });
    } catch (error) {
      console.error('Error starting scan:', error);
      Alert.alert('Error', 'Failed to start Bluetooth scan');
      setIsScanning(false);
    }

    setTimeout(() => {
      console.log('Stopping BLE scan. Total unique devices found:', devices.length);
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 15000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log('Attempting to connect to device:', device.id);
      setIsScanning(false);
      manager.stopDeviceScan();

      const connectedDevice = await device.connect();
      console.log('Connected to device:', device.id);

      const discoveredDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Discovered services and characteristics');

      // Subscribe to notifications
      await discoveredDevice.monitorCharacteristicForService(
        BUTTON_SERVICE_UUID,
        BUTTON_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Notification error:', error);
            return;
          }

          if (characteristic?.value) {
            try {
              // Decode base64 value to string
              const decoded = Buffer.from(characteristic.value, 'base64').toString('utf8');
              const payload: ButtonPayload = JSON.parse(decoded);
              
              console.log('Button Press Detected:', {
                type: payload.TYPE,
                timestamp: payload.TIMESTAMP,
                macAddress: payload.MAC_ADDRESS
              });
            } catch (e) {
              console.error('Error parsing notification:', e);
            }
          }
        }
      );

      Alert.alert(
        'Connection Successful',
        `Connected to device: ${device.name || 'Unknown Device'}`
      );

    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to device. Please try again.'
      );
    }
  };

  const handleDeviceConnection = async (device: Device) => {
    try {
      await connectToDevice(device);
      // Store device after successful connection
      await deviceRepository.storeDevice({
        id: device.id,
        name: device.name || device.localName || 'Unknown Device',
        autoConnect: true
      });
      await loadStoredDevices();
    } catch (error) {
      console.error('Connection handling error:', error);
    }
  };

  const loadStoredDevices = async () => {
    const devices = await deviceRepository.getStoredDevices();
    setStoredDevices(devices);
  };

  const renderDevice = (device: Device) => {
    const isStored = storedDevices.some(d => d.id === device.id);
    
    return (
      <TouchableOpacity 
        key={device.id} 
        style={[styles.deviceItem, isStored && styles.storedDevice]}
        onPress={() => handleDeviceConnection(device)}
      >
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>
            {device.name || 'Unknown Device'}
            {isStored && ' (Paired)'}
          </Text>
          <Text style={styles.deviceId}>ID: {device.id}</Text>
          <Text style={styles.deviceRssi}>Signal: {device.rssi} dBm</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const MAX_RECONNECT_ATTEMPTS = 3;
  const RECONNECT_DELAY = 2000;

  const connectWithRetry = async (deviceId: string, attempts = 0) => {
    try {
      console.log(`Connection attempt ${attempts + 1} for device:`, deviceId);
      const device = await manager.connectToDevice(deviceId, {
        timeout: 10000,
        requestMTU: 517,
      });
      
      await device.discoverAllServicesAndCharacteristics();
      console.log('Successfully connected to device:', deviceId);
      
      // Setup disconnect listener
      device.onDisconnected((error, disconnectedDevice) => {
        console.log('Device disconnected:', disconnectedDevice.id);
        if (attempts < MAX_RECONNECT_ATTEMPTS) {
          console.log(`Scheduling reconnection attempt ${attempts + 1} of ${MAX_RECONNECT_ATTEMPTS}`);
          setTimeout(() => {
            connectWithRetry(disconnectedDevice.id, attempts + 1);
          }, RECONNECT_DELAY);
        } else {
          console.log('Max reconnection attempts reached for device:', deviceId);
          Alert.alert(
            'Connection Lost',
            'Unable to maintain connection with device. Please try manually reconnecting.'
          );
        }
      });

      return device;
    } catch (error) {
      console.error(`Connection attempt ${attempts + 1} failed:`, error);
      if (attempts < MAX_RECONNECT_ATTEMPTS) {
        console.log(`Retrying connection... (${attempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
        await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY));
        return connectWithRetry(deviceId, attempts + 1);
      }
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.scanButton} 
        onPress={startScan}
        disabled={isScanning}
      >
        {isScanning ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.scanButtonText}>Scan for Devices</Text>
        )}
      </TouchableOpacity>

      <ScrollView style={styles.deviceList}>
        {devices.map(renderDevice)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceList: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deviceId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deviceRssi: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deviceInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  storedDevice: {
    backgroundColor: '#e0e0e0',
  },
});

export default BluetoothSettings; 