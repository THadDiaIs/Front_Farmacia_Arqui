import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { VentaService } from '../../core/services/venta';
import { AuthService } from '../../core/services/auth';
import { CreateVentaDto } from '../../core/models';
import { ProductoService } from '../../core/services/producto';
import { NotificationService } from '../../core/services/notification.service';

interface Product {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  principioActivo?: string;
  requiereReceta?: boolean;
}

interface CartItem extends Product {
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    CardModule,
    ToastModule,
    DialogModule
  ],
  templateUrl: './pos.html',
  styleUrl: './pos.css',
})
export class Pos implements OnInit {
  private ventaService = inject(VentaService);
  private productoService = inject(ProductoService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  searchQuery = '';
  inputQty: number = 1;
  orderCode: string = 'VTA-' + Math.floor(1000 + Math.random() * 9000);
  
  products: Product[] = [];

  ngOnInit() {
    this.loadCatalogFromApi();
  }

  loadCatalogFromApi() {
    this.productoService.findAll().subscribe({
      next: (res) => {
        const mappedProducts = (res && res.data) ? res.data.map(p => ({
          id: p.id,
          codigo: p.codigoBarras || `PRD-${String(p.id).padStart(3, '0')}`,
          nombre: p.nombre,
          precio: Number(p.precioVenta || (p as any).precio || 0),
          principioActivo: p.principioActivo,
          requiereReceta: p.requiereReceta
        })) : [];

        Promise.resolve().then(() => {
          this.products = mappedProducts;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error al cargar catálogo de la API:', err);
        Promise.resolve().then(() => {
          this.products = [];
          this.cdr.detectChanges();
        });
      }
    });
  }

  formatPrice(val: any): string {
    return Number(val || 0).toFixed(2);
  }

  cart: CartItem[] = [];

  showRecetaWarning = false;
  pendingProduct: Product | null = null;
  pendingQtyToAdd: number = 1;
  
  showReceipt = false;
  lastSaleData: any = null;

  // Edit item modal properties
  showEditModal = false;
  editingItem: CartItem | null = null;
  editQty: number = 1;
  editPrecio: number = 0;

  get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  }

  get descuentoTotal(): number {
    return 0.00;
  }

  get total(): number {
    return this.subtotal - this.descuentoTotal;
  }

  onSearch() {
    if (!this.searchQuery) return;
    const sq = this.searchQuery.toLowerCase();
    const prod = this.products.find(p => 
      p.nombre.toLowerCase().includes(sq) || 
      p.codigo.toLowerCase().includes(sq) || 
      (p.principioActivo && p.principioActivo.toLowerCase().includes(sq))
    );
    if (prod) {
      this.handleProductClick(prod, this.inputQty || 1);
      this.searchQuery = '';
      this.inputQty = 1;
    } else {
      this.notificationService.showWarn('No encontrado', 'Producto no encontrado');
    }
  }

  handleProductClick(product: Product, quantity: number = 1) {
    if (product.requiereReceta) {
      this.pendingProduct = product;
      this.pendingQtyToAdd = quantity;
      this.showRecetaWarning = true;
    } else {
      this.addToCart(product, quantity);
    }
  }

  confirmReceta() {
    if (this.pendingProduct) {
      this.addToCart(this.pendingProduct, this.pendingQtyToAdd);
    }
    this.showRecetaWarning = false;
    this.pendingProduct = null;
    this.pendingQtyToAdd = 1;
  }

  addToCart(product: Product, quantity: number = 1) {
    const existing = this.cart.find(i => i.id === product.id);
    const qtyToAdd = quantity > 0 ? quantity : 1;
    const priceNum = Number(product.precio || 0);
    if (existing) {
      existing.cantidad += qtyToAdd;
      existing.subtotal = existing.cantidad * existing.precio;
    } else {
      this.cart.push({ ...product, precio: priceNum, cantidad: qtyToAdd, subtotal: priceNum * qtyToAdd });
    }
    this.cdr.detectChanges();
  }

  increaseQty(item: CartItem) {
    item.cantidad += 1;
    item.subtotal = item.cantidad * item.precio;
    this.cdr.detectChanges();
  }

  decreaseQty(item: CartItem) {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      item.subtotal = item.cantidad * item.precio;
    } else {
      this.removeFromCart(item);
    }
    this.cdr.detectChanges();
  }

  openEditModal(item: CartItem) {
    this.editingItem = item;
    this.editQty = item.cantidad;
    this.editPrecio = Number(item.precio || 0);
    this.showEditModal = true;
  }

  saveEditModal() {
    if (this.editingItem) {
      this.editingItem.cantidad = this.editQty > 0 ? this.editQty : 1;
      this.editingItem.precio = this.editPrecio >= 0 ? Number(this.editPrecio) : this.editingItem.precio;
      this.editingItem.subtotal = this.editingItem.cantidad * this.editingItem.precio;
    }
    this.showEditModal = false;
    this.editingItem = null;
    this.cdr.detectChanges();
  }

  removeFromCart(item: CartItem) {
    this.cart = this.cart.filter(i => i.id !== item.id);
    this.cdr.detectChanges();
  }

  processSale() {
    if (this.cart.length === 0) return;
    
    const user = this.authService ? this.authService.getUser() : null;
    const sucursalId = user?.empleado?.sucursalId || 1;

    const saleData: CreateVentaDto = {
      sucursalId: sucursalId,
      metodoPagoId: 1, // Default, sent to cashier
      items: this.cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        descuento: 0
      }))
    };

    this.ventaService.processSale(saleData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Éxito', `Orden ${this.orderCode} enviada a caja`);
        Promise.resolve().then(() => {
          this.cart = [];
          this.orderCode = 'VTA-' + Math.floor(1000 + Math.random() * 9000);
          this.cdr.detectChanges();
        });
      }
    });
  }

  closeReceipt() {
    this.showReceipt = false;
    this.lastSaleData = null;
  }

  printReceipt() {
    const printContent = document.getElementById('receipt-content');
    if (printContent) {
      const windowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      if (windowPrt) {
        windowPrt.document.write('<html><head><title>Imprimir Ticket</title>');
        windowPrt.document.write('<style>body { font-family: monospace; padding: 20px; }</style>');
        windowPrt.document.write('</head><body>');
        windowPrt.document.write(printContent.innerHTML);
        windowPrt.document.write('</body></html>');
        windowPrt.document.close();
        windowPrt.focus();
        windowPrt.print();
        windowPrt.close();
      }
    }
  }
}
