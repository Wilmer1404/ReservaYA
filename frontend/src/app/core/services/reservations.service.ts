import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private http = inject(HttpClient);
  // URL base de tu backend (Asegúrate que el puerto 8080 es correcto)
  private apiUrl = 'http://localhost:8080/api/v1/reservations';

  // Para el Admin: Ver todas
  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Para el Estudiante: Ver SOLO las suyas
  getMyReservations() {
    return this.http.get<any[]>(`${this.apiUrl}/my-reservations`);
  }

  // Crear reserva
  create(reservation: any) {
    return this.http.post(this.apiUrl, reservation);
  }

  // Cancelar reserva
  cancel(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
