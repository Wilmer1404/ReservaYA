import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  template: `
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Bienvenido al Panel de Control</h1>
      <p class="text-slate-600">Selecciona una opción del menú lateral para comenzar a gestionar Reservas, Espacios y Usuarios.</p>
    </div>
  `,
  styles: []
})
export class DashboardHomeComponent {
}
