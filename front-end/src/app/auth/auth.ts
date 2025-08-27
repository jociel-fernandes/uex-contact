import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type User = { id: number; name: string; email: string } | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private xsrfReady = false;

  constructor(private http: HttpClient) {}

  private ensureCsrf(): Observable<any> {
    if (this.xsrfReady) return of(true);
    return this.http.get(`${environment.base_backend}/sanctum/csrf-cookie`, { withCredentials: true }).pipe(
      tap(() => this.xsrfReady = true)
    );
  }

  login(data: {email: string, password: string}) {
    return this.ensureCsrf().pipe(
      switchMap(() => this.http.post(`${environment.base_backend}/auth/login`, data, { withCredentials: true }))
    );
  }

  register(data: {name:string, email:string, password:string, password_confirmation:string}) {
    return this.ensureCsrf().pipe(
      switchMap(() => this.http.post(`${environment.base_backend}/auth/register`, data, { withCredentials: true }))
    );
  }

  logout() {
    return this.ensureCsrf().pipe(
      switchMap(() => this.http.post(`${environment.base_backend}/auth/logout`, {}, { withCredentials: true }))
    );
  }

  forgotPassword(data: {email:string}) {
    return this.ensureCsrf().pipe(
      switchMap(() => this.http.post(`${environment.base_backend}/auth/forgot-password`, data, { withCredentials: true }))
    );
  }

  resetPassword(data: {email:string, password:string, password_confirmation:string, token:string}) {
    return this.ensureCsrf().pipe(
      switchMap(() => this.http.post(`${environment.base_backend}/auth/reset-password`, data, { withCredentials: true }))
    );
  }

  verifyEmail(id: string, hash: string, query: Record<string, string | null> = {}) {
    let params = new HttpParams();
    Object.entries(query).forEach(([k, v]) => { if(v != null) params = params.set(k,v); });
    return this.http.get(`${environment.base_backend}/auth/verify-email/${id}/${hash}`, { params, withCredentials:true });
  }

  resendVerification() {
    return this.ensureCsrf().pipe(
      switchMap(() => this.http.post(`${environment.base_backend}/auth/email/verification-notification`, {}, { withCredentials: true }))
    );
  }

  checkUser(): Observable<User> {
    return this.http.get<User>(`${environment.base_backend}/api/user`, { withCredentials: true });
  }
}
