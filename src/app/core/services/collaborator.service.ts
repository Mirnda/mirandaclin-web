import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Collaborator, CreateCollaboratorRequest, UpdateProfileRequest } from '../models/collaborator.model';
import { Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/v1/api/collaborators`;
  private readonly profileBase = `${environment.apiUrl}/v1/api/profiles`;

  list(): Observable<ApiResponse<Collaborator[]>> {
    return this.http.get<ApiResponse<Collaborator[]>>(this.base);
  }

  create(data: CreateCollaboratorRequest): Observable<ApiResponse<Collaborator>> {
    return this.http.post<ApiResponse<Collaborator>>(this.base, data);
  }

  getProfile(id: string): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(`${this.profileBase}/${id}`);
  }

  updateProfile(id: string, data: UpdateProfileRequest): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(`${this.profileBase}/${id}`, data);
  }

  deleteProfile(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.profileBase}/${id}`);
  }
}
