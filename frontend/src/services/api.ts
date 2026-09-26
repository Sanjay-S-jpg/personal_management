/**
 * Centralized API Layer
 * Exports unified API services, client helpers, and types
 */

export * from './apiClient';
export * from './authService';
export * from './expenseService';
export * from './mockData';
export * from './mockBackend';

import { authService } from './authService';
import { expenseService } from './expenseService';
import { getApiBaseUrl, setApiBaseUrl } from './apiClient';

export const api = {
  auth: authService,
  expenses: expenseService,
  config: {
    getBaseUrl: getApiBaseUrl,
    setBaseUrl: setApiBaseUrl,
  },
};

export default api;
