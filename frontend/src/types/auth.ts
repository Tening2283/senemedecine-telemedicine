export enum UserRole {
  ADMIN = 'ADMIN',
  MEDECIN = 'MEDECIN',
  SECRETAIRE = 'SECRETAIRE',
  PATIENT = 'PATIENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  speciality?: string;
  licenseNumber?: string;
  bio?: string;
  avatar?: string;
  lastLoginAt?: string;
  isActive: boolean;
  emailVerified: boolean;
  hospitalId?: string;
  hospital?: Hospital;
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  databaseName: string;
  status: HospitalStatus;
  isActive: boolean;
  logo?: string;
  settings?: Record<string, any>;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  director?: string;
  bedCount: number;
  departments?: string[];
  services?: string[];
  licenseNumber?: string;
  establishedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum HospitalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export interface LoginRequest {
  email: string;
  password: string;
  hospitalId?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

