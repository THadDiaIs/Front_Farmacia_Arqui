import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MetodoPago, CreateMetodoPagoDto, UpdateMetodoPagoDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MetodoPagoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/metodo-pago`;

  findAll(): Observable<{ data: MetodoPago[] }> {
    return this.http.get<{ data: MetodoPago[] }>(this.apiUrl);
  }

  findOne(id: number): Observable<{ data: MetodoPago }> {
    return this.http.get<{ data: MetodoPago }>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateMetodoPagoDto): Observable<{ data: MetodoPago, message: string }> {
    return this.http.post<{ data: MetodoPago, message: string }>(this.apiUrl, data);
  }

  update(id: number, data: UpdateMetodoPagoDto): Observable<{ data: MetodoPago, message: string }> {
    return this.http.put<{ data: MetodoPago, message: string }>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
