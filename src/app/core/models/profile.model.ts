import { Address } from './address.model';

export interface Profile {
  id: string;
  tenant_id: string;
  user_id: string;
  role: string;
  full_name: string;
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

export interface CreatePatientRequest {
  full_name: string;
  phone?: string;
  has_whatsapp?: boolean;
  document?: string;
  birth_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface UpdatePatientRequest {
  full_name: string;
  phone?: string;
  has_whatsapp?: boolean;
  document?: string;
  birth_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}
