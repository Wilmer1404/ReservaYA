import { Component, ElementRef, ViewChild, inject, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardService } from '../../../core/services/dashboard.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-8 p-6 md:p-10 animate-in fade-in duration-500">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Reportes y Métricas</h1>
          <p class="text-slate-600">Análisis del uso de espacios en la institución.</p>
        </div>
        <button (click)="loadData()" class="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Actualizar datos">
          <lucide-icon name="refresh-cw" class="w-5 h-5" [class.animate-spin]="loading()"></lucide-icon>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ng-container *ngIf="loading(); else kpiContent">
           <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-24 animate-pulse"></div>
        </ng-container>

        <ng-template #kpiContent>
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div class="p-3 bg-blue-100 rounded-lg text-blue-600">
              <lucide-icon name="trending-up" class="w-6 h-6"></lucide-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Tasa de Ocupación</p>
              <h3 class="text-2xl font-bold text-slate-900">{{ occupancyRate() }}%</h3>
            </div>
          </div>
        </ng-template>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
          <h3 class="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <lucide-icon name="bar-chart-3" class="w-5 h-5 text-slate-400"></lucide-icon>
            Reservas por Día (Semana Actual)
          </h3>

          <div class="flex-1 relative w-full min-h-0">
            <div *ngIf="loading()" class="absolute inset-0 bg-slate-50 animate-pulse rounded-lg"></div>
            <canvas #barCanvas></canvas>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
          <h3 class="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <lucide-icon name="pie-chart" class="w-5 h-5 text-slate-400"></lucide-icon>
            Distribución por Tipo
          </h3>

          <div class="relative w-full h-full flex items-center justify-center min-h-0">
             <div *ngIf="loading()" class="absolute inset-0 bg-slate-50 animate-pulse rounded-lg w-full h-full"></div>
             <div class="relative w-full h-full max-h-[280px]">
                <canvas #doughnutCanvas></canvas>
             </div>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class AnalyticsComponent implements OnDestroy {
  @ViewChild('barCanvas') barCanvas!: ElementRef;
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;

  private dashboardService = inject(DashboardService);

  loading = signal(true);
  occupancyRate = signal(0);
  analyticsData = signal<any>(null);

  private barChartInstance: any;
  private doughnutChartInstance: any;

  constructor() {
    // Cargar datos al iniciar
    this.loadData();

    effect(() => {
      const data = this.analyticsData();
      const isLoading = this.loading();

      if (data && !isLoading) {
        setTimeout(() => {
          this.renderCharts(data);
        }, 50);
      }
    });
  }

  loadData() {
    this.loading.set(true);
    this.dashboardService.getAnalytics().subscribe({
      next: (data) => {
        this.occupancyRate.set(data.occupancyRate);
        this.analyticsData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando analíticas', err);
        this.loading.set(false);
      },
    });
  }

  renderCharts(data: any) {
    if (this.barCanvas && this.doughnutCanvas) {
      this.createBarChart(data.weeklyReservations);
      this.createDoughnutChart(data.reservationsByType);
    }
  }

  createBarChart(dataPoints: number[]) {
    if (this.barChartInstance) this.barChartInstance.destroy();

    this.barChartInstance = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Reservas',
            data: dataPoints,
            backgroundColor: '#3b82f6',
            borderRadius: 6,
            barThickness: 24,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            padding: 12,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            border: { display: false },
            ticks: { stepSize: 1 }
          },
          x: {
            grid: { display: false },
            border: { display: false }
          },
        },
      },
    });
  }

  createDoughnutChart(typeMap: any) {
    if (this.doughnutChartInstance) this.doughnutChartInstance.destroy();

    const labels = Object.keys(typeMap);
    const data = Object.values(typeMap);

    this.doughnutChartInstance = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels.length ? labels : ['Sin datos'],
        datasets: [
          {
            data: data.length ? data : [1], // Valor dummy si está vacío para que se vea el círculo gris
            backgroundColor: data.length
              ? ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6']
              : ['#e2e8f0'],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%', 
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { size: 12 }
            }
          },
        },
        layout: {
          padding: 10
        }
      },
    });
  }

  ngOnDestroy() {
    if (this.barChartInstance) this.barChartInstance.destroy();
    if (this.doughnutChartInstance) this.doughnutChartInstance.destroy();
  }
}
