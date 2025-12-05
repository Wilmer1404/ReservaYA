import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  private currentUserSignal = signal<AuthResponse | null>(this.getUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.userRole);

  constructor() {}

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.saveToStorage(response);
        this.currentUserSignal.set(response);
        this.redirectBasedOnRole(response.userRole);
      })
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('auth_session');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private saveToStorage(data: AuthResponse) {
    localStorage.setItem('auth_session', JSON.stringify(data));
  }

  private getUserFromStorage(): AuthResponse | null {
    const stored = localStorage.getItem('auth_session');
    return stored ? JSON.parse(stored) : null;
  }

  private redirectBasedOnRole(role: string) {
    if (role === 'ADMIN') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/portal']);
    }
  }
}
