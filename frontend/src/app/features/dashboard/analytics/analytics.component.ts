import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReservationsService } from '../../../core/services/reservations.service';
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

      <!-- Resumen Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
          <div class="p-3 bg-blue-100 rounded-lg text-blue-600">
            <lucide-icon name="trending-up" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Tasa de Ocupación</p>
            <h3 class="text-2xl font-bold text-slate-900">78%</h3>
            <span class="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <lucide-icon name="arrow-up" class="w-3 h-3"></lucide-icon> +5% vs mes pasado
            </span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
          <div class="p-3 bg-purple-100 rounded-lg text-purple-600">
            <lucide-icon name="users" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Usuarios Activos</p>
            <h3 class="text-2xl font-bold text-slate-900">1,240</h3>
            <span class="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <lucide-icon name="arrow-up" class="w-3 h-3"></lucide-icon> +12 esta semana
            </span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
          <div class="p-3 bg-amber-100 rounded-lg text-amber-600">
            <lucide-icon name="calendar-check" class="w-6 h-6"></lucide-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Reservas Totales</p>
            <h3 class="text-2xl font-bold text-slate-900">8,543</h3>
            <span class="text-xs text-slate-400 font-medium">Desde el inicio</span>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de Barras -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col">
          <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <lucide-icon name="bar-chart-3" class="w-5 h-5 text-slate-400"></lucide-icon>
            Reservas por Día (Semana Actual)
          </h3>
          <div class="flex-1 relative w-full">
            <canvas #barCanvas></canvas>
          </div>
        </div>

        <!-- Gráfico de Dona -->
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
  `
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('barCanvas') barCanvas!: ElementRef;
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;

  ngOnInit() {}

  ngAfterViewInit() {
    this.createBarChart();
    this.createDoughnutChart();
  }

  createBarChart() {
    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Reservas',
          data: [12, 19, 3, 5, 20, 15, 8],
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            border: { display: false }
          },
          x: {
            grid: { display: false },
            border: { display: false }
          }
        }
      }
    });
  }

  createDoughnutChart() {
    new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Laboratorios', 'Deportes', 'Estudio', 'Reuniones'],
        datasets: [{
          data: [35, 25, 25, 15],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
        }
      }
    });
  }
}
