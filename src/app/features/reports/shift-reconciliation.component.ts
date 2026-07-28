import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../core/services/venta';

@Component({
  selector: 'app-shift-reconciliation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-6 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div>
        <h1 class="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Arqueo de Caja (Shift Reconciliation)</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Revisión del balance de caja y ventas por turno.</p>
      </div>

      <div *ngIf="arqueo" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col hover:shadow-md transition-shadow">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Resumen de Caja</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Balance Inicial</span>
            <span class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ (arqueo.initialBalance || arqueo.balanceInicial || 0) | currency }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Ventas Totales</span>
            <span class="text-xl font-bold text-emerald-600">{{ (arqueo.totalSales || arqueo.totalVentas || 0) | currency }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Total en Efectivo</span>
            <span class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ (arqueo.totalCash || arqueo.totalEfectivo || 0) | currency }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tarjeta/Otros</span>
            <span class="text-xl font-bold text-indigo-600">{{ (arqueo.totalOther || arqueo.totalOtros || 0) | currency }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="!arqueo" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400">
        No hay datos de arqueo disponibles para la sucursal o fecha seleccionada.
      </div>
    </div>
  `
})
export class ShiftReconciliationComponent implements OnInit {
  arqueo: any = null;
  private ventaService = inject(VentaService);

  ngOnInit(): void {
    this.ventaService.getArqueo().subscribe({
      next: (res: any) => {
        this.arqueo = res?.data || res || null;
      },
      error: (err) => {
        console.error('Error al obtener arqueo de la API:', err);
        this.arqueo = null;
      }
    });
  }
}
