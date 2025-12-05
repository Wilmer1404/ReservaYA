import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../../core/services/reservations.service';
import { ReservationDTO } from '../../../core/models/dashboard.models';
import { DashboardService } from '../../../core/services/dashboard.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-900">Gestión de Reservas</h2>
        <button (click)="load()" class="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Recargar lista">
          <lucide-icon name="refresh-cw" class="w-5 h-5" [class.animate-spin]="loading()"></lucide-icon>
        </button>
      </div>

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

            <ng-container *ngIf="loading(); else dataTable">
              <tr *ngFor="let i of [1,2,3]" class="animate-pulse">
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-24"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-32"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-20"></div></td>
                <td class="px-6 py-4"><div class="h-4 bg-slate-100 rounded w-20"></div></td>
                <td class="px-6 py-4"><div class="h-6 bg-slate-100 rounded w-16"></div></td>
                <td class="px-6 py-4 text-right"><div class="h-6 bg-slate-100 rounded w-16 ml-auto"></div></td>
              </tr>
            </ng-container>

            <ng-template #dataTable>
              <tr *ngFor="let r of reservations()" class="hover:bg-slate-50 transition-colors">
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
              <tr *ngIf="reservations().length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                  No hay reservas registradas en el sistema.
                </td>
              </tr>
            </ng-template>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ReservationsComponent implements OnInit {
  private reservationsService = inject(ReservationsService);
  private dashboardService = inject(DashboardService);

  reservations = signal<ReservationDTO[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.reservationsService.getAll().subscribe({
      next: (res: any[]) => {
        const mapped = res.map(item => ({
          id: item.id,
          userName: item.user?.name || 'Usuario Desconocido',
          spaceName: item.space?.name || 'Espacio no encontrado',
          start: item.startTime,
          end: item.endTime,
          status: item.status
        }));

        mapped.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

        this.reservations.set(mapped);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
        this.loading.set(false);
      }
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
