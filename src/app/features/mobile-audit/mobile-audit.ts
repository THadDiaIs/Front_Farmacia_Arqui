import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface AuditProduct {
  id: number;
  nombre: string;
  codigoBarras: string;
  expectedQty: number;
}

@Component({
  selector: 'app-mobile-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './mobile-audit.html',
  styleUrl: './mobile-audit.css'
})
export class MobileAudit {
  barcode: string = '';
  scannedProduct: AuditProduct | null = null;
  actualQty: number | null = null;

  inventory: AuditProduct[] = [
    { id: 1, nombre: 'Paracetamol 500mg', codigoBarras: '123456789012', expectedQty: 50 },
    { id: 2, nombre: 'Ibuprofeno 400mg', codigoBarras: '987654321098', expectedQty: 30 }
  ];

  constructor(private messageService: MessageService) {}

  onScan() {
    if (!this.barcode) return;
    
    const prod = this.inventory.find(p => p.codigoBarras === this.barcode);
    if (prod) {
      this.scannedProduct = prod;
      this.actualQty = null;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Producto no encontrado' });
      this.scannedProduct = null;
    }
  }

  saveAudit() {
    if (this.scannedProduct && this.actualQty !== null) {
      const diff = this.actualQty - this.scannedProduct.expectedQty;
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Guardado', 
        detail: `Inventario actualizado. Diferencia: ${diff}`
      });
      this.scannedProduct = null;
      this.barcode = '';
      this.actualQty = null;
    }
  }
}
