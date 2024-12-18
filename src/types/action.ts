export interface ActionConfig {
  id: string;
  name: string;
  type: 'HTTP_REQUEST';
  config: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: Record<string, string>;
    authType: 'none' | 'basic' | 'bearer';
    body?: any;
  };
  triggerType: 'SINGLE' | 'DOUBLE';
  lastExecution?: {
    success: boolean;
    timestamp: string;
  };
} 