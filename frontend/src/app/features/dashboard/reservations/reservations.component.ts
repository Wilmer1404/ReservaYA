import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ReservationDTO } from '../../../core/models/dashboard.models';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 class="text-2xl font-bold mb-4">Gestión de Reservas</h2>
      <div class="bg-white rounded shadow p-4">
        <table class="w-full table-auto">
          <thead>
            <tr class="text-left">
              <th class="px-2 py-1">Usuario</th>
              <th class="px-2 py-1">Espacio</th>
              <th class="px-2 py-1">Inicio</th>
              <th class="px-2 py-1">Fin</th>
              <th class="px-2 py-1">Estado</th>
              <th class="px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of reservations" class="border-t">
              <td class="px-2 py-2">{{ r.userName }}</td>
              <td class="px-2 py-2">{{ r.spaceName }}</td>
              <td class="px-2 py-2">{{ r.start | date:'short' }}</td>
              <td class="px-2 py-2">{{ r.end ? (r.end | date:'short') : '-' }}</td>
              <td class="px-2 py-2">{{ r.status }}</td>
              <td class="px-2 py-2">
                <button *ngIf="r.status === 'PENDING'" class="mr-2 px-3 py-1 bg-green-600 text-white rounded" (click)="approve(r)">Aprobar</button>
                <button *ngIf="r.status === 'PENDING'" class="px-3 py-1 bg-red-600 text-white rounded" (click)="reject(r)">Rechazar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class ReservationsComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  reservations: ReservationDTO[] = [];

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.dashboardService.getReservations().subscribe((res: any[]) => {
      this.reservations = res;
    });
  }

  approve(r: ReservationDTO) {
    this.dashboardService.approveReservation(r.id).subscribe(() => this.load());
  }

  reject(r: ReservationDTO) {
    this.dashboardService.rejectReservation(r.id).subscribe(() => this.load());
  }
}
