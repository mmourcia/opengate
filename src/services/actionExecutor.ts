import { ActionConfig } from '../types/action';
import { actionRepository } from '../repositories/actionRepository';

export class ActionExecutor {
  async executeAction(action: ActionConfig): Promise<void> {
    try {
      const headers: Record<string, string> = {
        ...action.headers,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      };

      if (action.authType === 'bearer' && action.authToken) {
        headers['Authorization'] = `Bearer ${action.authToken}`;
      } else if (action.authType === 'basic' && action.authToken) {
        headers['Authorization'] = `Basic ${action.authToken}`;
      }

      console.log(`Executing ${action.method} request to ${action.url}`);
      
      const response = await fetch(action.url, {
        method: action.method,
        headers,
        body: action.method !== 'GET' ? action.payload : undefined,
        credentials: 'same-origin'
      });

      const responseData = await response.text();
      console.log('Response:', responseData);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseData}`);
      }

      await actionRepository.updateAction({
        ...action,
        lastExecution: {
          timestamp: Date.now(),
          success: true,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await actionRepository.updateAction({
        ...action,
        lastExecution: {
          timestamp: Date.now(),
          success: false,
          error: errorMessage,
        },
      });
      throw error;
    }
  }
}

export const actionExecutor = new ActionExecutor(); 