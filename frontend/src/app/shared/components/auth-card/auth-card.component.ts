import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 1. Importar RouterLink desde @angular/router
import { LucideAngularModule } from 'lucide-angular'; // 2. Importar LucideAngularModule

@Component({
  selector: 'app-auth-card',
  standalone: true,
  // 3. Agregar RouterLink y LucideAngularModule al array de imports del componente
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div class="w-full max-w-md">

        <!-- backLink es un Input, usamos @if para renderizar condicionalmente -->
        @if (backLink) {
          <a routerLink="/" class="flex items-center gap-2 mb-8 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors no-underline">
            <lucide-icon name="arrow-left" class="w-4 h-4"></lucide-icon>
            Volver al inicio
          </a>
        }

        <div class="p-8 bg-white rounded-xl border border-slate-200 shadow-xl">
          <div class="flex items-center gap-2 mb-8">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <lucide-icon name="calendar" class="w-6 h-6 text-white"></lucide-icon>
            </div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight m-0">ReservaYA</h1>
          </div>

          <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ title }}</h2>
          <p class="text-slate-600 mb-8">{{ description }}</p>

          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class AuthCardComponent {
  @Input() title: string = '';
  @Input() description: string = ''; // 4. Corregido: era 'subtitle' en tu código, pero el template usaba 'description'
  @Input() backLink: boolean = true; // 5. Agregado: Propiedad backLink que faltaba
}
