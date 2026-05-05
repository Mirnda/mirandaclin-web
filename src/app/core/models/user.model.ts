import { Address } from './address.model';

export type UserRole = 'admin' | 'dentist' | 'secretary' | 'patient';

export interface User {
  id: string;
  full_name: string;
  email: string;
  email_verified_at: string;
  phone: string;
  has_whatsapp: boolean;
  document: string;
  birth_date: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  address: Address;
  created_at: string;
  updated_at: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tenant_id: string;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenant_id?: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  has_whatsapp?: boolean;
  document?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  tenant_name?: string;
}

export interface CreateUserRequest {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  has_whatsapp?: boolean;
  document?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface AcceptInviteRequest {
  token: string;
}
