import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Profile, CreatePatientRequest, UpdatePatientRequest } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/v1/api/profiles`;
  private readonly baseList = `${environment.apiUrl}/v1/api/profiles/role/patient`;

  create(data: CreatePatientRequest): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(this.base, data);
  }

  list(): Observable<ApiResponse<Profile[]>> {
    return this.http.get<ApiResponse<Profile[]>>(this.baseList);
  }

  listDentists(): Observable<ApiResponse<Profile[]>> {
    return this.http.get<ApiResponse<Profile[]>>(`${environment.apiUrl}/v1/api/profiles/role/dentist`);
  }

  getById(id: string): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(`${this.base}/${id}`);
  }

  update(id: string, data: UpdatePatientRequest): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.base}/${id}`);
  }

}
