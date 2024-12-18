import { BleManager } from 'react-native-ble-plx';

class BleService {
  private manager: BleManager | null = null;

  initialize() {
    if (!this.manager) {
      this.manager = new BleManager({
        restoreStateIdentifier: 'BleManagerId',
        restoreStateFunction: (restoredState) => {
          if (restoredState == null) {
            console.log('No restored state');
          } else {
            console.log('Restored state:', restoredState);
          }
        },
      });
    }
    return this.manager;
  }

  getManager() {
    if (!this.manager) {
      throw new Error('BleManager not initialized');
    }
    return this.manager;
  }
}

export const bleService = new BleService(); 