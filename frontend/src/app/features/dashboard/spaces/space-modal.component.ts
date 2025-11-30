import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SpacesService } from '../../../core/services/spaces.service';

@Component({
  selector: 'app-space-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-2">{{ isEditing ? 'Editar Espacio' : 'Crear Espacio' }}</h3>

        <div *ngIf="error" class="mb-3 p-2 bg-red-100 text-red-700 rounded">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="block text-sm">Nombre</label>
            <input formControlName="name" class="w-full border px-2 py-1" />
          </div>
          <div class="mb-3">
            <label class="block text-sm">Tipo</label>
            <select formControlName="type" class="w-full border px-2 py-1">
              <option value="study">Sala de Estudio</option>
              <option value="lab">Laboratorio</option>
              <option value="sports">Cancha Deportiva</option>
              <option value="meeting">Sala de Reuniones</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm">Capacidad</label>
            <input type="number" formControlName="capacity" class="w-full border px-2 py-1" />
          </div>
          <div class="mb-4">
            <label class="block text-sm">Emoji/Imagen</label>
            <input formControlName="image" class="w-full border px-2 py-1" />
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
export class SpaceModalComponent {
  @Input() isOpen = false;
  @Input() initialData: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private spacesService = inject(SpacesService);

  form = this.fb.group({ name: [''], type: ['study'], capacity: [1], image: [''] });
  loading = false;
  error: string | null = null;

  get isEditing() { return !!this.initialData; }

  ngOnChanges() {
    if (this.initialData) {
      this.form.patchValue({
        name: this.initialData.name,
        type: this.initialData.type,
        capacity: this.initialData.capacity,
        image: this.initialData.image || ''
      });
      this.error = null;
    } else {
      this.form.reset({ name: '', type: 'study', capacity: 10, image: '' });
      this.error = null;
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = { ...this.form.value, image: this.form.value.image || null };

    const obs = this.isEditing ? this.spacesService.update(this.initialData.id, payload) : this.spacesService.create(payload);
    obs.subscribe({
      next: () => { this.loading = false; this.saved.emit(); },
      error: (err) => { this.loading = false; this.error = err?.error?.message || 'Error guardando espacio'; }
    });
  }

  closeModal() {
    if (!this.loading) this.closed.emit();
  }
}
