import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardSummaryDTO } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/dashboard';

  getSummary() {
    return this.http.get<DashboardSummaryDTO>(`${this.apiUrl}/summary`);
  }
}
