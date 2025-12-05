import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationsService } from '../../../core/services/reservations.service';
import { SpacesService } from '../../../core/services/spaces.service';
import { LucideAngularModule } from 'lucide-angular';
import { startOfWeek, addDays, addWeeks, subWeeks, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DatePipe],
  template: `
    <div class="space-y-6 p-6 md:p-10 h-full flex flex-col">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Horarios y Ocupación</h1>
          <p class="text-slate-600">Gestión visual de la disponibilidad de recursos.</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
            <button (click)="prevWeek()" class="p-2 hover:bg-slate-50 border-r border-slate-100 text-slate-600">
              <lucide-icon name="arrow-left" class="w-5 h-5"></lucide-icon>
            </button>
            <span class="px-4 py-2 text-sm font-semibold text-slate-700 min-w-[140px] text-center capitalize">
              {{ currentWeekRange }}
            </span>
            <button (click)="nextWeek()" class="p-2 hover:bg-slate-50 border-l border-slate-100 text-slate-600">
              <lucide-icon name="arrow-right" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          <div class="relative">
            <lucide-icon name="map-pin" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10"></lucide-icon>
            <select (change)="filterBySpace($event)" class="pl-10 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer shadow-sm min-w-[200px]">
              <option value="all">Ver todos los espacios</option>
              <option *ngFor="let space of spaces()" [value]="space.id">{{ space.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[600px]">
        <div class="grid grid-cols-8 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div class="p-4 text-xs font-bold text-slate-400 uppercase text-center border-r border-slate-200 bg-white sticky left-0 z-20">
            Hora
          </div>
          <div *ngFor="let day of weekDates" class="p-3 text-center border-r border-slate-200 last:border-r-0 min-w-[100px]">
            <div class="text-xs font-bold text-slate-500 uppercase">{{ day | date:'EEE':undefined:'es' }}</div>
            <div class="text-lg font-bold text-slate-800" [ngClass]="{'text-blue-600': isToday(day)}">
              {{ day | date:'d' }}
            </div>
          </div>
        </div>

        <div class="overflow-y-auto flex-1 relative">
          <div *ngFor="let hour of hours" class="grid grid-cols-8 border-b border-slate-100 last:border-0 min-h-[100px]">
            <div class="p-3 text-xs text-slate-500 font-bold text-center border-r border-slate-200 bg-slate-50/50 flex items-start justify-center pt-4 sticky left-0 z-10">
              {{ formatHour(hour) }}
            </div>

            <div *ngFor="let day of weekDates" class="relative border-r border-slate-100 last:border-r-0 group hover:bg-slate-50/50 transition-colors p-1">
              <ng-container *ngFor="let res of getReservationsFor(day, hour)">
                <div
                  class="absolute inset-x-1 rounded-md p-2 text-xs overflow-hidden cursor-pointer shadow-sm border-l-4 transition-all hover:shadow-md hover:scale-[1.02] z-10 flex flex-col justify-between"
                  [ngClass]="getEventColor(res.status)"
                  [style.top.%]="getTopOffset(res.startTime)"
                  [style.height.px]="getDurationHeight(res.startTime, res.endTime)"
                  [title]="(res.space?.name || 'Sin Espacio') + ' - ' + (res.user?.name || 'Usuario')"
                >
                  <div>
                    <p class="font-bold truncate leading-tight">{{ res.space?.name || 'Espacio' }}</p>
                    <p class="text-[10px] opacity-90 truncate mt-0.5">{{ res.startTime | date:'HH:mm' }} - {{ res.endTime | date:'HH:mm' }}</p>
                  </div>
                  <div class="flex items-center gap-1 mt-1 opacity-80">
                    <lucide-icon name="user" class="w-3 h-3"></lucide-icon>
                    <span class="truncate">{{ res.user?.name || 'Usuario' }}</span>
                  </div>
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

  hours = Array.from({ length: 16 }, (_, i) => i + 7);

  currentDate = signal(new Date());
  reservations = signal<any[]>([]);
  spaces = signal<any[]>([]);
  filteredReservations = signal<any[]>([]);
  selectedSpaceId = signal<string>('all');

  get weekDates(): Date[] {
    const start = startOfWeek(this.currentDate(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  get currentWeekRange(): string {
    const start = this.weekDates[0];
    const end = this.weekDates[6];
    const fmt = (d: Date) => format(d, 'd MMM', { locale: es });
    return `${fmt(start)} - ${fmt(end)}`;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.spacesService.getAll().subscribe(data => this.spaces.set(data));
    this.reservationService.getAll().subscribe({
      next: (data) => {
        const valid = data.filter(r => r.status !== 'CANCELLED');
        this.reservations.set(valid);
        this.applyFilter();
      },
      error: (e) => console.error('Error cargando reservas', e)
    });
  }

  prevWeek() { this.currentDate.set(subWeeks(this.currentDate(), 1)); }
  nextWeek() { this.currentDate.set(addWeeks(this.currentDate(), 1)); }

  filterBySpace(event: any) {
    this.selectedSpaceId.set(event.target.value);
    this.applyFilter();
  }

  applyFilter() {
    const spaceId = this.selectedSpaceId();
    if (spaceId === 'all') {
      this.filteredReservations.set(this.reservations());
    } else {
      this.filteredReservations.set(
        this.reservations().filter(r => r.space?.id == spaceId)
      );
    }
  }

  getReservationsFor(day: Date, hour: number) {
    return this.filteredReservations().filter(res => {
      const resDate = new Date(res.startTime);
      return isSameDay(resDate, day) && resDate.getHours() === hour;
    });
  }

  getTopOffset(startTime: string): number {
    const date = new Date(startTime);
    return (date.getMinutes() / 60) * 100;
  }

  getDurationHeight(start: string, end: string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diffHours = (e - s) / (1000 * 60 * 60);
    return Math.max(diffHours * 100 - 4, 30);
  }

  formatHour(hour: number): string { return `${hour}:00`; }
  isToday(date: Date): boolean { return isSameDay(date, new Date()); }

  getEventColor(status: string) {
    if (status === 'CONFIRMED') return 'bg-blue-100 border-blue-600 text-blue-900';
    if (status === 'PENDING') return 'bg-amber-100 border-amber-500 text-amber-900';
    return 'bg-slate-100 border-slate-400 text-slate-700';
  }
}
