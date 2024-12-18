export interface ActionConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  payload?: string;
  authType: 'none' | 'basic' | 'bearer';
  authToken?: string;
  lastExecution?: {
    timestamp: number;
    success: boolean;
    error?: string;
  };
} 