export interface Consultation {
  id: string;
  tenant_id: string;
  appointment_id: string;
  patient_id: string;
  dentist_id: string;
  diagnosis: string;
  treatment: string;
  created_at: string;
}

export interface CreateConsultationRequest {
  appointment_id: string;
  patient_id: string;
  diagnosis: string;
  treatment: string;
}
