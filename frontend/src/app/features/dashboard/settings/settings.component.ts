import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 p-6 md:p-10">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Configuración</h1>
        <p class="text-slate-600">Gestiona la información de la institución y preferencias.</p>
      </div>

      <div class="grid gap-8">

        <!-- Tarjeta: Información General -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
                <lucide-icon name="building-2" class="w-5 h-5"></lucide-icon>
              </div>
              Información Institucional
            </h2>
          </div>

          <form [formGroup]="generalForm" (ngSubmit)="saveGeneral()" class="p-6 space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Nombre de la Institución</label>
                <div class="relative">
                  <lucide-icon name="type" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"></lucide-icon>
                  <input formControlName="institutionName" class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Correo de Contacto</label>
                <div class="relative">
                  <lucide-icon name="mail" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"></lucide-icon>
                  <input formControlName="contactEmail" class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Teléfono</label>
                <input formControlName="phone" class="flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Sitio Web</label>
                <div class="relative">
                  <lucide-icon name="globe" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"></lucide-icon>
                  <input formControlName="website" class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Dirección</label>
              <div class="relative">
                <lucide-icon name="map-pin" class="absolute left-3 top-3 w-4 h-4 text-slate-400"></lucide-icon>
                <textarea formControlName="address" rows="3" class="pl-10 flex w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none transition-all"></textarea>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button type="submit" [disabled]="generalForm.invalid" class="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                <lucide-icon name="save" class="w-4 h-4"></lucide-icon> Guardar Cambios
              </button>
            </div>
          </form>
        </div>

        <!-- Tarjeta: Seguridad -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <div class="p-2 bg-purple-100 rounded-lg text-purple-600">
                <lucide-icon name="shield" class="w-5 h-5"></lucide-icon>
              </div>
              Seguridad y Preferencias
            </h2>
          </div>

          <div class="p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <label class="text-sm font-semibold text-slate-900">Notificaciones por Correo</label>
                <p class="text-xs text-slate-500">Recibir alertas cuando se crea una nueva reserva.</p>
              </div>
              <!-- Toggle Switch UI -->
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <hr class="border-slate-100">

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <label class="text-sm font-semibold text-slate-900">Aprobación Automática</label>
                <p class="text-xs text-slate-500">Las reservas se confirman automáticamente sin revisión manual.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class SettingsComponent {
  private fb = inject(FormBuilder);

  generalForm = this.fb.group({
    institutionName: ['Universidad Nacional', Validators.required],
    contactEmail: ['admin@uni.edu.pe', [Validators.required, Validators.email]],
    phone: ['+51 987 654 321'],
    website: ['www.uni.edu.pe'],
    address: ['Av. Universitaria 1234, Lima, Perú']
  });

  saveGeneral() {
    if (this.generalForm.valid) {
      console.log(this.generalForm.value);
      toast.success('Configuración guardada exitosamente', {
        description: 'Los datos de la institución han sido actualizados.'
      });
    }
  }
}
