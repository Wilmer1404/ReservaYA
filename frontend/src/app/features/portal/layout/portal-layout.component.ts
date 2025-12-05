import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">

          <div class="flex items-center gap-2 font-bold text-xl text-blue-600 cursor-pointer" routerLink="/portal">
            <div class="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center shadow-sm">
              <lucide-icon name="calendar" class="w-5 h-5"></lucide-icon>
            </div>
            <span class="tracking-tight hidden sm:inline-block">ReservaYA</span>
          </div>

          <nav class="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <a routerLink="/portal"
               routerLinkActive="text-blue-600 bg-blue-50"
               [routerLinkActiveOptions]="{exact: true}"
               class="px-4 py-2 rounded-md transition-all hover:text-blue-600 hover:bg-slate-50">
              Inicio
            </a>
            <a routerLink="/portal/mis-reservas"
               routerLinkActive="text-blue-600 bg-blue-50"
               class="px-4 py-2 rounded-md transition-all hover:text-blue-600 hover:bg-slate-50">
              Mis Reservas
            </a>
          </nav>

          <div class="flex items-center gap-4">
            <div class="hidden md:flex flex-col items-end leading-tight">
              <span class="text-sm font-semibold text-slate-900">Estudiante</span>
              <span class="text-xs text-slate-500">Panel de Usuario</span>
            </div>
            <div class="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
            <button (click)="logout()" class="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium p-2 rounded-lg hover:bg-red-50" title="Cerrar Sesión">
              <lucide-icon name="log-out" class="w-4 h-4"></lucide-icon>
              <span class="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 container mx-auto px-4 py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class PortalLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
