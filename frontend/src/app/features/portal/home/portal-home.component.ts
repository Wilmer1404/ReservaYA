import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-portal-home',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Bienvenido al Portal</h1>
        <p class="text-slate-600 mt-2 text-lg">¿Qué necesitas hacer hoy?</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- Tarjeta: Nueva Reserva (AHORA ACTIVA) -->
        <a routerLink="/portal/nueva-reserva" class="block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all group relative overflow-hidden cursor-pointer no-underline">

          <div class="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <lucide-icon name="plus" class="w-6 h-6"></lucide-icon>
          </div>

          <h3 class="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Nueva Reserva</h3>
          <p class="text-slate-500 mb-4 text-sm leading-relaxed">Busca un espacio disponible y resérvalo en el horario que necesites.</p>

          <span class="inline-flex items-center text-blue-600 font-medium text-sm group-hover:underline mt-2">
            Comenzar <lucide-icon name="arrow-right" class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"></lucide-icon>
          </span>
        </a>

        <!-- Tarjeta: Mis Reservas -->
        <a routerLink="/portal/mis-reservas" class="block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-green-300 transition-all group relative overflow-hidden cursor-pointer no-underline">
          <div class="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
            <lucide-icon name="calendar-check" class="w-6 h-6"></lucide-icon>
          </div>

          <h3 class="text-xl font-semibold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">Mis Reservas</h3>
          <p class="text-slate-500 mb-4 text-sm leading-relaxed">Consulta el estado de tus solicitudes o cancela reservas pendientes.</p>

          <span class="inline-flex items-center text-green-600 font-medium text-sm group-hover:underline mt-2">
            Ver historial <lucide-icon name="arrow-right" class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"></lucide-icon>
          </span>
        </a>

      </div>
    </div>
  `
})
export class PortalHomeComponent {}
