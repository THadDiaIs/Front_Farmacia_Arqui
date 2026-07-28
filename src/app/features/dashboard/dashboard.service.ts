import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardSummary {
  totalSales: number;
  totalIncome: number;
  totalTransactions: number;
  [key: string]: any;
}

export interface MonthlyBehavior {
  month: string;
  sales: number;
  costs: number;
  profit: number;
}

export interface Transaction {
  id: number;
  customerName: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/metrics`;

  getSummary(sucursalId?: number): Observable<any> {
    let params = new HttpParams();
    if (sucursalId) {
      params = params.set('sucursalId', sucursalId.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/summary`, { params });
  }

  getMonthlyBehavior(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/monthly-behavior`);
  }

  getRecentTransactions(limit: number = 10): Observable<any> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<any>(`${this.apiUrl}/recent-transactions`, { params });
  }

  getArqueo(sucursalId?: number, fecha?: string): Observable<any> {
    let params = new HttpParams();
    if (sucursalId) params = params.set('sucursalId', sucursalId.toString());
    if (fecha) params = params.set('fecha', fecha);
    return this.http.get<any>(`${this.apiUrl}/arqueo`, { params });
  }
}
