import { Profile } from './profile.model';
import { Clinic } from './clinic.model';

export interface ShiftPerDay {
  week_day: string;
  start_time: string;
  end_time: string;
}

export interface ProfileClinic {
  id: string;
  tenant_id: string;
  profile_id: string;
  clinic_id: string;
  slot_duration_minutes: number;
  working_days: ShiftPerDay[];
  created_at: string;
  updated_at: string;
}

export interface ProfileBlock {
  id: string;
  tenant_id: string;
  profile_id: string;
  clinic_id: string;
  blocked_date: string;
  start_time: string;
  end_time: string;
  reason: string;
  canceled_at: string;
  created_at: string;
}

export interface CollaboratorClinic {
  clinic: Clinic;
  profile_clinic: ProfileClinic;
}

export interface Collaborator {
  profile: Profile;
  collaborator_clinics: CollaboratorClinic[];
  profile_blocks: ProfileBlock[];
}

export interface CreateProfileClinicRequest {
  clinic_id: string;
  slot_duration_minutes?: number;
  working_days?: ShiftPerDay[];
}

export interface CreateCollaboratorRequest {
  full_name: string;
  role: string;
  phone?: string;
  has_whatsapp?: boolean;
  document?: string;
  birth_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profile_clinics?: CreateProfileClinicRequest[];
}

export interface UpdateProfileRequest {
  full_name?: string;
  role?: string;
  phone?: string;
  has_whatsapp?: boolean;
  document?: string;
  birth_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}
