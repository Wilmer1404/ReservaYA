import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-50">
      <app-sidebar />
      <main class="pl-64 transition-all">
        <div class="container mx-auto p-8">
          <router-outlet></router-outlet>
          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-4">Bienvenido al Panel de Control</h1>
            <p class="text-slate-600">Selecciona una opción del menú lateral para comenzar a gestionar Reservas, Espacios y Usuarios.</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardLayoutComponent {}
