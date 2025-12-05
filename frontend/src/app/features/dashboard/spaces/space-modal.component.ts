import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnChanges,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpacesService } from '../../../core/services/spaces.service';
import { LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-space-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <!-- Overlay con backdrop-blur para enfoque -->
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all animate-in"
    >
      <!-- Modal Card -->
      <div
        class="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <!-- Header -->
        <div
          class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80"
        >
          <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
              <lucide-icon name="map-pin" class="w-5 h-5"></lucide-icon>
            </div>
            {{ isEditing ? 'Editar Espacio' : 'Nuevo Espacio' }}
          </h3>
          <button
            (click)="closeModal()"
            class="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto p-6">
          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
            <!-- Nombre -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Nombre del Espacio</label>
              <div class="relative flex items-center">
                <lucide-icon
                  name="type"
                  class="absolute left-3 w-4 h-4 text-slate-400 z-10"
                ></lucide-icon>
                <input
                  formControlName="name"
                  class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="Ej: Laboratorio de Química 1"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Tipo -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Tipo</label>
                <div class="relative flex items-center">
                  <lucide-icon
                    name="book-open"
                    class="absolute left-3 w-4 h-4 text-slate-400 z-10"
                  ></lucide-icon>
                  <select
                    formControlName="type"
                    class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
                  >
                    <option value="study">Sala de Estudio</option>
                    <option value="lab">Laboratorio</option>
                    <option value="sports">Cancha Deportiva</option>
                    <option value="meeting">Sala de Reuniones</option>
                    <option value="other">Otro</option>
                  </select>
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      class="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Capacidad -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Capacidad</label>
                <div class="relative flex items-center">
                  <lucide-icon
                    name="users"
                    class="absolute left-3 w-4 h-4 text-slate-400 z-10"
                  ></lucide-icon>
                  <input
                    type="number"
                    formControlName="capacity"
                    class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            <!-- Horarios (Visualmente destacado) -->
            <div class="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <h4 class="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                <lucide-icon name="clock" class="w-4 h-4"></lucide-icon> Disponibilidad Diaria
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-medium text-slate-500 uppercase tracking-wide"
                    >Apertura</label
                  >
                  <input
                    type="time"
                    formControlName="openingTime"
                    class="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-slate-500 uppercase tracking-wide"
                    >Cierre</label
                  >
                  <input
                    type="time"
                    formControlName="closingTime"
                    class="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Imagen -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700"
                >Emoji o URL Imagen
                <span class="text-slate-400 font-normal">(Opcional)</span></label
              >
              <div class="relative flex items-center">
                <lucide-icon
                  name="image"
                  class="absolute left-3 w-4 h-4 text-slate-400 z-10"
                ></lucide-icon>
                <input
                  formControlName="image"
                  class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ej: 🏀 o https://..."
                />
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="flex justify-end gap-3 pt-2 mt-4">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="form.invalid || loading"
                class="relative inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
              >
                <span *ngIf="!loading" class="flex items-center gap-2">
                  <lucide-icon name="check-circle-2" class="w-4 h-4"></lucide-icon>
                  {{ isEditing ? 'Guardar Cambios' : 'Crear Espacio' }}
                </span>

                <span *ngIf="loading" class="flex items-center gap-2">
                  <lucide-icon name="loader-2" class="w-4 h-4 animate-spin"></lucide-icon>
                  Procesando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class SpaceModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() initialData: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private spacesService = inject(SpacesService);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['study', Validators.required],
    capacity: [10, [Validators.required, Validators.min(1)]],
    image: [''],
    openingTime: ['08:00', Validators.required],
    closingTime: ['20:00', Validators.required],
  });

  loading = false;

  get isEditing() {
    return !!this.initialData;
  }

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
        type: this.initialData.type,
        capacity: this.initialData.capacity,
        image: this.initialData.image || '',
        openingTime: this.initialData.openingTime || '08:00',
        closingTime: this.initialData.closingTime || '20:00',
      });
    } else {
      this.form.reset({
        name: '',
        type: 'study',
        capacity: 10,
        image: '',
        openingTime: '08:00',
        closingTime: '20:00',
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { openingTime, closingTime } = this.form.value;

    // Validación de lógica de horario
    if (openingTime && closingTime && openingTime >= closingTime) {
      toast.warning('Horario inválido', {
        description: 'La hora de cierre debe ser posterior a la de apertura.',
      });
      return;
    }

    this.loading = true;

    const payload = { ...this.form.value, image: this.form.value.image || null };

    const request = this.isEditing
      ? this.spacesService.update(this.initialData.id, payload)
      : this.spacesService.create(payload);

    request.subscribe({
      next: () => {
        toast.success(this.isEditing ? 'Espacio actualizado' : 'Espacio creado correctamente');
        this.loading = false;
        this.saved.emit();
      },
      error: (err) => {
        toast.error('Error', { description: err.error?.message || 'No se pudo guardar.' });
        this.loading = false;
      },
    });
  }

  closeModal() {
    if (!this.loading) this.closed.emit();
  }
}
