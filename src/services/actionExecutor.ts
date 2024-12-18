import { ActionConfig } from '../types/action';
import { buttonEventService } from './eventService';

class ActionExecutor {
  private actions: Map<string, ActionConfig> = new Map();

  initialize(actions: ActionConfig[]) {
    this.actions.clear();
    actions.forEach(action => {
      this.actions.set(action.id, action);
    });
    buttonEventService.onButtonPress(this.handleButtonPress.bind(this));
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

  private handleButtonPress(type: 'SINGLE' | 'DOUBLE') {
    const matchingActions = Array.from(this.actions.values())
      .filter(action => action.triggerType === type);

    matchingActions.forEach(action => {
      console.log(`Executing action: ${action.name} for ${type} press`);
      this.executeAction(action);
    });
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