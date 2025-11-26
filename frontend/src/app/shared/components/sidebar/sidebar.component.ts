import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white transition-transform">
      <div class="flex h-16 items-center border-b border-slate-200 px-6">
        <div class="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <lucide-icon name="calendar" class="h-5 w-5"></lucide-icon>
          </div>
          ReservaYA
        </div>
      </div>

      <div class="flex flex-col gap-1 p-4">

        <a routerLink="/dashboard"
           routerLinkActive="bg-blue-50 text-blue-600"
           [routerLinkActiveOptions]="{exact: true}"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="layout-dashboard" class="h-4 w-4"></lucide-icon>
          Resumen
        </a>

        <div class="mt-4 px-3 text-xs font-semibold uppercase text-slate-500">
          Gestión
        </div>

        <a routerLink="/dashboard/spaces"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="map-pin" class="h-4 w-4"></lucide-icon>
          Espacios
        </a>

        <a routerLink="/dashboard/users"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="users" class="h-4 w-4"></lucide-icon>
          Usuarios
        </a>

        <a routerLink="/dashboard/reservations"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
           <lucide-icon name="calendar-check" class="h-4 w-4"></lucide-icon>
           Reservas
        </a>

        <div class="mt-4 px-3 text-xs font-semibold uppercase text-slate-500">
          Análisis
        </div>

        <a routerLink="/dashboard/analytics"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="bar-chart-3" class="h-4 w-4"></lucide-icon>
          Reportes
        </a>

      </div>

      <div class="absolute bottom-0 w-full border-t border-slate-200 p-4">
        <div class="flex items-center gap-3 mb-4 px-2">
          <div class="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
            {{ userInitials() }}
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-slate-900">{{ auth.currentUser()?.userName }}</span>
            <span class="text-xs text-slate-500">{{ auth.currentUser()?.userRole }}</span>
          </div>
        </div>

        <button (click)="auth.logout()" class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <lucide-icon name="log-out" class="h-4 w-4"></lucide-icon>
          Cerrar sesión
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  auth = inject(AuthService);

  userInitials = computed(() => {
    const name = this.auth.currentUser()?.userName || 'U';
    return name.substring(0, 2).toUpperCase();
  });
}
