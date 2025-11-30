import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpacesService } from '../../../core/services/spaces.service';
import { SpaceModalComponent } from './space-modal.component';

@Component({
  selector: 'app-spaces',
  standalone: true,
  imports: [CommonModule, SpaceModalComponent],
  template: `
    <section class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold">Espacios</h2>
        <button class="btn btn-primary" (click)="openCreate()">Crear Espacio</button>
      </div>

      <div *ngIf="loading" class="text-sm text-slate-500">Cargando...</div>
      <div *ngIf="!loading && spaces.length === 0" class="text-sm text-slate-500">No hay espacios.</div>

      <ul *ngIf="!loading" class="space-y-2">
        <li *ngFor="let s of spaces" class="p-3 border rounded flex justify-between items-center">
          <div>
            <div class="font-medium">{{ s.name }}</div>
            <div class="text-sm text-slate-500">{{ s.type }} · Capacidad: {{ s.capacity }}</div>
          </div>
          <div class="flex gap-2">
            <button class="btn" (click)="edit(s)">Editar</button>
            <button class="btn btn-danger" (click)="remove(s.id)">Eliminar</button>
          </div>
        </li>
      </ul>

      <app-space-modal
        [isOpen]="modalOpen"
        [initialData]="selected"
        (closed)="onModalClose()"
        (saved)="onSaved()"
      ></app-space-modal>
    </section>
  `,
  styles: []
})
export class SpacesComponent {
  private spacesService = inject(SpacesService);

  spaces: any[] = [];
  loading = false;

  modalOpen = false;
  selected: any = null;

  constructor() {
    this.load();
  }

  load() {
    this.loading = true;
    this.spacesService.getAll().subscribe({
      next: (res: any) => { this.spaces = res || []; this.loading = false; },
      error: () => { this.spaces = []; this.loading = false; }
    });
  }

  openCreate() {
    this.selected = null;
    this.modalOpen = true;
  }

  edit(s: any) {
    this.selected = s;
    this.modalOpen = true;
  }

  remove(id: number) {
    if (!confirm('Eliminar espacio?')) return;
    this.spacesService.delete(id).subscribe({ next: () => this.load(), error: () => alert('Error eliminando') });
  }

  onModalClose() {
    this.modalOpen = false;
    this.selected = null;
  }

  onSaved() {
    this.modalOpen = false;
    this.selected = null;
    this.load();
  }
}
