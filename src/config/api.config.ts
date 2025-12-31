export const API_CONFIG = {
  baseURL: import.meta.env.VITE_IOBROKER_API_URL || 'http://localhost:8087',
  apiType: import.meta.env.VITE_IOBROKER_API_TYPE || 'simpleapi',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  pollingInterval: parseInt(import.meta.env.VITE_POLLING_INTERVAL || '5000'),
};

export const ENDPOINTS = {
  getState: (stateId: string) => `/get/${encodeURIComponent(stateId)}`,
  setState: (stateId: string) => `/set/${encodeURIComponent(stateId)}`,
  getBulk: (stateIds: string[]) => `/getBulk/${stateIds.map(id => encodeURIComponent(id)).join(',')}`,
};
