"use client"

import { useState, useEffect } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";

// Interfaces para tipar los datos de la API
interface User {
  id: number;
  name: string;
  email: string;
}

interface Space {
  id: number;
  name: string;
  type: string;
}

interface Reservation {
  id: number;
  user: User;
  space: Space;
  startTime: string;
  endTime: string;
  status: string;
}

// Función para formatear la fecha y hora
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<Reservation[]>("/reservations");
        setReservations(response.data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar las reservas:", err);
        setError("No se pudieron cargar las reservas. Intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Confirmada</span>;
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Pendiente</span>;
      case "cancelled":
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Cancelada</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">{status}</span>;
    }
  };

  return (
    <DashboardPage
      activeTab="reservations"
      title="Reservas"
      description="Gestiona todas las reservas de tus espacios"
      button={
        <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
          <Download className="w-4 h-4 mr-2" />
          Descargar reporte
        </Button>
      }
    >
      <Card className="border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-8">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Espacio</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.space.name}</TableCell>
                    <TableCell>{reservation.user.name}</TableCell>
                    <TableCell>{formatDateTime(reservation.startTime)}</TableCell>
                    <TableCell>{formatDateTime(reservation.endTime)}</TableCell>
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                    No hay reservas para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </DashboardPage>
  );
}