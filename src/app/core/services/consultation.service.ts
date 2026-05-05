import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Consultation, CreateConsultationRequest } from '../models/consultation.model';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/v1/api/consultations`;

  create(data: CreateConsultationRequest): Observable<ApiResponse<Consultation>> {
    return this.http.post<ApiResponse<Consultation>>(this.base, data);
  }

  listByPatient(patientId: string): Observable<ApiResponse<Consultation[]>> {
    return this.http.get<ApiResponse<Consultation[]>>(`${this.base}/patient/${patientId}`);
  }

  listByDentist(dentistId: string): Observable<ApiResponse<Consultation[]>> {
    return this.http.get<ApiResponse<Consultation[]>>(`${this.base}/dentist/${dentistId}`);
  }
}
