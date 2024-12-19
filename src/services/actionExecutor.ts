import { buttonMappingRepository } from '../repositories/buttonMappingRepository';
import { actionRepository } from '../repositories/actionRepository';
import { ActionConfig } from '../types/action';
import { ButtonMapping } from '../types/buttonMapping';
import { buttonEventService } from './buttonEventService';
import { eventService } from './eventService';

class ActionExecutor {
  private actions: Map<string, ActionConfig> = new Map();
  private buttonMappings: Map<string, ButtonMapping[]> = new Map();
  private cleanupFn: (() => void) | null = null;

  constructor() {
    // Subscribe to mapping updates
    buttonEventService.onMappingsUpdated(this.handleMappingsUpdate.bind(this));
  }

  private async handleMappingsUpdate() {
    try {
      const mappings = await buttonMappingRepository.getMappings();
      this.buttonMappings.clear();
      mappings.forEach(mapping => {
        const key = `${mapping.buttonId}_${mapping.characteristicUuid}`;
        if (!this.buttonMappings.has(key)) {
          this.buttonMappings.set(key, []);
        }
        this.buttonMappings.get(key)?.push(mapping);
      });
      console.log('Button mappings updated:', this.buttonMappings.size);
    } catch (error) {
      console.error('Error updating button mappings:', error);
    }
  }

  async initialize() {
    try {
      // Clean up any existing listeners
      if (this.cleanupFn) {
        this.cleanupFn();
      }

      // Load actions and set up listener
      const actions = await actionRepository.getAllActions();
      this.actions.clear();
      actions.forEach(action => {
        this.actions.set(action.id, action);
      });

      // Subscribe to action updates
      eventService.onActionsUpdated(async () => {
        const updatedActions = await actionRepository.getAllActions();
        this.actions.clear();
        updatedActions.forEach(action => {
          this.actions.set(action.id, action);
        });
        console.log('Actions updated:', this.actions.size);
      });

      // Load button mappings
      await this.handleMappingsUpdate();

      // Setup button press listener with cleanup
      this.cleanupFn = buttonEventService.onButtonPress(this.handleButtonPress.bind(this));
      
      console.log('Action executor initialized with:', {
        actions: this.actions.size,
        mappings: this.buttonMappings.size,
        hasListener: !!this.cleanupFn
      });
    } catch (error) {
      console.error('Error initializing action executor:', error);
      throw error;
    }
  }

  private async handleButtonPress(type: 'SINGLE' | 'DOUBLE', deviceId: string, characteristicUuid: string) {
    console.log('Button press received:', { type, deviceId, characteristicUuid });
    
    // Try both device ID and MAC address formats
    const mappingKeys = [
      `${deviceId}_${characteristicUuid}`,
      deviceId // Try just the device ID as it might be the MAC address
    ];
    
    let deviceMappings: ButtonMapping[] = [];
    for (const key of mappingKeys) {
      const mappings = this.buttonMappings.get(key) || [];
      deviceMappings = [...deviceMappings, ...mappings];
    }
    
    console.log('Found mappings:', deviceMappings);
    
    const matchingMappings = deviceMappings.filter(
      mapping => mapping.pressType === type
    );

    console.log('Matching mappings:', matchingMappings);

    // Execute actions sequentially
    for (const mapping of matchingMappings) {
      const action = this.actions.get(mapping.actionId);
      if (action) {
        console.log(`Executing action: ${action.name} for ${type} press from device: ${mapping.buttonName}`);
        try {
          await this.executeAction(action);
          console.log(`Action completed: ${action.name}`);
        } catch (error) {
          console.error(`Failed to execute action ${action.name}:`, error);
        }
      } else {
        console.log('Action not found:', mapping.actionId);
        console.log('Available actions:', Array.from(this.actions.keys()));
      }
    }
  }

  async executeAction(action: ActionConfig) {
    try {
      switch (action.type) {
        case 'HTTP_REQUEST':
          await this.executeHttpRequest(action.config);
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error('Error executing action:', error);
      throw error;
    }
  }

  private async executeHttpRequest(config: any) {
    try {
      const response = await fetch(config.url, {
        method: config.method || 'GET',
        headers: {
          ...config.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: config.body ? JSON.stringify(config.body) : undefined
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('HTTP request executed successfully');
    } catch (error) {
      console.error('HTTP request failed:', error);
      throw error;
    }
  }
}

export const actionExecutor = new ActionExecutor(); 