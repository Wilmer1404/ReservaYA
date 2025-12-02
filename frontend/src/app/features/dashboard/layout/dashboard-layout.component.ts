import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Sidebar fijo -->
      <app-sidebar />

      <!-- Área de contenido principal -->
      <!-- ml-64 empuja el contenido para que no quede debajo del sidebar -->
      <main class="flex-1 ml-64 transition-all min-h-screen">
        <div class="container mx-auto p-8">
          <!-- Aquí se renderizan tus componentes (Spaces, Users, etc.) -->
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardLayoutComponent {}
