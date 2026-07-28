export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  createdBy?: number;
  updatedAt: string;
  updatedBy?: number;
}

export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface UpdateCategoriaDto {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}
