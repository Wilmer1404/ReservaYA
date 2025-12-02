import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <div>
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Panel de Control</h1>
      <p class="text-slate-600 mb-6">Resumen rápido de actividad</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ng-container *ngIf="summary$ | async as s">
          <app-stat-card title="Espacios Activos" [value]="s.activeSpaces"></app-stat-card>
          <app-stat-card title="Usuarios Totales" [value]="s.totalUsers"></app-stat-card>
          <app-stat-card title="Reservas Hoy" [value]="s.reservationsToday"></app-stat-card>
        </ng-container>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardHomeComponent {
  private dashboardService = inject(DashboardService);
  summary$ = this.dashboardService.getSummary();
}
