// Tipos para la autenticación
export interface LoginRequest {
  clave_proyecto: string;
  user_proyecto: string;
}

export interface LoginResponse {
  token: string;
  user: UserData;
  [key: string]: any;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  [key: string]: any;
}

export interface LoginError {
  error: string;
  code: number;
  message: string;
}

export interface AuthState {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
