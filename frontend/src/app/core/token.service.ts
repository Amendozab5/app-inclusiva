import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly EMAIL_KEY = 'auth_email';

  set(token: string, email?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (email) localStorage.setItem(this.EMAIL_KEY, email);
  }

  get(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.get();
  }
}