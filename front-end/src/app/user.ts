import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';;
import { Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class User {

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${environment.base_backend}/api/user`, { withCredentials: true });
  }

  updateUser(data: FormData): Observable<any> {
    return this.http.patch(`${environment.base_backend}/api/user`, data, { withCredentials: true });
  }

  deleteUser(password: string): Observable<any> {
    return this.http.request('DELETE', `${environment.base_backend}/api/user`, { 
      body: { password }, 
      withCredentials: true 
    });
  }
}
