import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/services/users.service';
import { UserModalComponent } from './user-modal.component';
import { LucideAngularModule } from 'lucide-angular'; // Importar iconos

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserModalComponent, LucideAngularModule],
  template: `
    <section class="p-6 md:p-10">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p class="text-slate-600">Administra los accesos y roles del sistema.</p>
        </div>
        <button
          (click)="openCreate()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-black text-white hover:bg-slate-800 h-10 px-4 py-2"
        >
          <lucide-icon name="plus" class="w-4 h-4 mr-2"></lucide-icon> Crear Usuario
        </button>
      </div>

      <div *ngIf="loading()" class="space-y-4">
        <div *ngFor="let i of [1,2,3]" class="h-12 bg-slate-100 rounded animate-pulse"></div>
      </div>

      <div *ngIf="!loading()" class="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th class="px-6 py-4">Nombre</th>
              <th class="px-6 py-4">Correo Electrónico</th>
              <th class="px-6 py-4">Rol</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr *ngFor="let user of users()" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900">{{ user.name }}</td>
              <td class="px-6 py-4 text-slate-600">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  [ngClass]="{
                    'bg-slate-900 text-white': user.role === 'ADMIN',
                    'bg-slate-100 text-slate-900 hover:bg-slate-200': user.role !== 'ADMIN'
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button (click)="edit(user)" class="text-slate-500 hover:text-slate-900 p-2 rounded-md hover:bg-slate-100">
                  <lucide-icon name="edit" class="w-4 h-4"></lucide-icon>
                </button>
                <button
                  (click)="remove(user.id)"
                  [disabled]="user.role === 'ADMIN'"
                  class="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="users().length === 0" class="p-12 text-center text-slate-500">
          No se encontraron usuarios.
        </div>
      </div>

      <app-user-modal
        [isOpen]="modalOpen"
        [initialData]="selectedUser"
        (closed)="onModalClose()"
        (saved)="onSaved()"
      ></app-user-modal>
    </section>
  `
})
export class UsersComponent {
  private usersService = inject(UsersService);

  users = signal<any[]>([]);
  loading = signal<boolean>(true);

  modalOpen = false;
  selectedUser: any = null;

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.usersService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openCreate() {
    this.selectedUser = null;
    this.modalOpen = true;
  }

  edit(user: any) {
    this.selectedUser = user;
    this.modalOpen = true;
  }

  remove(id: number) {
    if (confirm('¿Eliminar usuario permanentemente?')) {
      this.usersService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: () => alert('No se pudo eliminar el usuario')
      });
    }
  }

  onModalClose() {
    this.modalOpen = false;
    this.selectedUser = null;
  }

  onSaved() {
    this.onModalClose();
    this.loadUsers();
  }
}
