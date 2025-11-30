import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/services/users.service';
import { UserModalComponent } from './user-modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserModalComponent],
  template: `
    <section class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold">Usuarios</h2>
        <button class="btn btn-primary" (click)="openCreate()">Crear Usuario</button>
      </div>

      <div *ngIf="loading" class="text-sm text-slate-500">Cargando...</div>
      <div *ngIf="!loading && users.length === 0" class="text-sm text-slate-500">No hay usuarios.</div>

      <ul *ngIf="!loading" class="space-y-2">
        <li *ngFor="let u of users" class="p-3 border rounded flex justify-between items-center">
          <div>
            <div class="font-medium">{{ u.name }}</div>
            <div class="text-sm text-slate-500">{{ u.email }}</div>
          </div>
          <div class="flex gap-2 items-center">
            <div class="text-sm text-slate-600">{{ u.role }}</div>
            <button class="btn" (click)="edit(u)">Editar</button>
            <button class="btn btn-danger" (click)="remove(u.id)">Eliminar</button>
          </div>
        </li>
      </ul>

      <app-user-modal
        [isOpen]="modalOpen"
        [initialData]="selected"
        (closed)="onModalClose()"
        (saved)="onSaved()"
      ></app-user-modal>
    </section>
  `,
  styles: []
})
export class UsersComponent {
  private usersService = inject(UsersService);

  users: any[] = [];
  loading = false;

  modalOpen = false;
  selected: any = null;

  constructor() {
    this.load();
  }

  load() {
    this.loading = true;
    this.usersService.getAll().subscribe({
      next: (res: any) => { this.users = res || []; this.loading = false; },
      error: () => { this.users = []; this.loading = false; }
    });
  }

  openCreate() {
    this.selected = null;
    this.modalOpen = true;
  }

  edit(u: any) {
    this.selected = u;
    this.modalOpen = true;
  }

  remove(id: number) {
    if (!confirm('Eliminar usuario?')) return;
    this.usersService.delete(id).subscribe({ next: () => this.load(), error: () => alert('Error eliminando') });
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
