import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Clinic, CreateClinicRequest, UpdateClinicRequest } from '../models/clinic.model';

@Injectable({ providedIn: 'root' })
export class ClinicService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/v1/api/clinics`;

  list(): Observable<ApiResponse<Clinic[]>> {
    return this.http.get<ApiResponse<Clinic[]>>(this.base);
  }

  getById(id: string): Observable<ApiResponse<Clinic>> {
    return this.http.get<ApiResponse<Clinic>>(`${this.base}/${id}`);
  }

  create(data: CreateClinicRequest): Observable<ApiResponse<Clinic>> {
    return this.http.post<ApiResponse<Clinic>>(this.base, data);
  }

  update(id: string, data: UpdateClinicRequest): Observable<ApiResponse<Clinic>> {
    return this.http.put<ApiResponse<Clinic>>(`${this.base}/${id}`, data);
  }

  remove(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.base}/${id}`);
  }
}
