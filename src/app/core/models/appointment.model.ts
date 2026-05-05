export interface Appointment {
  id: string;
  tenant_id: string;
  clinic_id: string;
  patient_id: string;
  dentist_id: string;
  secretary_id: string;
  scheduled_at: string;
  status: string;
  notes: string;
  canceled_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentRequest {
  clinic_id: string;
  patient_id: string;
  dentist_id: string;
  scheduled_at: string;
  secretary_id?: string;
  notes?: string;
}
