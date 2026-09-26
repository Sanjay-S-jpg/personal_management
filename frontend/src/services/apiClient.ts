/**
 * Centralized API Client
 * Configured with configurable base URL (VITE_API_BASE_URL),
 * automatic JWT bearer authorization headers, and error normalization.
 */

const TOKEN_KEY = 'pm_auth_token';
const USER_KEY = 'pm_auth_user';
const BASE_URL_STORAGE_KEY = 'pm_api_base_url';

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string | null): void => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error('Failed to set auth token in storage', e);
  }
};

export const getStoredUser = (): {
  id: number;
  name: string;
  email: string;
} | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (
  user: {
    id: number;
    name: string;
    email: string;
  } | null
): void => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Failed to set user in storage', e);
  }
};

export const getApiBaseUrl = (): string => {
  try {
    const custom = localStorage.getItem(BASE_URL_STORAGE_KEY);
    if (custom && custom.trim().length > 0) {
      return custom.trim().replace(/\/+$/, '');
    }
  } catch {
    // ignore
  }

  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Default fallback when not configured
  return 'http://localhost:8080';
};

export const setApiBaseUrl = (url: string): void => {
  try {
    if (url && url.trim().length > 0) {
      localStorage.setItem(BASE_URL_STORAGE_KEY, url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem(BASE_URL_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save API base URL', e);
  }
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status = 500, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const token = getStoredToken();

  let url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // Unauthorized: clear token
      // window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    if (!res.ok) {
      let errorMsg = `HTTP Error ${res.status}: ${res.statusText}`;
      let errorData = null;
      try {
        errorData = await res.json();
        if (errorData?.message) {
          errorMsg = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMsg = errorData;
        }
      } catch {
        // Not JSON
      }
      throw new ApiError(errorMsg, res.status, errorData);
    }

    // Handle 204 No Content
    if (res.status === 204) {
      return {} as T;
    }

    const data = await res.json();
    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network failure (e.g. backend server not running)
    throw new ApiError(
      err?.message || 'Network request failed. Is the Spring Boot backend running?',
      0,
      { isNetworkError: true }
    );
  }
}
