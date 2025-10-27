// app/dashboard/analytics/page.tsx
"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // Necesario para ejes de tiempo
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Adaptador para date-fns
import { es } from 'date-fns/locale'; // Locale español
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { Sidebar } from "@/components/sidebar";
import { subDays, startOfDay, endOfDay, eachDayOfInterval, format, parseISO } from 'date-fns'; // Funciones de date-fns

// Registrar componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale, // Registrar escala de tiempo
  Title,
  Tooltip,
  Legend
);

// Interfaz simplificada para las Reservas (solo necesitamos startTime y space.type)
interface AnalyticsReservation {
  id: number;
  startTime: string; // ISO String
  space: { type: string };
  status: string;
}

// Interfaz para los datos procesados para los gráficos
interface ChartData {
  reservationsLast7Days: { labels: string[]; data: number[] };
  reservationsByType: { labels: string[]; data: number[] };
}

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FUNCIÓN PARA OBTENER Y PROCESAR DATOS ---
  const fetchDataAndProcess = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Obtener todas las reservas (activas)
      const response = await api.get<AnalyticsReservation[]>('/reservations');
      const reservations = response.data.filter(r => r.status !== 'CANCELLED'); // Filtrar canceladas

      // 2. Procesar datos para "Reservas Últimos 7 Días"
      const today = endOfDay(new Date()); // Fin del día de hoy
      const sevenDaysAgo = startOfDay(subDays(today, 6)); // Inicio de hace 7 días (incluyendo hoy)
      const dateInterval = eachDayOfInterval({ start: sevenDaysAgo, end: today }); // Array de fechas en el intervalo

      const reservationsCountByDay: { [key: string]: number } = {};
      dateInterval.forEach(day => {
        reservationsCountByDay[format(day, 'yyyy-MM-dd')] = 0; // Inicializar contador para cada día
      });

      reservations.forEach(res => {
        try {
            const resDate = startOfDay(parseISO(res.startTime)); // Obtener solo la fecha (inicio del día)
            const formattedDate = format(resDate, 'yyyy-MM-dd');
            // Incrementar contador si la fecha está en nuestro intervalo de 7 días
            if (reservationsCountByDay.hasOwnProperty(formattedDate)) {
                 reservationsCountByDay[formattedDate]++;
            }
        } catch (e) {
            console.warn("Error parsing reservation date:", res.startTime, e);
        }
      });

      const reservationsLast7Days = {
        labels: dateInterval.map(day => format(day, 'dd MMM', { locale: es })), // Formato '27 Oct'
        data: dateInterval.map(day => reservationsCountByDay[format(day, 'yyyy-MM-dd')])
      };

      // 3. Procesar datos para "Reservas por Tipo de Espacio"
      const reservationsCountByType: { [key: string]: number } = {};
      reservations.forEach(res => {
        const type = res.space?.type || 'Desconocido';
        reservationsCountByType[type] = (reservationsCountByType[type] || 0) + 1;
      });

      const reservationsByType = {
        labels: Object.keys(reservationsCountByType),
        data: Object.values(reservationsCountByType)
      };

      setChartData({ reservationsLast7Days, reservationsByType });
      console.log("Datos procesados para gráficos:", { reservationsLast7Days, reservationsByType });

    } catch (err) {
      console.error("Error fetching or processing analytics data:", err);
      setError("No se pudieron cargar los datos de analíticas.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- USEEFFECT PARA CARGAR DATOS ---
  useEffect(() => {
    fetchDataAndProcess();
  }, []);

  // --- OPCIONES PARA LOS GRÁFICOS --- (Puedes personalizarlas)
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: true, text: 'Número de Reservas' } },
    scales: { x: { title: { display: true, text: 'Fecha' } }, y: { beginAtZero: true, title: { display: true, text: 'Cantidad' } } }
  };
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // Barras horizontales para mejor lectura de etiquetas
    plugins: { legend: { display: false }, title: { display: true, text: 'Número de Reservas' } },
    scales: { x: { beginAtZero: true, title: { display: true, text: 'Cantidad' } }, y: { title: { display: true, text: 'Tipo de Espacio' } } }
  };


  // --- RENDERIZADO CONDICIONAL ---
  if (error) {
    return (
      <div className="p-6 md:p-10 flex flex-col items-center justify-center text-red-600 bg-red-50 h-[300px] rounded-lg border border-red-200">
         <AlertCircle className="w-12 h-12 mb-4" />
         <h3 className="text-xl font-semibold mb-2">Error al Cargar Analíticas</h3>
         <p className="text-center mb-4">{error}</p>
         <Button onClick={fetchDataAndProcess} variant="destructive">
           <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Reintentar
         </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="analytics" />
      
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Analíticas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico: Reservas Últimos 7 Días */}
        <Card>
          <CardHeader>
            <CardTitle>Reservas en los Últimos 7 Días</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[400px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : chartData ? (
              <Line
                options={lineChartOptions}
                data={{
                  labels: chartData.reservationsLast7Days.labels,
                  datasets: [{
                    label: 'Reservas',
                    data: chartData.reservationsLast7Days.data,
                    borderColor: 'rgb(59, 130, 246)', // Azul
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.1 // Curva suave
                  }],
                }}
              />
            ) : (
               <p className="text-center text-slate-500">No hay datos disponibles.</p>
            )}
          </CardContent>
        </Card>

        {/* Gráfico: Reservas por Tipo de Espacio */}
        <Card>
          <CardHeader>
            <CardTitle>Reservas por Tipo de Espacio (Total)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[400px]">
             {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : chartData ? (
              <Bar
                options={barChartOptions}
                data={{
                  labels: chartData.reservationsByType.labels,
                  datasets: [{
                    label: 'Número de Reservas',
                    data: chartData.reservationsByType.data,
                    backgroundColor: [ // Puedes definir más colores
                      'rgba(59, 130, 246, 0.7)',
                      'rgba(16, 185, 129, 0.7)',
                      'rgba(234, 179, 8, 0.7)',
                      'rgba(139, 92, 246, 0.7)',
                      'rgba(244, 63, 94, 0.7)',
                    ],
                    borderColor: [
                      'rgb(59, 130, 246)',
                      'rgb(16, 185, 129)',
                      'rgb(234, 179, 8)',
                      'rgb(139, 92, 246)',
                      'rgb(244, 63, 94)',
                    ],
                    borderWidth: 1,
                  }],
                }}
              />
             ) : (
               <p className="text-center text-slate-500">No hay datos disponibles.</p>
             )}
          </CardContent>
        </Card>
      </div>
        </div>
      </main>
    </div>
  );
}