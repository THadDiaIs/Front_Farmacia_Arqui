import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginDto, ChangePasswordDto, LoginResponse, User } from '../models';
import { Modulo } from '../models/permissions.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res && res.data) {
          const { token, user, permisos } = res.data;
          if (typeof window !== 'undefined') {
            if (token) localStorage.setItem('token', token);
            if (user) localStorage.setItem('user', JSON.stringify(user));
            if (permisos) localStorage.setItem('permisos', JSON.stringify(permisos));
          }
        }
      })
    );
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permisos');
    }
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return null;
        }
      }
    }
    return this.getUserPayload();
  }

  getPermisos(): string[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('permisos');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return [];
        }
      }
    }
    // Fallback extract from token payload if present
    const payload = this.getUserPayload();
    return payload?.permisos || [];
  }

  hasPermission(modulo: string | Modulo): boolean {
    const permisos = this.getPermisos();
    if (!permisos || permisos.length === 0) return false;
    const searchMod = String(modulo).toUpperCase();
    return permisos.map(p => p.toUpperCase()).includes(searchMod);
  }

  getInitialRouteForUser(): string {
    if (this.hasPermission(Modulo.VENTAS)) return '/pos';
    if (this.hasPermission(Modulo.DASHBOARD)) return '/overview';
    if (this.hasPermission(Modulo.CAJA)) return '/cashier';
    if (this.hasPermission(Modulo.ADMINISTRACION)) return '/admin/products';
    if (this.hasPermission(Modulo.GERENCIA)) return '/analytics';
    return '/settings';
  }

  getRole(): string | null {
    const user = this.getUser();
    if (user && user.role) return user.role;
    const payload = this.getUserPayload();
    return payload ? (payload.role || payload.roles?.[0] || null) : null;
  }

  getUserPayload(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadString = token.split('.')[1];
      return JSON.parse(atob(payloadString));
    } catch (e) {
      return null;
    }
  }

  changePassword(data: ChangePasswordDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, data);
  }
}
