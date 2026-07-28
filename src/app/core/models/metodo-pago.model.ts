export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface CreateMetodoPagoDto {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface UpdateMetodoPagoDto {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}
