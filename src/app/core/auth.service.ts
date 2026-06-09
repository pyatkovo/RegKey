import { Injectable, signal } from '@angular/core';
import { AUTH_CONFIG } from './auth-config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(this.readSession());

  login(username: string, password: string): boolean {
    const isValid =
      username.trim() === AUTH_CONFIG.username &&
      password === AUTH_CONFIG.password;

    if (!isValid) {
      this.isAuthenticated.set(false);
      localStorage.removeItem(AUTH_CONFIG.sessionStorageKey);
      return false;
    }

    localStorage.setItem(AUTH_CONFIG.sessionStorageKey, 'true');
    this.isAuthenticated.set(true);
    return true;
  }

  logout(): void {
    localStorage.removeItem(AUTH_CONFIG.sessionStorageKey);
    this.isAuthenticated.set(false);
  }

  private readSession(): boolean {
    return localStorage.getItem(AUTH_CONFIG.sessionStorageKey) === 'true';
  }
}
