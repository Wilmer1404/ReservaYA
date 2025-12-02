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

  // Returns events compatible with FullCalendar
  getEvents() {
    return this.http.get<any[]>(`${this.apiUrl}/events`);
  }

  // Reservations list for management table
  getReservations() {
    return this.http.get<any[]>(`${this.apiUrl}/reservations`);
  }

  approveReservation(id: string | number) {
    return this.http.post(`${this.apiUrl}/reservations/${id}/approve`, {});
  }

  rejectReservation(id: string | number) {
    return this.http.post(`${this.apiUrl}/reservations/${id}/reject`, {});
  }
}
