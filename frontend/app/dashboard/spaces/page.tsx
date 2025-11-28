// app/dashboard/spaces/page.tsx
"use client";
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
  Edit, // Importar icono Edit
  Trash2, // Importar icono Trash2
} from "lucide-react";
import { SpaceModal } from "@/components/space-modal";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/sidebar";
// Importar AlertDialog
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

// Interfaz Space (igual que en modal)
interface Space {
  id: number;
  name: string;
  type: string;
  capacity: number;
  image: string | null;
}

// Mapa de iconos
const iconMap: { [key: string]: React.ElementType } = {
  sports: Dumbbell, lab: Microscope, study: BookOpen, meeting: Users2,
};

export default function SpacesPage() {
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NUEVOS ESTADOS PARA EDICIÓN Y ELIMINACIÓN ---
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const fetchSpaces = async () => {
    // ... (sin cambios) ...
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

  useEffect(() => { fetchSpaces(); }, []);

  // --- FUNCIONES HANDLER ---
  const handleCreateSpace = () => {
    setEditingSpace(null); // Asegura modo creación
    setShowSpaceModal(true);
  };

  const handleEditSpace = (space: Space) => {
    setEditingSpace(space); // Pasa datos para editar
    setShowSpaceModal(true);
  };

  const handleDeleteSpace = async () => {
    if (!spaceToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await api.delete(`/spaces/${spaceToDelete.id}`);
      console.log(`Espacio ID ${spaceToDelete.id} eliminado`);
      setSpaceToDelete(null); // Cierra diálogo
      fetchSpaces(); // Recarga lista
      // Opcional: toast de éxito
    } catch (err: any) {
      console.error("Error deleting space:", err);
      setError(err.response?.data?.message || "No se pudo eliminar el espacio.");
    } finally {
      setIsDeleting(false);
    }
  };


  const renderContent = () => {
    // ... (código para isLoading, error, spaces.length === 0 sin cambios) ...
    if (isLoading) { /* ... Skeletons ... */ return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3].map((n) => (<Card key={n}><CardHeader><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-4 w-1/3" /></CardContent><CardFooter className="flex justify-end gap-2"><Skeleton className="h-8 w-16" /><Skeleton className="h-8 w-16" /></CardFooter></Card>))}</div>); }
    if (error) { /* ... Mensaje de error con botón reintentar ... */ return (<div className="flex flex-col items-center justify-center text-red-600 bg-red-50 p-6 ..."><AlertCircle className="w-12 h-12 mb-4" /><h3 className="text-xl ...">Error al cargar</h3><p>{error}</p><Button onClick={fetchSpaces} variant="destructive"><Loader2 className="w-4 h-4 mr-2 animate-spin" />Reintentar</Button></div>); }
    if (spaces.length === 0) { /* ... Mensaje de vacío con botón crear ... */ return (<div className="flex flex-col items-center justify-center text-center p-6 ..."><BookOpen className="w-12 h-12 ..." /><h3 className="text-xl ...">Aún no has creado ningún espacio</h3><p>...</p><Button onClick={handleCreateSpace} className="mt-4"><Plus className="w-4 h-4 mr-2" />Crear tu primer espacio</Button></div>); }


    // --- RENDERIZADO DE TARJETAS CON BOTONES HABILITADOS ---
    return (
      <AlertDialog> {/* Envolver aquí para usar AlertDialogTrigger dentro del map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => {
            const Icon = iconMap[space.type] || BookOpen;
            return (
              <Card key={space.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Icon className="w-5 h-5 text-blue-600" />{space.name}</CardTitle>
                  <CardDescription>Tipo: {space.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center gap-2 text-slate-700"><Users2 className="w-4 h-4 text-slate-500" />Capacidad: {space.capacity} personas</p>
                  {space.image && (<p className="mt-4 text-4xl">{space.image}</p>)}
                </CardContent>
                {/* --- BOTONES HABILITADOS --- */}
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditSpace(space)}>
                    <Edit className="w-4 h-4 mr-1" /> Editar {/* Añadido icono y texto */}
                  </Button>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => { setError(null); setSpaceToDelete(space); }}>
                      <Trash2 className="w-4 h-4 mr-1" /> Eliminar {/* Añadido icono y texto */}
                    </Button>
                  </AlertDialogTrigger>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* --- DIÁLOGO DE CONFIRMACIÓN DE BORRADO (Contenido) --- */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmas la eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará permanentemente el espacio{' '}
              <span className="font-semibold">{spaceToDelete?.name}</span>.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && isDeleting && (<p className="text-sm text-red-600 ...">{error}</p>)}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSpaceToDelete(null)} disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSpace} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando...</> : 'Sí, eliminar espacio'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="spaces" />
      
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-6 md:p-10">
          <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold ...">Gestión de Espacios</h1>
          <p className="text-slate-600 ...">Crea, edita y administra...</p>
        </div>
        <Button onClick={handleCreateSpace}> {/* Usar handleCreateSpace */}
          <Plus className="w-4 h-4 mr-2" />Crear Espacio
        </Button>
      </div>

      {renderContent()}

      {/* --- MODAL PARA CREAR/EDITAR ESPACIO --- */}
      <SpaceModal
        isOpen={showSpaceModal}
        onClose={() => setShowSpaceModal(false)}
        initialData={editingSpace} // Pasa datos si estamos editando
        onSaveSuccess={() => { // Usar nombre de prop actualizado
          console.log("SpaceModal reportó guardado, actualizando lista...");
          fetchSpaces(); // Recarga lista
          setShowSpaceModal(false); // Cierra modal
        }}
      />
      {/* El AlertDialogTrigger está dentro del renderContent */}
        </div>
      </main>
    </div>
  );
}