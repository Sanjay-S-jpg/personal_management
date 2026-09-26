import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth';

import {
  getStoredToken,
  request,
  setStoredToken,
  setStoredUser,
} from './apiClient';

export const authService = {

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    setStoredToken(response.token);

    setStoredUser({
      id: response.id,
      name: response.name,
      email: response.email,
    });

    return response;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    setStoredUser({
      id: response.id,
      name: response.name,
      email: response.email,
    });

    return response;
  },

  logout(): void {
    setStoredToken(null);
    setStoredUser(null);
  },

  isAuthenticated(): boolean {
    return !!getStoredToken();
  },
};