export interface Cliente {
  id: number;
  nitDocumento?: string;
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  activo: boolean;
  createdAt: string;
  createdBy?: number;
  updatedAt: string;
  updatedBy?: number;
}

export interface CreateClienteDto {
  nitDocumento?: string;
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
}

export interface UpdateClienteDto {
  nitDocumento?: string;
  nombreCompleto?: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
}
