import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private base = '/api/reservations';

  constructor(private http: HttpClient) {}

  getMyReservations(): Observable<any> {
    return this.http.get(`${this.base}/my-reservations`);
  }

  createReservation(payload: { spaceId: number; date: string; startTime?: string; endTime?: string }): Observable<any> {
    return this.http.post(`${this.base}`, payload);
  }

  // opcional: cancelar reserva
  cancelReservation(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
