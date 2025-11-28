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
      <!-- Logo -->
      <div class="flex h-16 items-center border-b border-slate-200 px-6">
        <div class="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <lucide-icon name="calendar" class="h-5 w-5"></lucide-icon>
          </div>
          ReservaYA
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex flex-col gap-1 p-4 h-[calc(100vh-8rem)] overflow-y-auto">

        <!-- Principal -->
        <div class="px-3 mb-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
          Principal
        </div>

        <a routerLink="/dashboard"
           routerLinkActive="bg-blue-50 text-blue-600"
           [routerLinkActiveOptions]="{exact: true}"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="layout-dashboard" class="h-4 w-4"></lucide-icon>
          Resumen
        </a>

        <!-- Gestión -->
        <div class="mt-6 px-3 mb-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
          Gestión
        </div>

        <a routerLink="/dashboard/horarios"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="calendar-clock" class="h-4 w-4"></lucide-icon>
          Horarios
        </a>

        <a routerLink="/dashboard/spaces"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="map-pin" class="h-4 w-4"></lucide-icon>
          Espacios
        </a>

        <a routerLink="/dashboard/reservations"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
           <lucide-icon name="calendar-check" class="h-4 w-4"></lucide-icon>
           Reservas
        </a>

        <a routerLink="/dashboard/users"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="users" class="h-4 w-4"></lucide-icon>
          Usuarios
        </a>

        <!-- Análisis -->
        <div class="mt-6 px-3 mb-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
          Análisis
        </div>

        <a routerLink="/dashboard/analytics"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="bar-chart-3" class="h-4 w-4"></lucide-icon>
          Reportes
        </a>

        <!-- Sistema -->
        <div class="mt-6 px-3 mb-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
          Sistema
        </div>

        <a routerLink="/dashboard/settings"
           routerLinkActive="bg-blue-50 text-blue-600"
           class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <lucide-icon name="settings" class="h-4 w-4"></lucide-icon>
          Configuración
        </a>

      </div>

      <!-- Footer / Logout -->
      <div class="absolute bottom-0 w-full border-t border-slate-200 p-4 bg-slate-50">
        <div class="flex items-center gap-3 mb-3 px-2">
          <div class="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
            {{ userInitials() }}
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-sm font-medium text-slate-900 truncate">{{ auth.currentUser()?.userName }}</span>
            <span class="text-xs text-slate-500 truncate">{{ auth.currentUser()?.userRole }}</span>
          </div>
        </div>

        <button (click)="auth.logout()" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
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
