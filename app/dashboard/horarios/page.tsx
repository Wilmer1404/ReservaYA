// app/dashboard/horarios/page.tsx
"use client";
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

import { useState, useEffect } from 'react';
import { TimeSlotCalendar } from '@/components/time-slot-calendar';
import api from '@/lib/api';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sidebar } from "@/components/sidebar";

// Interfaz para los datos de Reserva necesarios para el calendario
// Mantenlo simple, solo startTime y endTime son estrictamente necesarios para mostrar
interface CalendarReservation {
  id: number;
  startTime: string; // String ISO
  endTime: string; // String ISO
  space?: { id: number; name: string }; // Opcional: para mostrar/tooltips
  user?: { id: number; name: string }; // Opcional: para mostrar/tooltips
  status?: string; // Opcional: útil para filtrar CANCELLED
}

export default function HorariosPage() {
  const [reservations, setReservations] = useState<CalendarReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener las reservas
  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<CalendarReservation[]>('/reservations');
      // Filtrar reservas canceladas antes de pasarlas al calendario
      const activeReservations = response.data.filter(res => res.status !== 'CANCELLED');
      setReservations(activeReservations);
      console.log("Reservas activas cargadas para calendario:", activeReservations);
    } catch (err) {
      console.error("Error fetching reservations for calendar:", err);
      setError("No se pudo cargar el horario. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener datos al montar el componente
  useEffect(() => {
    fetchReservations();
  }, []);

  // Renderizado condicional basado en el estado
  const renderCalendar = () => {
    if (isLoading) {
      // Mostrar skeleton loader mientras se obtienen los datos
      return (
        <div className="p-6 md:p-10 space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      );
    }

    if (error) {
      // Mostrar mensaje de error
      return (
        <div className="p-6 md:p-10 flex flex-col items-center justify-center text-red-600 bg-red-50 h-[300px] rounded-lg border border-red-200">
          <AlertCircle className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error al cargar horarios</h3>
          <p className="text-center mb-4">{error}</p>
          <Button onClick={fetchReservations} variant="destructive">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Reintentar
          </Button>
        </div>
      );
    }

    // Renderizar el calendario con las reservas obtenidas
    return (
      <TimeSlotCalendar
        reservations={reservations} // Pasar las reservas obtenidas
        // Opcional: Añadir manejadores si quieres permitir crear reservas desde clics en el calendario
        // onSlotSelect={(slotInfo) => console.log('Slot selected:', slotInfo)}
        // onEventSelect={(eventInfo) => console.log('Event selected:', eventInfo)}
      />
    );
  };


  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="horarios" />
      
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Horarios de Espacios</h1>
          {/* Renderizar calendario, cargador o error */}
          {renderCalendar()}
        </div>
      </main>
    </div>
  );
}