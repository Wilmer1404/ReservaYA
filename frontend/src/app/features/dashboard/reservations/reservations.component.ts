import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../../core/services/reservations.service';
import { ReservationDTO } from '../../../core/models/dashboard.models';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-slate-900">Gestión de Reservas</h2>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th class="px-6 py-4">Usuario</th>
              <th class="px-6 py-4">Espacio</th>
              <th class="px-6 py-4">Inicio</th>
              <th class="px-6 py-4">Fin</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let r of reservations" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900">
                {{ r.userName }}
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ r.spaceName }}
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ r.start | date:'short' }}
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ r.end ? (r.end | date:'short') : '-' }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  [ngClass]="{
                    'bg-emerald-100 text-emerald-800': r.status === 'CONFIRMED',
                    'bg-amber-100 text-amber-800': r.status === 'PENDING',
                    'bg-red-100 text-red-800': r.status === 'CANCELLED'
                  }">
                  {{ r.status === 'CONFIRMED' ? 'Confirmada' : (r.status === 'CANCELLED' ? 'Cancelada' : 'Pendiente') }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button *ngIf="r.status === 'PENDING'"
                  class="text-emerald-600 hover:text-emerald-800 font-medium text-xs px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                  (click)="approve(r)">
                  Aprobar
                </button>
                <button *ngIf="r.status === 'PENDING' || r.status === 'CONFIRMED'"
                  class="text-red-600 hover:text-red-800 font-medium text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  (click)="cancel(r)">
                  Cancelar
                </button>
                <span *ngIf="r.status === 'CANCELLED'" class="text-slate-400 text-xs italic">Cancelada</span>
              </td>
            </tr>
            <tr *ngIf="reservations.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                No hay reservas registradas en el sistema.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ReservationsComponent implements OnInit {
  private reservationsService = inject(ReservationsService);
  private dashboardService = inject(DashboardService);

  reservations: ReservationDTO[] = [];

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.reservationsService.getAll().subscribe({
      next: (res: any[]) => {
        // CORRECCIÓN CRÍTICA: Mapeo de objetos anidados (space.name) a planos (spaceName)
        this.reservations = res.map(item => ({
          id: item.id,
          // Usamos el operador ?. (safe navigation) por si acaso viene null
          userName: item.user?.name || 'Usuario Desconocido',
          spaceName: item.space?.name || 'Espacio no encontrado',
          start: item.startTime,
          end: item.endTime,
          status: item.status
        }));

        // Ordenar por fecha (más reciente primero)
        this.reservations.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
      },
      error: (err) => console.error('Error cargando reservas:', err)
    });
  }

  approve(r: ReservationDTO) {
    this.dashboardService.approveReservation(r.id).subscribe(() => this.load());
  }

  cancel(r: ReservationDTO) {
    if(confirm('¿Estás seguro de cancelar esta reserva?')) {
      this.reservationsService.cancel(Number(r.id)).subscribe(() => this.load());
    }
  }
}
