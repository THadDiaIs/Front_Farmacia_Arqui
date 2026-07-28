import { Component, signal, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './core/services/auth';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { MenuItem } from 'primeng/api';

import { Modulo } from './core/models/permissions.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MenuModule, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('farmacia-front');
  authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  menuItems: MenuItem[] = [];
  adminMenuItems: MenuItem[] = [];
  userInitial = 'U';
  isDarkMode = false;
  currentTime = new Date();
  private timeInterval: any;

  get hasVentasPermission(): boolean {
    return this.authService.hasPermission(Modulo.VENTAS);
  }

  get hasDashboardPermission(): boolean {
    return this.authService.hasPermission(Modulo.DASHBOARD);
  }

  get hasCajaPermission(): boolean {
    return this.authService.hasPermission(Modulo.CAJA);
  }

  get hasAdministracionPermission(): boolean {
    return this.authService.hasPermission(Modulo.ADMINISTRACION);
  }

  get hasGerenciaPermission(): boolean {
    return this.authService.hasPermission(Modulo.GERENCIA);
  }

  get isLoginPage() {
    return this.router.url === '/login';
  }

  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
        document.documentElement.classList.add('dark');
      }
      this.timeInterval = setInterval(() => {
        this.currentTime = new Date();
      }, 1000);
    }

    const payload = this.authService.getUserPayload();
    if (payload && payload.username) {
      this.userInitial = payload.username.charAt(0).toUpperCase();
    }

    this.updateMenuItems();
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      this.updateMenuItems();
    }
  }

  updateMenuItems() {
    this.menuItems = [
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    ];

    // Admin menu items
    const adminItems: MenuItem[] = [
      {
        label: 'Productos',
        icon: 'pi pi-box',
        command: () => this.router.navigate(['/admin/products'])
      },
      {
        label: 'Inventario',
        icon: 'pi pi-server',
        command: () => this.router.navigate(['/admin/inventory'])
      },
      {
        label: 'Clientes',
        icon: 'pi pi-users',
        command: () => this.router.navigate(['/admin/customers'])
      }
    ];

    if (this.hasAdministracionPermission) {
      adminItems.push({
        label: 'Sucursales',
        icon: 'pi pi-building',
        command: () => this.router.navigate(['/admin/branches'])
      });
      adminItems.push({
        label: 'Categorías',
        icon: 'pi pi-tags',
        command: () => this.router.navigate(['/admin/categories'])
      });
    }

    this.adminMenuItems = adminItems;
  }
}
