import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { InstitutionService } from '../../../core/services/institution.service';

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
                  <lucide-icon
                    name="type"
                    class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"
                  ></lucide-icon>
                  <input
                    formControlName="institutionName"
                    class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Correo de Contacto</label>
                <div class="relative">
                  <lucide-icon
                    name="mail"
                    class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"
                  ></lucide-icon>
                  <input
                    formControlName="contactEmail"
                    class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Teléfono</label>
                <input
                  formControlName="phone"
                  class="flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-slate-700">Sitio Web</label>
                <div class="relative">
                  <lucide-icon
                    name="globe"
                    class="absolute left-3 top-2.5 w-4 h-4 text-slate-400"
                  ></lucide-icon>
                  <input
                    formControlName="website"
                    class="pl-10 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Dirección</label>
              <div class="relative">
                <lucide-icon
                  name="map-pin"
                  class="absolute left-3 top-3 w-4 h-4 text-slate-400"
                ></lucide-icon>
                <textarea
                  formControlName="address"
                  rows="3"
                  class="pl-10 flex w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none transition-all"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button
                type="submit"
                [disabled]="generalForm.invalid || isSaving"
                class="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <lucide-icon name="save" class="w-4 h-4"></lucide-icon>
                {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private institutionService = inject(InstitutionService);
  isSaving = false;

  generalForm = this.fb.group({
    institutionName: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    phone: [''],
    website: [''],
    address: [''],
  });

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.institutionService.getSettings().subscribe({
      next: (data) => {
        this.generalForm.patchValue({
          institutionName: data.name,
          contactEmail: data.contactEmail,
          phone: data.phone,
          website: data.website,
          address: data.address,
        });
      },
      error: (err) => {
        toast.error('Error al cargar la información');
        console.error(err);
      },
    });
  }

  saveGeneral() {
    if (this.generalForm.valid) {
      this.isSaving = true;
      const payload = {
        name: this.generalForm.value.institutionName,
        contactEmail: this.generalForm.value.contactEmail,
        phone: this.generalForm.value.phone,
        website: this.generalForm.value.website,
        address: this.generalForm.value.address,
      };

      this.institutionService.updateSettings(payload).subscribe({
        next: () => {
          this.isSaving = false;
          toast.success('Configuración guardada exitosamente');
        },
        error: (err) => {
          this.isSaving = false;
          toast.error('Error al guardar cambios');
          console.error(err);
        },
      });
    }
  }
}
