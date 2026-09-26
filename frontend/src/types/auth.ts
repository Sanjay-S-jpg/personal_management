export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}