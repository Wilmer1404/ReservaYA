// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/stat-card"; // Componente para mostrar estadísticas

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';
import { BookOpen, CalendarCheck, Users, Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/api"; // Importar API
import { Skeleton } from "@/components/ui/skeleton"; // Importar Skeleton
import { Button } from "@/components/ui/button"; // Para botón Reintentar
import { Sidebar } from "@/components/sidebar";

// Interfaz para el DTO DashboardSummary del backend
interface DashboardSummary {
  activeSpaces: number;
  totalUsers: number;
  reservationsToday: number;
}

export default function DashboardPage() {
  // Estado para guardar los datos del resumen, carga y error
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FUNCIÓN PARA OBTENER EL RESUMEN ---
  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Llamada GET al endpoint /dashboard/summary
      const response = await api.get<DashboardSummary>('/dashboard/summary');
      setSummary(response.data);
      console.log("Resumen del dashboard cargado:", response.data);
    } catch (err) {
      console.error("Error fetching dashboard summary:", err);
      setError("No se pudo cargar el resumen. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- USEEFFECT PARA CARGAR DATOS AL MONTAR ---
  useEffect(() => {
    fetchSummary();
  }, []); // Se ejecuta solo una vez

  // --- RENDERIZADO CONDICIONAL ---

  // Mostrar error si existe
  if (error) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar activeTab="dashboard" />
        <main className="flex-1 overflow-auto md:ml-0">
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-red-600 bg-red-50 h-[300px] rounded-lg border border-red-200">
            <AlertCircle className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error al cargar el resumen</h3>
            <p className="text-center mb-4">{error}</p>
            <Button onClick={fetchSummary} variant="destructive">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Reintentar
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Renderizar tarjetas (con Skeletons si está cargando)
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="dashboard" />
      
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Resumen General</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta Espacios Activos */}
        <StatCard
          label="Espacios Activos"
          Icon={BookOpen}
          value={isLoading ? "..." : String(summary?.activeSpaces ?? 0)}
          color="bg-blue-100 text-blue-600"
        />

        {/* Tarjeta Usuarios Totales */}
        <StatCard
          label="Usuarios Totales"
          Icon={Users}
          value={isLoading ? "..." : String(summary?.totalUsers ?? 0)}
          color="bg-green-100 text-green-600"
        />

        {/* Tarjeta Reservas Hoy */}
        <StatCard
          label="Reservas Hoy"
          Icon={CalendarCheck}
          value={isLoading ? "..." : String(summary?.reservationsToday ?? 0)}
          color="bg-purple-100 text-purple-600"
        />
      </div>

          {/* Aquí podrías añadir más secciones, como un gráfico o una tabla de próximas reservas */}
          {/*
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Próximas Reservas</h2>
            {isLoading ? <Skeleton className="h-64 w-full" /> : <p>Aquí iría la tabla o lista de reservas...</p>}
          </div>
          */}
        </div>
      </main>
    </div>
  );
}