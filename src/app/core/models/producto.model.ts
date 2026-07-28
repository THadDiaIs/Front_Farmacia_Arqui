import { Categoria } from './categoria.model';

export interface Producto {
  id: number;
  codigoBarras?: string;
  nombre: string;
  principioActivo?: string;
  presentacion?: string;
  categoriaId: number;
  proveedorId: number;
  precioVenta: number;
  requiereReceta: boolean;
  activo: boolean;
  createdAt: string;
  createdBy?: number;
  updatedAt: string;
  updatedBy?: number;
  categoria?: Categoria;
}

export interface CreateProductoDto {
  codigoBarras?: string;
  nombre: string;
  principioActivo?: string;
  presentacion?: string;
  categoriaId: number;
  proveedorId: number;
  precioVenta: number;
  requiereReceta?: boolean;
  activo?: boolean;
}

export interface UpdateProductoDto {
  codigoBarras?: string;
  nombre?: string;
  principioActivo?: string;
  presentacion?: string;
  categoriaId?: number;
  proveedorId?: number;
  precioVenta?: number;
  requiereReceta?: boolean;
  activo?: boolean;
}
