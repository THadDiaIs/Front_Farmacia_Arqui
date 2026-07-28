import { Sucursal } from './sucursal.model';
import { Cliente } from './cliente.model';

export type EstadoVenta = 'PENDIENTE' | 'COBRADA' | 'ANULADA';

export interface Venta {
  id: number;
  sucursalId: number;
  clienteId?: number | null;
  metodoPagoId?: number | null;
  cajeroId?: number | null;
  estado: EstadoVenta;
  total: number;
  activo: boolean;
  createdAt: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
  sucursal?: Sucursal;
  cliente?: Cliente;
  detalleVentas?: DetalleVenta[];
}

export interface DetalleVenta {
  id: number;
  ventaId: number;
  inventarioId: number;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  inventario?: any;
}

export interface CreateVentaItemDto {
  productoId?: number;
  inventarioId?: number;
  cantidad: number;
  precioUnitario?: number;
  descuento?: number;
}

export interface CreateVentaDto {
  sucursalId: number;
  clienteId?: number;
  metodoPagoId?: number;
  items: CreateVentaItemDto[];
}

export interface CobrarVentaDto {
  metodoPagoId: number;
  cajeroId?: number;
}
