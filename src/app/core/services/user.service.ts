import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { UserWithProfile, CreateUserRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/v1/api/users`;

  create(data: CreateUserRequest): Observable<ApiResponse<UserWithProfile>> {
    return this.http.post<ApiResponse<UserWithProfile>>(this.base, data);
  }

  getAll(): Observable<ApiResponse<UserWithProfile[]>> {
    return this.http.get<ApiResponse<UserWithProfile[]>>(this.base);
  }

  getById(id: string): Observable<ApiResponse<UserWithProfile>> {
    return this.http.get<ApiResponse<UserWithProfile>>(`${this.base}/${id}`);
  }

  update(id: string, data: Partial<CreateUserRequest>): Observable<ApiResponse<UserWithProfile>> {
    return this.http.put<ApiResponse<UserWithProfile>>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.base}/${id}`);
  }
}
