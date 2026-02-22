import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly EMAIL_KEY = 'auth_email';
  private readonly ROL_KEY = 'auth_rol';           // ← agrega

  set(token: string, email?: string, rol?: string): void {   // ← agrega rol
    localStorage.setItem(this.TOKEN_KEY, token);
    if (email) localStorage.setItem(this.EMAIL_KEY, email);
    if (rol) localStorage.setItem(this.ROL_KEY, rol);        // ← agrega
  }

  get(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  getRol(): string | null {                                   // ← agrega
    return localStorage.getItem(this.ROL_KEY);
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.ROL_KEY);                   // ← agrega
  }

  isLoggedIn(): boolean {
    return !!this.get();
  }
}
