import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationsService } from '../../../core/services/reservations.service';
import { LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-student-reservation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">

        <div class="bg-blue-600 p-6 text-white">
          <h3 class="text-lg font-bold flex items-center gap-2">
            <lucide-icon name="calendar-plus" class="w-5 h-5"></lucide-icon>
            Solicitar Reserva
          </h3>
          <p class="text-blue-100 text-sm mt-1">Estás reservando: <span class="font-semibold text-white">{{ space?.name }}</span></p>
        </div>

        <div class="p-6">
          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">

            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">¿Para qué día?</label>
              <div class="relative">
                <lucide-icon name="calendar" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"></lucide-icon>
                <input type="date" formControlName="date" [min]="minDate" class="flex w-full h-10 pl-10 pr-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Desde</label>
                <div class="relative">
                  <lucide-icon name="clock" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"></lucide-icon>
                  <input type="time" formControlName="startTime" class="flex w-full h-10 pl-10 pr-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Hasta</label>
                <div class="relative">
                  <lucide-icon name="clock" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"></lucide-icon>
                  <input type="time" formControlName="endTime" class="flex w-full h-10 pl-10 pr-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div class="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs flex gap-2 items-start">
              <lucide-icon name="info" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
              <p>Tu reserva quedará confirmada automáticamente si el horario está libre.</p>
            </div>

            <div class="pt-2 flex gap-3">
              <button type="button" (click)="closeModal()" class="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                Cancelar
              </button>
              <button type="submit" [disabled]="form.invalid || loading()" class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                <lucide-icon *ngIf="loading()" name="loader-2" class="w-4 h-4 animate-spin"></lucide-icon>
                {{ loading() ? 'Procesando...' : 'Confirmar Reserva' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class StudentReservationModalComponent {
  @Input() isOpen = false;
  @Input() space: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private reservationService = inject(ReservationsService);

  // FIX: Usamos signal para evitar ExpressionChangedAfterItHasBeenCheckedError
  loading = signal(false);

  minDate = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;

    // Validación básica de horas
    if (val.startTime! >= val.endTime!) {
        toast.warning('Horario inválido', { description: 'La hora de fin debe ser posterior a la de inicio.' });
        return;
    }

    // Activamos loading signal
    this.loading.set(true);

    const startIso = `${val.date}T${val.startTime}:00`;
    const endIso = `${val.date}T${val.endTime}:00`;

    const payload = {
      space: { id: this.space.id },
      startTime: startIso,
      endTime: endIso
    };

    this.reservationService.create(payload).subscribe({
      next: () => {
        toast.success('¡Reserva realizada con éxito!');
        this.loading.set(false);
        this.form.reset();
        this.saved.emit();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al reservar. Verifica si el horario está disponible.';
        toast.error('No se pudo reservar', { description: msg });
        this.loading.set(false);
      }
    });
  }

  closeModal() {
    if (!this.loading()) {
      this.isOpen = false;
      this.closed.emit();
    }
  }
}
