import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-2">{{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}</h3>

        <div *ngIf="error" class="mb-3 p-2 bg-red-100 text-red-700 rounded">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="block text-sm">Nombre</label>
            <input formControlName="name" class="w-full border px-2 py-1" />
          </div>
          <div class="mb-3">
            <label class="block text-sm">Correo</label>
            <input formControlName="email" type="email" class="w-full border px-2 py-1" [disabled]="isEditing" />
          </div>
          <div *ngIf="!isEditing" class="mb-3">
            <label class="block text-sm">Contraseña</label>
            <input formControlName="password" type="password" class="w-full border px-2 py-1" />
          </div>
          <div *ngIf="isEditing" class="mb-3">
            <label class="block text-sm">Rol</label>
            <select formControlName="role" class="w-full border px-2 py-1">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div class="flex justify-end gap-2">
            <button type="button" class="px-3 py-1 border rounded" (click)="closeModal()" [disabled]="loading">Cancelar</button>
            <button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded" [disabled]="loading">{{ loading ? 'Guardando...' : (isEditing ? 'Guardar' : 'Crear') }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class UserModalComponent {
  @Input() isOpen = false;
  @Input() initialData: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);

  form = this.fb.group({ name: [''], email: [''], password: [''], role: ['USER'] });
  loading = false;
  error: string | null = null;

  get isEditing() { return !!this.initialData; }

  ngOnChanges() {
    if (this.initialData) {
      this.form.patchValue({ name: this.initialData.name, email: this.initialData.email, role: this.initialData.role || 'USER' });
      this.error = null;
    } else {
      this.form.reset({ name: '', email: '', password: '', role: 'USER' });
      this.error = null;
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const value = this.form.value;

    let obs;
    if (this.isEditing) {
      const payload: any = { name: value.name, role: value.role };
      obs = this.usersService.update(this.initialData.id, payload);
    } else {
      if (!value.password || value.password.length < 6) { this.loading = false; this.error = 'Contraseña mínima 6 caracteres'; return; }
      const payload: any = { name: value.name, email: value.email, password: value.password };
      obs = this.usersService.create(payload);
    }

    obs.subscribe({ next: () => { this.loading = false; this.saved.emit(); }, error: (err) => { this.loading = false; this.error = err?.error?.message || 'Error guardando usuario'; } });
  }

  closeModal() { if (!this.loading) this.closed.emit(); }
}
