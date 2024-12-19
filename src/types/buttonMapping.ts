export interface ButtonMapping {
  id: string;
  buttonId: string;  // The BLE device ID
  buttonName: string;
  characteristicUuid: string;
  pressType: 'SINGLE' | 'DOUBLE';
  actionId: string;
  actionName: string;
} 