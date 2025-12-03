import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../../core/services/reservations.service';
import { SpacesService } from '../../../core/services/spaces.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 p-6 md:p-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Horarios y Ocupación</h1>
          <p class="text-slate-600">Vista semanal de la disponibilidad de espacios.</p>
        </div>

        <!-- Filtro de Espacios -->
        <div class="relative">
          <lucide-icon name="map-pin" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10"></lucide-icon>
          <select (change)="filterBySpace($event)" class="pl-10 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer shadow-sm w-full md:w-64">
            <option value="all">Todos los espacios</option>
            <option *ngFor="let space of spaces()" [value]="space.id">{{ space.name }}</option>
          </select>
          <div class="absolute right-3 top-3 pointer-events-none">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Calendario Grid -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-240px)]">
        <!-- Header Días -->
        <div class="grid grid-cols-8 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div class="p-3 text-xs font-bold text-slate-400 uppercase text-center border-r border-slate-200 flex items-center justify-center">Hora</div>
          <div *ngFor="let day of weekDays" class="p-3 text-sm font-semibold text-slate-700 text-center border-r border-slate-200 last:border-r-0">
            {{ day }}
          </div>
        </div>

        <!-- Body Horas (Scrollable) -->
        <div class="overflow-y-auto flex-1">
          <div *ngFor="let hour of hours" class="grid grid-cols-8 border-b border-slate-100 last:border-0 min-h-[80px]">
            <!-- Columna Hora -->
            <div class="p-2 text-xs text-slate-500 font-medium text-center border-r border-slate-200 bg-slate-50/30 flex items-start justify-center pt-3 sticky left-0">
              {{ formatHour(hour) }}
            </div>

            <!-- Columnas Días -->
            <div *ngFor="let day of weekDays; let dayIndex = index" class="relative border-r border-slate-100 last:border-r-0 p-1 group hover:bg-slate-50 transition-colors">

              <!-- Renderizar Reserva si coincide día y hora -->
              <ng-container *ngFor="let res of getReservationsFor(dayIndex, hour)">
                <div
                  class="absolute inset-x-1 top-1 bottom-1 rounded-md bg-blue-100 border-l-4 border-blue-600 p-2 text-xs overflow-hidden cursor-pointer hover:bg-blue-200 transition-colors z-10 shadow-sm flex flex-col justify-center"
                  [title]="res.space.name + ' - ' + res.user.name"
                >
                  <p class="font-bold text-blue-900 truncate leading-tight">{{ res.space.name }}</p>
                  <p class="text-blue-700 truncate text-[10px] mt-0.5 flex items-center gap-1">
                    <lucide-icon name="user" class="w-3 h-3"></lucide-icon> {{ res.user.name }}
                  </p>
                </div>
              </ng-container>

            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HorariosComponent implements OnInit {
  private reservationService = inject(ReservationsService);
  private spacesService = inject(SpacesService);

  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 a 20:00

  reservations = signal<any[]>([]);
  spaces = signal<any[]>([]);
  filteredReservations = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Cargar Espacios
    this.spacesService.getAll().subscribe(data => this.spaces.set(data));

    // Cargar Reservas
    this.reservationService.getAll().subscribe({
      next: (data) => {
        const confirmed = data.filter(r => r.status === 'CONFIRMED');
        this.reservations.set(confirmed);
        this.filteredReservations.set(confirmed);
      },
      error: () => this.mockData() // Fallback visual
    });
  }

  filterBySpace(event: any) {
    const spaceId = event.target.value;
    if (spaceId === 'all') {
      this.filteredReservations.set(this.reservations());
    } else {
      this.filteredReservations.set(
        this.reservations().filter(r => r.space.id == spaceId)
      );
    }
  }

  getReservationsFor(dayIndex: number, hour: number) {
    // Lógica simplificada para demo: Muestra reservas que empiecen en esa hora y día de la semana actual
    return this.filteredReservations().filter(res => {
      const date = new Date(res.startTime);
      // Ajuste de día JS (0=Dom) a nuestro array (0=Lun)
      let jsDay = date.getDay();
      const adjustedDayIndex = jsDay === 0 ? 6 : jsDay - 1;

      const resHour = date.getHours();
      return adjustedDayIndex === dayIndex && resHour === hour;
    });
  }

  formatHour(hour: number): string {
    return `${hour}:00`;
  }

  mockData() {
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    this.reservations.set([
      {
        id: 1,
        startTime: new Date().setHours(9, 0, 0, 0),
        endTime: new Date().setHours(10, 0, 0, 0),
        space: { id: 1, name: 'Lab Química' },
        user: { name: 'Juan Pérez' },
        status: 'CONFIRMED'
      },
      {
        id: 2,
        startTime: tomorrow.setHours(14, 0, 0, 0),
        endTime: tomorrow.setHours(16, 0, 0, 0),
        space: { id: 2, name: 'Cancha Fútbol' },
        user: { name: 'Equipo A' },
        status: 'CONFIRMED'
      }
    ]);
    this.filteredReservations.set(this.reservations());
  }
}
