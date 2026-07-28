export enum Modulo {
  DASHBOARD = 'DASHBOARD',
  VENTAS = 'VENTAS',
  CAJA = 'CAJA',
  ADMINISTRACION = 'ADMINISTRACION',
  GERENCIA = 'GERENCIA'
}

export interface UserPermission {
  modulo: Modulo;
  nombre: string;
}
