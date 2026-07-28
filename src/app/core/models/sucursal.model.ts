export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  activo: boolean;
  createdAt: string;
  createdBy?: number;
  updatedAt: string;
  updatedBy?: number;
}

export interface CreateSucursalDto {
  nombre: string;
  direccion: string;
  telefono?: string;
  activo?: boolean;
}

export interface UpdateSucursalDto {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  activo?: boolean;
}
