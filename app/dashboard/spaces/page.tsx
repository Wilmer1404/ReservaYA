// app/dashboard/spaces/page.tsx
"use client";

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dumbbell,
  Microscope,
  Plus,
  BookOpen,
  Users2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { SpaceModal } from "@/components/space-modal";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Definir la interfaz para los datos de un Espacio
interface Space {
  id: number;
  name: string;
  type: string;
  capacity: number;
  image: string | null;
}

// Mapa de iconos
const iconMap: { [key: string]: React.ElementType } = {
  sports: Dumbbell,
  lab: Microscope,
  study: BookOpen,
  meeting: Users2,
};

export default function SpacesPage() {
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Space[]>('/spaces');
      setSpaces(response.data);
      console.log("Espacios cargados:", response.data);
    } catch (err) {
      console.error("Error fetching spaces:", err);
      setError("No se pudo cargar los espacios. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="flex flex-col justify-between">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-red-600 bg-red-50 p-6 rounded-lg border border-red-200 h-64">
          <AlertCircle className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error al cargar</h3>
          <p className="text-center mb-4">{error}</p>
          <Button onClick={fetchSpaces} variant="destructive">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Reintentar
          </Button>
        </div>
      );
    }

    if (spaces.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-6 rounded-lg border-2 border-dashed border-slate-300 h-64">
          <BookOpen className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            Aún no has creado ningún espacio
          </h3>
          <p className="text-slate-500 mb-4">
            Comienza creando tu primer espacio para que pueda ser reservado.
          </p>
          <Button onClick={() => setShowSpaceModal(true)} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Crear tu primer espacio
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.map((space) => {
          const Icon = iconMap[space.type] || BookOpen;
          return (
            <Card key={space.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-blue-600" />
                  {space.name}
                </CardTitle>
                <CardDescription>Tipo: {space.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="flex items-center gap-2 text-slate-700">
                  <Users2 className="w-4 h-4 text-slate-500" />
                  Capacidad: {space.capacity} personas
                </p>
                {space.image && (
                  <p className="mt-4 text-4xl" title="Emoji/Imagen del espacio">
                    {space.image}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" disabled>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" disabled>
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gestión de Espacios
          </h1>
          <p className="text-slate-600">
            Crea, edita y administra tus espacios disponibles.
          </p>
        </div>
        <Button onClick={() => setShowSpaceModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Espacio
        </Button>
      </div>

      {renderContent()}

      <SpaceModal
        isOpen={showSpaceModal}
        onClose={() => setShowSpaceModal(false)}
        onSpaceCreated={() => {
          console.log("SpaceModal reportó creación, actualizando lista...");
          fetchSpaces();
          setShowSpaceModal(false);
        }}
      />
    </div>
  );
}