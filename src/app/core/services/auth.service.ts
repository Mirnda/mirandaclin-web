import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, RegisterRequest, JwtPayload } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly base = environment.apiUrl;

  private _token = signal<string | null>(localStorage.getItem('token'));

  isAuthenticated = computed(() => !!this._token());

  jwtPayload = computed<JwtPayload | null>(() => {
    const token = this._token();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1])) as JwtPayload;
    } catch {
      return null;
    }
  });

  getToken(): string | null {
    return this._token();
  }

  login(credentials: LoginRequest): Observable<ApiResponse<Record<string, string>>> {
    return this.http
      .post<ApiResponse<Record<string, string>>>(`${this.base}/v1/api/auth/login`, credentials)
      .pipe(
        switchMap(res => {
          if (!res.success) {
            return throwError(() => new Error(res.message ?? 'Erro ao realizar login.'));
          }
          const token = res.data?.['token'];
          if (token) {
            localStorage.setItem('token', token);
            this._token.set(token);
          }
          return [res];
        }),
        catchError((err: HttpErrorResponse) => {
          const message = err.error?.message ?? err.message ?? 'Erro ao realizar login.';

          return throwError(() => new Error(message));
        })
      );
  }

  register(data: RegisterRequest): Observable<ApiResponse<Record<string, string>>> {
    return this.http.post<ApiResponse<Record<string, string>>>(
      `${this.base}/v1/api/auth/register`,
      data
    );
  }

  verifyEmail(token: string): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${this.base}/v1/api/auth/verify-email`, {
      params: { token },
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this._token.set(null);
    this.router.navigate(['/login']);
  }
}
