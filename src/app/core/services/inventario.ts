import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Inventario, CreateInventarioDto, UpdateInventarioDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventario`;

  findAll(sucursalId?: number): Observable<{ data: Inventario[] }> {
    let params = new HttpParams();
    if (sucursalId) {
      params = params.set('sucursalId', sucursalId.toString());
    }
    return this.http.get<{ data: Inventario[] }>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<{ data: Inventario }> {
    return this.http.get<{ data: Inventario }>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateInventarioDto): Observable<{ data: Inventario, message: string }> {
    return this.http.post<{ data: Inventario, message: string }>(this.apiUrl, data);
  }

  update(id: number, data: UpdateInventarioDto): Observable<{ data: Inventario, message: string }> {
    return this.http.put<{ data: Inventario, message: string }>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getExpirationAlerts(dias: number = 30): Observable<{ data: Inventario[] }> {
    const params = new HttpParams().set('dias', dias.toString());
    return this.http.get<{ data: Inventario[] }>(`${this.apiUrl}/alertas/expiracion`, { params });
  }

  getLowStockAlerts(umbral: number = 10): Observable<{ data: any[] }> {
    const params = new HttpParams().set('umbral', umbral.toString());
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/alertas/quiebre`, { params });
  }
}
