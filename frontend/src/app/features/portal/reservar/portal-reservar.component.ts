import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpacesService } from '../../../core/services/spaces.service';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { StudentReservationModalComponent } from './student-reservation-modal.component';

@Component({
  selector: 'app-portal-reservar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, StudentReservationModalComponent],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Reservar Espacio</h1>
          <p class="text-slate-600 mt-2 text-lg">Selecciona un recurso para ver disponibilidad.</p>
        </div>
        <a routerLink="/portal" class="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
          <lucide-icon name="arrow-left" class="w-4 h-4"></lucide-icon> Volver
        </a>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3]" class="h-64 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse"></div>
      </div>

      <!-- Grid de Espacios -->
      <div *ngIf="!loading()" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let space of spaces()" class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col group">

          <!-- Imagen / Icono -->
          <div class="h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
            <!-- Si hay imagen URL la mostramos, si no, un icono grande -->
            <img *ngIf="space.image && space.image.startsWith('http')" [src]="space.image" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <lucide-icon *ngIf="!space.image || !space.image.startsWith('http')" name="map-pin" class="w-12 h-12 text-slate-400"></lucide-icon>

            <div class="absolute bottom-3 left-4 z-20 text-white">
              <p class="text-xs font-bold uppercase tracking-wider opacity-90">{{ space.type }}</p>
            </div>
          </div>

          <!-- Info -->
          <div class="p-5 flex-1 flex flex-col">
            <h3 class="text-xl font-bold text-slate-900 mb-2">{{ space.name }}</h3>

            <div class="space-y-2 mb-6 flex-1">
              <div class="flex items-center text-sm text-slate-600">
                <lucide-icon name="users" class="w-4 h-4 mr-2 text-blue-500"></lucide-icon>
                Capacidad: {{ space.capacity }} personas
              </div>
              <div class="flex items-center text-sm text-slate-600" *ngIf="space.openingTime">
                <lucide-icon name="clock" class="w-4 h-4 mr-2 text-green-500"></lucide-icon>
                {{ space.openingTime }} - {{ space.closingTime }}
              </div>
            </div>

            <button (click)="openModal(space)" class="w-full py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200 group-hover:shadow-blue-200">
              <span>Reservar</span>
              <lucide-icon name="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></lucide-icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <app-student-reservation-modal
      [isOpen]="isModalOpen"
      [space]="selectedSpace"
      (closed)="isModalOpen = false"
      (saved)="onSaved()"
    ></app-student-reservation-modal>
  `
})
export class PortalReservarComponent implements OnInit {
  private spacesService = inject(SpacesService);

  spaces = signal<any[]>([]);
  loading = signal(true);

  isModalOpen = false;
  selectedSpace: any = null;

  ngOnInit() {
    this.spacesService.getAll().subscribe({
      next: (data) => {
        this.spaces.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openModal(space: any) {
    this.selectedSpace = space;
    this.isModalOpen = true;
  }

  onSaved() {
    this.isModalOpen = false;
  }
}
