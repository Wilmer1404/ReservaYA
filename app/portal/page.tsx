'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CalendarPlus, CalendarCheck } from 'lucide-react';

export default function PortalDashboardPage() {
  // Obtenemos el nombre del usuario desde el store
  const { userName } = useAuthStore();

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Bienvenido, {userName || 'Estudiante'}!
      </h1>
      <p className="text-muted-foreground">
        ¿Qué necesitas hacer hoy?
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Reserva</CardTitle>
            <CardDescription>
              Busca un espacio y resérvalo en el horario que necesites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/portal/reservar">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Reservar un Espacio
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Reservas</CardTitle>
            <CardDescription>
              Consulta, modifica o cancela tus reservas activas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/portal/mis-reservas">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Ver Mis Reservas
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Placeholder para futuras tarjetas */}
        <Card className="border-dashed">
            <CardHeader>
                <CardTitle>Próximamente</CardTitle>
                <CardDescription>
                Aquí podrás ver tu próxima reserva de un vistazo.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Contenido futuro */}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
