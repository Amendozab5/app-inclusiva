import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { TokenService } from './token.service';

export interface AuthResponse {
  token: string;
  type: string; // Bearer
  expiresInMinutes: number;
  email: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiBaseUrl}/api/auth`;

  constructor(private http: HttpClient, private token: TokenService) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/login`, { email, password })
      .pipe(tap(res => this.token.set(res.token, res.email)));
  }

  register(nombre: string, email: string, password: string, rol?: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/register`, { nombre, email, password, rol })
      .pipe(tap(res => this.token.set(res.token, res.email)));
  }

  logout(): void {
    this.token.clear();
  }
}