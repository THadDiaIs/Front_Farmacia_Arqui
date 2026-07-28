import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  role = this.authService.getRole()?.toLowerCase();
  
  get isPosAllowed() {
    return ['vendedor', 'cajero', 'admin', 'administrador', 'gerente', 'admin_tienda'].includes(this.role || '');
  }

  get isAdmin() {
    return ['admin', 'administrador', 'gerente', 'admin_tienda'].includes(this.role || '');
  }

  get userEmail() {
    const payload = this.authService.getUserPayload();
    return payload?.email || 'user@example.com';
  }

  get userName() {
    const payload = this.authService.getUserPayload();
    return payload?.name || payload?.nombre || 'User';
  }
}
