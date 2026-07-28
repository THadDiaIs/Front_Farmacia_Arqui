export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  rolId?: number;
  empleadoId?: number;
  nombre?: string;
  apellidos?: string;
  cargo?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  empleado?: any;
}

export interface LoginResponseData {
  token: string;
  user: User;
  permisos: string[];
}

export interface LoginResponse {
  message: string;
  data: LoginResponseData;
}
