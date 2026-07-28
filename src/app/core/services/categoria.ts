import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Categoria, CreateCategoriaDto, UpdateCategoriaDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categoria`;

  findAll(): Observable<{ data: Categoria[] }> {
    return this.http.get<{ data: Categoria[] }>(this.apiUrl);
  }

  findOne(id: number): Observable<{ data: Categoria }> {
    return this.http.get<{ data: Categoria }>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateCategoriaDto): Observable<{ data: Categoria, message: string }> {
    return this.http.post<{ data: Categoria, message: string }>(this.apiUrl, data);
  }

  update(id: number, data: UpdateCategoriaDto): Observable<{ data: Categoria, message: string }> {
    return this.http.patch<{ data: Categoria, message: string }>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
