'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api'; // Importamos la instancia de Axios configurada
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CalendarOff, Loader2 } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';

// Definimos la estructura de la reserva (simplificada)
interface Reservation {
  id: number;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  space: {
    id: number;
    name: string;
    type: string;
  };
  // Añadir más campos si es necesario
}

export default function MisReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook para cargar los datos
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Usamos el endpoint que probamos en el backend
        const response = await api.get<Reservation[]>('/reservations/my-reservations');
        // Filtramos para mostrar solo las activas primero
        const sortedReservations = response.data.sort((a, b) => 
          a.status === 'CONFIRMED' ? -1 : 1
        );
        setReservations(sortedReservations);
      } catch (err: any) {
        console.error(err);
        setError('No se pudieron cargar tus reservas. Intenta de nuevo.');
        toast.error('Error al cargar reservas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Handler para cancelar
  const handleCancel = async (reservationId: number) => {
    const toastId = toast.loading('Cancelando reserva...');
    try {
      // Usamos el endpoint de cancelación que probamos
      await api.delete(`/reservations/${reservationId}`);
      
      // Actualizamos el estado local para reflejar el cambio
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: 'CANCELLED' } : res
        )
      );
      toast.dismiss(toastId);
      toast.success('Reserva cancelada exitosamente');
    } catch (err: any) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'No se pudo cancelar la reserva.');
    }
  };
  
  // Formateador de fecha simple
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg">Cargando tus reservas...</span>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Mis Reservas</h1>
      {reservations.length === 0 ? (
         <Card className="border-dashed text-center">
            <CardHeader>
                <CardTitle className="flex justify-center">
                    <CalendarOff className="h-12 w-12 text-muted-foreground" />
                </CardTitle>
                <CardDescription className="text-lg">
                    No tienes ninguna reserva.
                </CardDescription>
            </CardHeader>
         </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((res) => (
            <Card key={res.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {res.space.name}
                  <Badge variant={res.status === 'CONFIRMED' ? 'default' : 'destructive'}>
                    {res.status}
                  </Badge>
                </CardTitle>
                <CardDescription>Tipo: {res.space.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Inicio:</strong> {formatDate(res.startTime)}</p>
                <p><strong>Fin:</strong> {formatDate(res.endTime)}</p>
              </CardContent>
              <CardFooter>
                {res.status === 'CONFIRMED' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Cancelar Reserva
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Perderás tu reserva para
                          el espacio <strong>{res.space.name}</strong> el día 
                          <strong> {new Date(res.startTime).toLocaleDateString('es-ES')}</strong>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Volver</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleCancel(res.id)}>
                          Sí, cancelar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
