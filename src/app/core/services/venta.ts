import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateVentaDto, CobrarVentaDto, Venta } from '../models';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/venta`;

  getVentas(): Observable<{ data: Venta[] }> {
    return this.http.get<{ data: Venta[] }>(this.apiUrl);
  }

  getPendingSales(): Observable<{ data: Venta[] }> {
    return this.http.get<{ data: Venta[] }>(`${this.apiUrl}/pendientes`);
  }

  getVenta(id: number): Observable<{ data: Venta }> {
    return this.http.get<{ data: Venta }>(`${this.apiUrl}/${id}`);
  }

  processSale(saleData: CreateVentaDto): Observable<{ data: Venta, message: string }> {
    return this.http.post<{ data: Venta, message: string }>(this.apiUrl, saleData);
  }

  finalizeSale(id: number, metodoPagoId: number, cajeroId?: number): Observable<{ data: Venta, message: string }> {
    const payload: CobrarVentaDto = { metodoPagoId, cajeroId };
    return this.http.post<{ data: Venta, message: string }>(`${this.apiUrl}/${id}/cobrar`, payload);
  }

  anularVenta(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getArqueo(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/metrics/arqueo`);
  }
}
