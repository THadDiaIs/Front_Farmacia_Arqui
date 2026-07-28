import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Cliente, CreateClienteDto, UpdateClienteDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cliente`;

  findAll(): Observable<{ data: Cliente[] }> {
    return this.http.get<{ data: Cliente[] }>(this.apiUrl);
  }

  findOne(id: number): Observable<{ data: Cliente }> {
    return this.http.get<{ data: Cliente }>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateClienteDto): Observable<{ data: Cliente, message: string }> {
    return this.http.post<{ data: Cliente, message: string }>(this.apiUrl, data);
  }

  update(id: number, data: UpdateClienteDto): Observable<{ data: Cliente, message: string }> {
    return this.http.patch<{ data: Cliente, message: string }>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
