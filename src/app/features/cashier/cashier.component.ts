import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { NotificationService } from '../../core/services/notification.service';
import { VentaService } from '../../core/services/venta';
import { MetodoPagoService } from '../../core/services/metodo-pago';
import { AuthService } from '../../core/services/auth';

export interface PendingOrder {
  id: number;
  orderCode: string;
  vendedorCode: string;
  vendedorNombre: string;
  fecha: Date;
  total: number;
  descuento: number;
  estado: string;
  items: Array<{
    codigo: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
}

@Component({
  selector: 'app-cashier',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, TableModule, ToastModule, DropdownModule],
  templateUrl: './cashier.component.html'
})
export class CashierComponent implements OnInit {
  private ventaService = inject(VentaService);
  private metodoPagoService = inject(MetodoPagoService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  pendingSales: PendingOrder[] = [];
  selectedSale: PendingOrder | null = null;

  // Cashier Metrics
  completedOrdersCount: number = 0;
  totalCollectedToday: number = 0;

  paymentMethods: Array<{ label: string; value: number }> = [];
  selectedPaymentMethod: number = 0;

  get pendingOrdersCount(): number {
    return this.pendingSales.length;
  }

  get averageTicket(): number {
    return this.completedOrdersCount > 0 ? (this.totalCollectedToday / this.completedOrdersCount) : 0;
  }

  formatPrice(val: any): string {
    return Number(val || 0).toFixed(2);
  }

  ngOnInit() {
    this.loadPaymentMethods();
    this.loadPendingSales();
  }

  loadPaymentMethods() {
    this.metodoPagoService.findAll().subscribe({
      next: (res) => {
        const mappedMethods = (res && res.data && res.data.length > 0) ? res.data.map(m => ({
          label: m.nombre,
          value: m.id
        })) : [];

        Promise.resolve().then(() => {
          this.paymentMethods = mappedMethods;
          if (this.paymentMethods.length > 0) {
            this.selectedPaymentMethod = this.paymentMethods[0].value;
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error al obtener métodos de pago:', err);
      }
    });
  }

  loadPendingSales() {
    this.ventaService.getPendingSales().subscribe({
      next: (res) => {
        const mappedSales = (res && res.data && res.data.length > 0) ? res.data.map((sale: any) => {
          const itemsMapped = (sale.detalleVentas || sale.items || []).map((item: any) => {
            const cant = Number(item.cantidad) || 1;
            const pu = Number(item.precioUnitario || item.producto?.precioVenta || 0);
            const sub = Number(item.subtotal) || (cant * pu);
            return {
              codigo: item.codigo || item.producto?.codigoBarras || `PRD-${item.productoId || item.id}`,
              nombre: item.nombre || item.producto?.nombre || 'Producto',
              cantidad: cant,
              precioUnitario: pu,
              subtotal: sub
            };
          });

          const totalVal = Number(sale.total) || itemsMapped.reduce((s: number, i: any) => s + i.subtotal, 0);

          return {
            id: sale.id,
            orderCode: sale.codigo || `ORD-${sale.id}`,
            vendedorCode: sale.vendedorCode || `VEND-${sale.createdBy || 1}`,
            vendedorNombre: sale.vendedorNombre || sale.createdBy || 'Vendedor',
            fecha: new Date(sale.createdAt || Date.now()),
            total: totalVal,
            descuento: Number(sale.descuento) || 0,
            estado: sale.estado || 'PENDIENTE',
            items: itemsMapped
          };
        }) : [];

        Promise.resolve().then(() => {
          this.pendingSales = mappedSales;
          this.selectedSale = this.pendingSales.length > 0 ? this.pendingSales[0] : null;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error al obtener órdenes pendientes de la API:', err);
        Promise.resolve().then(() => {
          this.pendingSales = [];
          this.selectedSale = null;
          this.cdr.detectChanges();
        });
      }
    });
  }

  getProductsSummary(sale: PendingOrder): string {
    return sale.items.map(i => `${i.nombre} (x${i.cantidad})`).join(', ');
  }

  selectSale(sale: PendingOrder) {
    this.selectedSale = sale;
    if (this.paymentMethods.length > 0) {
      this.selectedPaymentMethod = this.paymentMethods[0].value;
    }
    this.cdr.detectChanges();
  }

  cobrar() {
    if (!this.selectedSale) return;
    
    const targetSale = this.selectedSale;
    const paidAmount = Number(targetSale.total) || 0;
    const paidCode = targetSale.orderCode;
    const user = this.authService.getUser();
    const cajeroId = user?.id || 1;

    this.ventaService.finalizeSale(targetSale.id, this.selectedPaymentMethod, cajeroId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cobro Exitoso', `La orden ${paidCode} ha sido cobrada correctamente`);
        Promise.resolve().then(() => {
          this.completedOrdersCount += 1;
          this.totalCollectedToday += paidAmount;
          this.pendingSales = this.pendingSales.filter(s => s.id !== targetSale.id);
          this.selectedSale = this.pendingSales.length > 0 ? this.pendingSales[0] : null;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
