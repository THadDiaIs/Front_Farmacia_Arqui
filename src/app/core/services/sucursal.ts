import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Sucursal, CreateSucursalDto, UpdateSucursalDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sucursal`;

  findAll(): Observable<{ data: Sucursal[] }> {
    return this.http.get<{ data: Sucursal[] }>(this.apiUrl);
  }

  findOne(id: number): Observable<{ data: Sucursal }> {
    return this.http.get<{ data: Sucursal }>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateSucursalDto): Observable<{ data: Sucursal, message: string }> {
    return this.http.post<{ data: Sucursal, message: string }>(this.apiUrl, data);
  }

  update(id: number, data: UpdateSucursalDto): Observable<{ data: Sucursal, message: string }> {
    return this.http.patch<{ data: Sucursal, message: string }>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
