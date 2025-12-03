import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardService } from '../../../core/services/dashboard.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-8 p-6 md:p-10">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Reportes y Métricas</h1>
        <p class="text-slate-600">Análisis del uso de espacios en la institución.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div class="p-3 bg-blue-100 rounded-lg text-blue-600">
            <lucide-icon name="trending-up" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Tasa de Ocupación</p>
            <h3 class="text-2xl font-bold text-slate-900">{{ occupancyRate }}%</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col">
          <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <lucide-icon name="bar-chart-3" class="w-5 h-5 text-slate-400"></lucide-icon>
            Reservas por Día (Semana Actual)
          </h3>
          <div class="flex-1 relative w-full">
            <canvas #barCanvas></canvas>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col">
          <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <lucide-icon name="pie-chart" class="w-5 h-5 text-slate-400"></lucide-icon>
            Distribución por Tipo
          </h3>
          <div class="flex-1 relative w-full flex justify-center">
            <canvas #doughnutCanvas></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('barCanvas') barCanvas!: ElementRef;
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;

  private dashboardService = inject(DashboardService);
  occupancyRate: number = 0;

  // Variables para guardar las instancias de los gráficos y poder actualizarlos/destruirlos
  private barChartInstance: any;
  private doughnutChartInstance: any;

  ngOnInit() {
    // La carga inicial de datos se hace mejor en ngAfterViewInit para asegurar que el canvas existe
  }

  ngAfterViewInit() {
    this.loadAnalyticsData();
  }

  loadAnalyticsData() {
    this.dashboardService.getAnalytics().subscribe({
      next: (data) => {
        this.occupancyRate = data.occupancyRate;
        this.createBarChart(data.weeklyReservations);
        this.createDoughnutChart(data.reservationsByType);
      },
      error: (err) => console.error('Error cargando analíticas', err),
    });
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
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { display: false } },
          x: { grid: { display: false }, border: { display: false } },
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
            data: data.length ? data : [1],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6'],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
        },
      },
    });
  }
}
