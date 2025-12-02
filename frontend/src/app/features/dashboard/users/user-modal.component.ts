import { Component, EventEmitter, Input, Output, inject, OnChanges, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in">
      <div class="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">

        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
               <lucide-icon name="user" class="w-5 h-5"></lucide-icon>
            </div>
            {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <button (click)="closeModal()" class="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div class="p-6">
          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">

            <!-- Nombre -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Nombre Completo</label>
              <div class="relative flex items-center">
                <lucide-icon name="user" class="absolute left-3 w-4 h-4 text-slate-400 z-10"></lucide-icon>
                <input formControlName="name" class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Ej: Ana García" />
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Correo Electrónico</label>
              <div class="relative flex items-center">
                <lucide-icon name="mail" class="absolute left-3 w-4 h-4 text-slate-400 z-10"></lucide-icon>
                <input formControlName="email" type="email" class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500" placeholder="ana@institucion.edu" />
              </div>
            </div>

            <!-- Rol -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Rol</label>
              <div class="relative flex items-center">
                <lucide-icon name="shield" class="absolute left-3 w-4 h-4 text-slate-400 z-10"></lucide-icon>
                <select formControlName="role" class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer">
                  <option value="USER">Estudiante / Usuario</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                   <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <!-- Password -->
            <div *ngIf="!isEditing" class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Contraseña Temporal</label>
              <div class="relative flex items-center">
                <lucide-icon name="lock" class="absolute left-3 w-4 h-4 text-slate-400 z-10"></lucide-icon>
                <input formControlName="password" type="password" class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="••••••••" />
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button type="button" (click)="closeModal()" class="px-4 py-2 text-sm font-medium text-slate-700 bg-whiteHV border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" [disabled]="form.invalid || loading"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
                <lucide-icon *ngIf="loading" name="loader-2" class="w-4 h-4 mr-2 animate-spin"></lucide-icon>
                <lucide-icon *ngIf="!loading" name="check-circle-2" class="w-4 h-4 mr-2"></lucide-icon>
                {{ isEditing ? 'Guardar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class UserModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() initialData: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['USER', Validators.required]
  });

  loading = false;

  get isEditing() { return !!this.initialData; }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      this.resetForm();
      this.cdr.detectChanges();
    }
  }

  resetForm() {
    if (this.initialData) {
      this.form.patchValue({
        name: this.initialData.name,
        email: this.initialData.email,
        role: this.initialData.role || 'USER'
      });
      this.form.get('email')?.disable();
      this.form.get('password')?.disable();
      this.form.get('password')?.clearValidators();
    } else {
      this.form.reset({ name: '', email: '', password: '', role: 'USER' });
      this.form.get('email')?.enable();
      this.form.get('password')?.enable();
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.form.get('password')?.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const value = this.form.getRawValue();

    const request = this.isEditing
      ? this.usersService.update(this.initialData.id, { name: value.name, role: value.role })
      : this.usersService.create(value);

    request.subscribe({
      next: () => {
        toast.success(this.isEditing ? 'Usuario actualizado' : 'Usuario creado');
        this.loading = false;
        this.saved.emit();
      },
      error: (err) => {
        toast.error('Error', { description: err.error?.message || 'Error al guardar' });
        this.loading = false;
      }
    });
  }

  closeModal() {
    if (!this.loading) this.closed.emit();
  }
}
