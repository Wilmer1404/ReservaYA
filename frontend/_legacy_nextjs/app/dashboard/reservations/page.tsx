// app/dashboard/reservations/page.tsx
"use client";
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarX, Loader2, AlertCircle, CalendarClock } from "lucide-react"; // Importar CalendarClock
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/sidebar";
// Importar AlertDialog para confirmación
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// Utilidad para formatear fechas (opcional, puedes usar otra librería si prefieres)
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formato en español

// Interfaz para el Usuario (simplificada, solo lo necesario)
interface ReservationUser {
  id: number;
  name: string;
}

// Interfaz para el Espacio (simplificada)
interface ReservationSpace {
  id: number;
  name: string;
}

// Interfaz completa para la Reserva (ajusta según tu backend)
interface Reservation {
  id: number;
  user: ReservationUser; // Objeto usuario
  space: ReservationSpace; // Objeto espacio
  startTime: string; // Recibimos como string ISO 8601
  endTime: string; // Recibimos como string ISO 8601
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING' | string; // Añadir otros estados si existen
}

export default function ReservationsPage() {
  // Estados
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para confirmación de cancelación
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // --- FUNCIÓN PARA OBTENER RESERVAS ---
  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Reservation[]>('/reservations');
      // Ordenar por fecha de inicio (más recientes primero)
      const sortedReservations = response.data.sort((a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setReservations(sortedReservations);
      console.log("Reservas cargadas:", sortedReservations);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("No se pudo cargar las reservas. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- USEEFFECT PARA CARGAR DATOS ---
  useEffect(() => {
    fetchReservations();
  }, []);

  // --- FUNCIÓN PARA CANCELAR RESERVA ---
  const handleCancelReservation = async () => {
    if (!reservationToCancel) return;

    setIsCancelling(true);
    setError(null); // Limpiar errores previos

    try {
      // Llamada DELETE al backend
      await api.delete(`/reservations/${reservationToCancel.id}`);
      console.log(`Reserva ID ${reservationToCancel.id} cancelada`);
      setReservationToCancel(null); // Cerrar confirmación
      fetchReservations(); // Recargar la lista
      // Mostrar notificación de éxito (opcional)
      // toast({ title: "Reserva Cancelada", description: "La reserva ha sido cancelada exitosamente." });
    } catch (err: any) {
      console.error("Error cancelling reservation:", err);
      setError(err.response?.data?.message || "No se pudo cancelar la reserva.");
      // Mantener diálogo abierto para mostrar error
    } finally {
      setIsCancelling(false);
    }
  };

  // --- FUNCIÓN PARA FORMATEAR FECHA Y HORA ---
  const formatDateTime = (isoString: string) => {
    try {
      // Formato: "dd MMM yyyy, HH:mm" (ej: 27 Oct 2025, 14:30)
      return format(new Date(isoString), 'PPp', { locale: es });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha inválida";
    }
  };

  // --- FUNCIÓN PARA RENDERIZAR TABLA ---
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
            </TableRow>
          ))}
        </>
      );
    }

    if (error && reservations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center text-red-600">
            <AlertCircle className="inline-block w-5 h-5 mr-2" /> {error}
            <Button onClick={fetchReservations} variant="link" size="sm" className="ml-2">Reintentar</Button>
          </TableCell>
        </TableRow>
      );
    }

    if (reservations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center text-slate-500">
            <CalendarClock className="inline-block w-6 h-6 mr-2" /> No hay reservas registradas todavía.
          </TableCell>
        </TableRow>
      );
    }

    // Renderizar filas de reservas
    return (
      <>
        {reservations.map((res) => (
          <TableRow key={res.id}>
            <TableCell className="font-medium">{res.id}</TableCell>
            <TableCell>{res.space.name || 'Espacio no encontrado'}</TableCell>
            <TableCell>{res.user.name || 'Usuario no encontrado'}</TableCell>
            <TableCell>{formatDateTime(res.startTime)}</TableCell>
            <TableCell>{formatDateTime(res.endTime)}</TableCell>
            <TableCell>
              <Badge
                variant={
                  res.status === 'CONFIRMED' ? 'success' :
                    res.status === 'CANCELLED' ? 'destructive' :
                      res.status === 'PENDING' ? 'warning' : 'secondary'
                }
              >
                {res.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {/* Botón Cancelar con Confirmación */}
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost" // O 'destructive' si prefieres
                  size="icon"
                  onClick={() => {
                    setError(null); // Limpiar error
                    setReservationToCancel(res);
                  }}
                  disabled={res.status === 'CANCELLED'} // No cancelar si ya está cancelada
                  title={res.status === 'CANCELLED' ? "Reserva ya cancelada" : "Cancelar reserva"}
                  className="h-8 w-8 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CalendarX className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="reservations" />
      
      <main className="flex-1 overflow-auto md:ml-0">
        <AlertDialog> {/* Envolver en AlertDialog */}
          <div className="p-6 md:p-10">
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Historial de Reservas</h1>
            <p className="text-slate-600">
              Visualiza y gestiona todas las reservas de tu institución.
            </p>
          </div>
          {/* Podríamos añadir un botón para ir a la vista de calendario/crear reserva */}
          {/* <Button>Ver Calendario</Button> */}
        </div>

        {/* Tabla */}
        <div className="rounded-lg border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Espacio</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right w-[80px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </div>

        {/* --- DIÁLOGO DE CONFIRMACIÓN DE CANCELACIÓN --- */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmas la cancelación?</AlertDialogTitle>
            <AlertDialogDescription>
              Se cancelará la reserva #{reservationToCancel?.id} para el espacio{' '}
              <span className="font-semibold">{reservationToCancel?.space.name}</span> del usuario{' '}
              <span className="font-semibold">{reservationToCancel?.user.name}</span>{' '}
              ({formatDateTime(reservationToCancel?.startTime || '')}). Esta acción no se puede deshacer fácilmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {/* Mostrar error de cancelación si ocurre */}
          {error && isCancelling && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setReservationToCancel(null)}
              disabled={isCancelling}
            >
              No, mantener reserva
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelReservation}
              disabled={isCancelling}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cancelando...
                </>
              ) : (
                'Sí, cancelar reserva'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
          </div>
        </AlertDialog>
      </main>
    </div>
  );
}