import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/reservations';

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMyReservations() {
    return this.http.get<any[]>(`${this.apiUrl}/my-reservations`);
  }

  create(reservation: any) {
    return this.http.post(this.apiUrl, reservation);
  }

  cancel(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
