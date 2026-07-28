import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Producto, CreateProductoDto, UpdateProductoDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/producto`;

  findAll(): Observable<{ data: Producto[] }> {
    return this.http.get<{ data: Producto[] }>(this.apiUrl);
  }

  findOne(id: number): Observable<{ data: Producto }> {
    return this.http.get<{ data: Producto }>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateProductoDto): Observable<{ data: Producto, message: string }> {
    return this.http.post<{ data: Producto, message: string }>(this.apiUrl, data);
  }

  update(id: number, data: UpdateProductoDto): Observable<{ data: Producto, message: string }> {
    return this.http.patch<{ data: Producto, message: string }>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
