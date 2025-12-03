import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../../core/services/reservations.service';
import { LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Mis Reservas</h1>
          <p class="text-slate-600 text-sm mt-1">Historial y estado de tus solicitudes recientes.</p>
        </div>
      </div>

      <!-- Loading State (Skeletons) -->
      <div *ngIf="loading()" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3]" class="h-48 bg-white rounded-xl border border-slate-100 p-6 shadow-sm animate-pulse space-y-3">
          <div class="h-6 bg-slate-100 rounded w-3/4"></div>
          <div class="h-4 bg-slate-100 rounded w-1/2"></div>
          <div class="h-20 bg-slate-50 rounded mt-4"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && reservations().length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
        <div class="bg-slate-50 p-4 rounded-full mb-4">
          <lucide-icon name="calendar-off" class="w-8 h-8 text-slate-400"></lucide-icon>
        </div>
        <h3 class="text-lg font-medium text-slate-900">No tienes reservas activas</h3>
        <p class="text-slate-500 max-w-sm text-center mt-1 mb-6 text-sm">Parece que aún no has realizado ninguna reserva en el sistema.</p>
      </div>

      <!-- Grid de Reservas -->
      <div *ngIf="!loading() && reservations().length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let res of reservations()" class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group h-full">

          <!-- Card Header -->
          <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white border border-slate-200 rounded-lg text-blue-600 shadow-sm group-hover:border-blue-300 transition-colors">
                <!-- Icono Genérico (Podrías hacerlo dinámico si tienes el tipo) -->
                <lucide-icon name="book-open" class="w-5 h-5"></lucide-icon>
              </div>
              <div>
                <!-- Usamos 'spaceName' o fallback -->
                <h4 class="font-semibold text-slate-900 line-clamp-1 text-sm">{{ res.spaceName || 'Espacio #' + res.spaceId }}</h4>
                <p class="text-xs text-slate-500 font-medium capitalize">{{ res.spaceType || 'Recurso' }}</p>
              </div>
            </div>

            <!-- Badge de Estado -->
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm flex items-center gap-1 uppercase tracking-wide"
              [ngClass]="{
                'bg-emerald-50 text-emerald-700 border-emerald-200': res.status === 'CONFIRMED',
                'bg-red-50 text-red-700 border-red-200': res.status === 'CANCELLED',
                'bg-amber-50 text-amber-700 border-amber-200': res.status === 'PENDING'
              }"
            >
              <span class="w-1.5 h-1.5 rounded-full"
                [ngClass]="{
                  'bg-emerald-500': res.status === 'CONFIRMED',
                  'bg-red-500': res.status === 'CANCELLED',
                  'bg-amber-500': res.status === 'PENDING'
                }"></span>
              {{ res.status === 'CONFIRMED' ? 'Confirmada' : (res.status === 'CANCELLED' ? 'Cancelada' : 'Pendiente') }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="p-5 space-y-4 flex-1">
            <div class="flex items-start gap-3">
              <lucide-icon name="calendar" class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0"></lucide-icon>
              <div>
                <p class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fecha</p>
                <p class="text-sm text-slate-700 font-medium">{{ res.startTime | date:'fullDate' }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <lucide-icon name="clock" class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0"></lucide-icon>
              <div>
                <p class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Horario</p>
                <p class="text-sm text-slate-700 font-medium">
                  {{ res.startTime | date:'shortTime' }} - {{ res.endTime | date:'shortTime' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end items-center h-14">
            <button
              *ngIf="res.status === 'CONFIRMED' || res.status === 'PENDING'"
              (click)="cancelReservation(res.id)"
              class="text-xs text-red-600 hover:text-red-700 font-bold hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 uppercase tracking-wide"
            >
              <lucide-icon name="trash-2" class="w-3 h-3"></lucide-icon> Cancelar
            </button>
             <span *ngIf="res.status === 'CANCELLED'" class="text-xs text-slate-400 italic">
               Cancelada el {{ (res.updatedAt | date:'shortDate') || 'recientemente' }}
             </span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MisReservasComponent {
  private reservationsService = inject(ReservationsService);

  // Signals de Angular 18
  reservations = signal<any[]>([]);
  loading = signal(true);

  constructor() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    // Llamada al backend
    this.reservationsService.getMyReservations().subscribe({
      next: (data) => {
        // Ordenar: más recientes primero
        const sorted = data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        this.reservations.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
        // Si quieres probar sin backend, descomenta la siguiente línea:
        // this.mockData();

        // Si falla y no hay datos, muestra error
        if (this.reservations().length === 0) {
             toast.error('No se pudieron cargar tus reservas', { description: 'Intenta recargar la página.' });
        }
        this.loading.set(false);
      }
    });
  }

  cancelReservation(id: number) {
    if(!confirm('¿Estás seguro que deseas cancelar esta reserva? Esta acción liberará el espacio inmediatamente.')) return;

    const toastId = toast.loading('Cancelando reserva...');

    this.reservationsService.cancel(id).subscribe({
      next: () => {
        toast.dismiss(toastId);
        toast.success('Reserva cancelada exitosamente');
        this.loadData(); // Recargar la lista para ver el cambio de estado
      },
      error: (err) => {
        toast.dismiss(toastId);
        toast.error('Error al cancelar', { description: err.error?.message || 'Hubo un problema de red.' });
      }
    });
  }

  // SOLO PARA PRUEBAS VISUALES (Si no hay backend)
  mockData() {
    this.reservations.set([
      { id: 1, spaceName: 'Laboratorio de Física', spaceType: 'lab', startTime: new Date().toISOString(), endTime: new Date(new Date().getTime() + 7200000).toISOString(), status: 'CONFIRMED' },
      { id: 2, spaceName: 'Sala de Estudio A', spaceType: 'study', startTime: '2023-11-20T10:00:00', endTime: '2023-11-20T12:00:00', status: 'CANCELLED', updatedAt: new Date() }
    ]);
  }
}
