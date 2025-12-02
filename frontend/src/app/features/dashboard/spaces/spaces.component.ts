import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpacesService } from '../../../core/services/spaces.service';
import { SpaceModalComponent } from './space-modal.component';
// Importamos los iconos de Lucide que usaremos
import { LucideAngularModule, Plus, Edit, Trash2, Dumbbell, Microscope, BookOpen, Users, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-spaces',
  standalone: true,
  imports: [CommonModule, SpaceModalComponent, LucideAngularModule],
  template: `
    <section class="p-6 md:p-10">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Gestión de Espacios</h1>
          <p class="text-slate-600">Administra los laboratorios, salas y áreas deportivas.</p>
        </div>
        <button
          (click)="openCreate()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-slate-800 h-10 px-4 py-2"
        >
          <lucide-icon name="plus" class="w-4 h-4 mr-2"></lucide-icon>
          Crear Espacio
        </button>
      </div>

      <div *ngIf="loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3]" class="h-48 rounded-xl bg-slate-200 animate-pulse"></div>
      </div>

      <div *ngIf="!loading() && spaces().length === 0" class="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-300 rounded-lg">
        <lucide-icon name="book-open" class="w-12 h-12 text-slate-400 mb-4"></lucide-icon>
        <h3 class="text-lg font-medium text-slate-900">No hay espacios creados</h3>
        <p class="text-slate-500 mb-4">Empieza creando tu primer espacio para reservas.</p>
        <button (click)="openCreate()" class="text-blue-600 hover:underline">Crear ahora</button>
      </div>

      <div *ngIf="!loading() && spaces().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let space of spaces()" class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">

          <div class="p-6 flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
                <ng-container [ngSwitch]="space.type">
                  <lucide-icon *ngSwitchCase="'sports'" name="dumbbell" class="w-5 h-5"></lucide-icon>
                  <lucide-icon *ngSwitchCase="'lab'" name="microscope" class="w-5 h-5"></lucide-icon>
                  <lucide-icon *ngSwitchCase="'meeting'" name="users" class="w-5 h-5"></lucide-icon>
                  <lucide-icon *ngSwitchDefault name="book-open" class="w-5 h-5"></lucide-icon>
                </ng-container>
              </div>
              <h3 class="font-semibold text-lg text-slate-900">{{ space.name }}</h3>
            </div>
            <p class="text-sm text-slate-500 mb-4 capitalize">Tipo: {{ space.type }}</p>

            <div class="flex items-center text-slate-700 text-sm">
              <lucide-icon name="users" class="w-4 h-4 mr-2 text-slate-400"></lucide-icon>
              Capacidad: {{ space.capacity }} personas
            </div>
          </div>

          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
            <button
              (click)="edit(space)"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-200 h-9 px-3 text-slate-700"
            >
              <lucide-icon name="edit" class="w-4 h-4 mr-2"></lucide-icon> Editar
            </button>
            <button
              (click)="remove(space.id)"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-red-100 h-9 px-3 text-red-600"
            >
              <lucide-icon name="trash-2" class="w-4 h-4 mr-2"></lucide-icon> Eliminar
            </button>
          </div>
        </div>
      </div>

      <app-space-modal
        [isOpen]="modalOpen"
        [initialData]="selectedSpace"
        (closed)="onModalClose()"
        (saved)="onSaved()"
      ></app-space-modal>
    </section>
  `
})
export class SpacesComponent {
  private spacesService = inject(SpacesService);

  // Usamos Signals para mejor rendimiento (Angular 18 modern practice)
  spaces = signal<any[]>([]);
  loading = signal<boolean>(true);

  modalOpen = false;
  selectedSpace: any = null;

  constructor() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.loading.set(true);
    this.spacesService.getAll().subscribe({
      next: (data) => {
        this.spaces.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando espacios', err);
        this.loading.set(false);
      }
    });
  }

  openCreate() {
    this.selectedSpace = null;
    this.modalOpen = true;
  }

  edit(space: any) {
    this.selectedSpace = space;
    this.modalOpen = true;
  }

  remove(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este espacio? Esta acción no se puede deshacer.')) {
      this.spacesService.delete(id).subscribe({
        next: () => {
          this.loadSpaces(); // Recargar lista
        },
        error: (err) => alert('Error al eliminar el espacio')
      });
    }
  }

  onModalClose() {
    this.modalOpen = false;
    this.selectedSpace = null;
  }

  onSaved() {
    this.onModalClose();
    this.loadSpaces();
  }
}
