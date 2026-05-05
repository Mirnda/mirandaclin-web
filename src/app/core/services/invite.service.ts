import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Invite, CreateInviteRequest } from '../models/invite.model';
import { AcceptInviteRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class InviteService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/v1/api/invites`;

  create(data: CreateInviteRequest): Observable<ApiResponse<Invite>> {
    return this.http.post<ApiResponse<Invite>>(this.base, data);
  }

  accept(data: AcceptInviteRequest): Observable<ApiResponse<Record<string, string>>> {
    return this.http.post<ApiResponse<Record<string, string>>>(`${this.base}/accept`, data);
  }
}
