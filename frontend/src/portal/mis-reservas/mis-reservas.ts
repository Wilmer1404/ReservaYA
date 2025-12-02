import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {
  reservas: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private reservationSvc: ReservationService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.reservationSvc.getMyReservations().subscribe({
      next: (res: any[]) => { this.reservas = res; this.loading = false; },
      error: err => { this.error = err?.error?.message || 'Error al cargar'; this.loading = false; }
    });
  }
}
