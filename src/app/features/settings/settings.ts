import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, PasswordModule, ButtonModule, ToastModule, InputTextModule, InputSwitchModule, TagModule],
  templateUrl: './settings.html',
})
export class SettingsComponent implements OnInit {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  private router = inject(Router);

  userInitial = 'U';
  username = '';
  role = '';
  empleadoId = '';
  sucursalId = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  isDarkMode = false;

  get userPermissions(): string[] {
    return this.authService.getPermisos();
  }

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.username = user.username || 'Usuario';
      this.role = user.role || 'Rol Desconocido';
      this.empleadoId = user.empleado?.id || '1';
      this.sucursalId = user.empleado?.sucursalId || '1';
      this.userInitial = this.username.charAt(0).toUpperCase();
    }
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
    }
  }

  toggleTheme() {
    if (typeof window !== 'undefined') {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  isProfileFormValid() {
    return this.username.trim().length > 0;
  }

  updateProfile() {
    if (!this.isProfileFormValid()) return;
    this.notificationService.showSuccess('Éxito', 'Perfil actualizado correctamente');
  }

  isFormValid() {
    return this.currentPassword.length >= 6 && 
           this.newPassword.length >= 6 && 
           this.newPassword === this.confirmPassword;
  }

  changePassword() {
    if (!this.isFormValid()) return;

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Éxito', 'Contraseña actualizada correctamente');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
