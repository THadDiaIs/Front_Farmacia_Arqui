import { Producto } from './producto.model';
import { Sucursal } from './sucursal.model';

export interface Inventario {
  id: number;
  sucursalId: number;
  productoId: number;
  lote: string;
  fechaVencimiento: string;
  cantidadDisponible: number;
  activo: boolean;
  createdAt: string;
  createdBy?: number;
  updatedAt: string;
  updatedBy?: number;
  producto?: Producto;
  sucursal?: Sucursal;
}

export interface CreateInventarioDto {
  sucursalId: number;
  productoId: number;
  lote: string;
  fechaVencimiento: string | Date;
  cantidadDisponible: number;
  activo?: boolean;
}

export interface UpdateInventarioDto {
  sucursalId?: number;
  productoId?: number;
  lote?: string;
  fechaVencimiento?: string | Date;
  cantidadDisponible?: number;
  activo?: boolean;
}
