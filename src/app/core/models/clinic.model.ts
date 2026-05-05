import { Address } from './address.model';

export interface Clinic {
  id: string;
  tenant_id: string;
  name: string;
  phone: string;
  address: Address;
  open_time: string;
  close_time: string;
  operating_days: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateClinicRequest {
  name: string;
  phone?: string;
  address?: Partial<Address>;
  open_time?: string;
  close_time?: string;
  operating_days?: string[];
}

export type UpdateClinicRequest = Partial<CreateClinicRequest>;

export const WEEKDAYS = [
  { value: 'monday', label: 'Segunda' },
  { value: 'tuesday', label: 'Terça' },
  { value: 'wednesday', label: 'Quarta' },
  { value: 'thursday', label: 'Quinta' },
  { value: 'friday', label: 'Sexta' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
];
