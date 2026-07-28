import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardSummary, Transaction } from './dashboard.service';
import { InventarioService } from '../../core/services/inventario';
import { AuthService } from '../../core/services/auth';
import { Modulo } from '../../core/models/permissions.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
  summary: DashboardSummary | null = null;
  recentTransactions: Transaction[] = [];
  lowStockAlerts: any[] = [];
  expirationAlerts: any[] = [];

  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  role = 'Desconocido';
  isManager = false;

  constructor(
    private dashboardService: DashboardService,
    private inventarioService: InventarioService
  ) { }

  ngOnInit(): void {
    const r = this.authService.getRole()?.toUpperCase() || '';
    this.role = r;
    this.isManager = this.authService.hasPermission(Modulo.GERENCIA) || this.authService.hasPermission(Modulo.ADMINISTRACION);

    this.dashboardService.getSummary().subscribe(data => {
      Promise.resolve().then(() => {
        this.summary = data;
        this.cdr.detectChanges();
      });
    });

    this.dashboardService.getRecentTransactions(5).subscribe(data => {
      Promise.resolve().then(() => {
        this.recentTransactions = data || [];
        this.cdr.detectChanges();
      });
    });

    if (this.isManager) {
      this.inventarioService.getLowStockAlerts().subscribe({
        next: (res: any) => {
          Promise.resolve().then(() => {
            this.lowStockAlerts = res?.data || res || [];
            this.cdr.detectChanges();
          });
        },
        error: (err) => console.error('Error fetching low stock alerts', err)
      });

      this.inventarioService.getExpirationAlerts().subscribe({
        next: (res: any) => {
          Promise.resolve().then(() => {
            this.expirationAlerts = res?.data || res || [];
            this.cdr.detectChanges();
          });
        },
        error: (err) => console.error('Error fetching expiration alerts', err)
      });
    }
  }
}
