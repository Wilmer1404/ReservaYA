// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardPage } from "@/components/dashboard/dashboard-page"; // <-- 1. Importar el layout
import { BookOpen, CalendarCheck, Users, Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios"; // <-- 2. Importar tipo de error de Axios

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

// Interfaz para el DTO DashboardSummary del backend
interface DashboardSummary {
  activeSpaces: number;
  totalUsers: number;
  reservationsToday: number;
}

export default function DashboardSummaryPage() { // Renombrado para claridad
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FUNCIÓN PARA OBTENER EL RESUMEN (MEJORADA) ---
  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<DashboardSummary>('/dashboard/summary');
      setSummary(response.data);
      console.log("Resumen del dashboard cargado:", response.data);
    } catch (err) {
      console.error("Error fetching dashboard summary:", err);

      // --- 3. MEJORA CRÍTICA DEL MANEJO DE ERRORES ---
      // Guardamos el mensaje de error real de la API, no uno genérico.
      let errorMessage = "No se pudo cargar el resumen. Inténtalo de nuevo.";
      if (err instanceof AxiosError) {
        // Capturamos el mensaje de error del backend si existe
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      // --- FIN DE LA MEJORA ---

    } finally {
      setIsLoading(false);
    }
  };

  // --- USEEFFECT PARA CARGAR DATOS AL MONTAR ---
  useEffect(() => {
    fetchSummary();
  }, []); // Se ejecuta solo una vez

  // --- FUNCIÓN HELPER PARA RENDERIZAR EL CONTENIDO ---
  // Esto limpia la lógica de retorno principal
  const renderContent = () => {
    // 4. Mostrar Skeletons reales durante la carga
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-[120px] w-full rounded-lg" />
        </div>
      );
    }

    // 5. Mostrar el error detallado
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-red-600 bg-red-50 h-[300px] rounded-lg border border-red-200 p-6">
          <AlertCircle className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error al cargar el resumen</h3>
          {/* Aquí se mostrará el error real (ej: "403 Forbidden") */}
          <p className="text-center mb-4 font-mono bg-red-100 p-2 rounded">{error}</p>
          <Button onClick={fetchSummary} variant="destructive">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Reintentar
          </Button>
        </div>
      );
    }

    // 6. Mostrar tarjetas con datos
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Espacios Activos"
          Icon={BookOpen}
          value={String(summary?.activeSpaces ?? 0)}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Usuarios Totales"
          Icon={Users}
          value={String(summary?.totalUsers ?? 0)}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          label="Reservas Hoy"
          Icon={CalendarCheck}
          value={String(summary?.reservationsToday ?? 0)}
          color="bg-purple-100 text-purple-600"
        />
      </div>
    );
  };

  // --- 7. RENDERIZADO USANDO EL LAYOUT CORRECTO ---
  // Envolvemos todo en el componente <DashboardPage>
  return (
    <DashboardPage
      activeTab="dashboard"
      title="Resumen General"
      description="Visión general de la actividad de la plataforma."
    >
      {renderContent()}
    </DashboardPage>
  );
}