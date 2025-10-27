// components/space-modal.tsx
"use client";

import { useState, useEffect } from "react"; // Importar useEffect
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

// Interfaz para datos del espacio (puede ser útil tenerla global o importarla)
interface Space {
  id: number;
  name: string;
  type: string;
  capacity: number;
  image: string | null;
}

// Interfaz para las props del modal
interface SpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Space | null; // Datos para editar, null si es creación
  onSaveSuccess: () => void; // Cambiado nombre para ser más genérico
}

// Interfaz para el estado del formulario
export interface SpaceFormData {
  name: string;
  type: string;
  capacity: number;
  image: string; // Permitimos string vacío
}

export function SpaceModal({ isOpen, onClose, initialData, onSaveSuccess }: SpaceModalProps) {
  const [formData, setFormData] = useState<SpaceFormData>({
    name: "",
    type: "study",
    capacity: 10,
    image: "", // Iniciar vacío o con un emoji por defecto
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData; // Determina si estamos editando

  // Efecto para llenar el form si estamos editando
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        capacity: initialData.capacity,
        image: initialData.image || "", // Usar string vacío si es null
      });
      setError(null); // Limpiar errores
    } else {
      // Resetear para creación
      setFormData({ name: "", type: "study", capacity: 10, image: "📚" });
      setError(null);
    }
  }, [isOpen, isEditing, initialData]); // Dependencias

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) || 0 : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.name || !formData.type || formData.capacity <= 0) {
      setError("Por favor, completa nombre, tipo y capacidad correctamente.");
      setIsLoading(false);
      return;
    }

    try {
      let response;
      const payload = { ...formData, image: formData.image || null }; // Enviar null si image está vacío

      if (isEditing && initialData) {
        // --- LLAMADA PUT PARA ACTUALIZAR ---
        console.log("Actualizando espacio:", initialData.id, payload);
        response = await api.put(`/spaces/${initialData.id}`, payload);
      } else {
        // --- LLAMADA POST PARA CREAR ---
        console.log("Creando espacio:", payload);
        response = await api.post('/spaces', payload);
      }

      console.log(isEditing ? "Space updated:" : "Space created:", response.data);
      onSaveSuccess(); // Notificar al padre (recarga y cierra)

    } catch (err: any) {
      console.error("Error saving space:", err);
      setError(err.response?.data?.message || `No se pudo ${isEditing ? 'actualizar' : 'crear'} el espacio.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Espacio" : "Crear Nuevo Espacio"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? `Modifica los detalles del espacio "${initialData?.name}".`
                : "Completa los detalles de tu nuevo espacio."}
            </DialogDescription>
            {isEditing && initialData && (
              <div className="text-sm text-slate-500 pt-2">ID: {initialData.id}</div>
            )}
          </DialogHeader>

          {error && (
            <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4">
            {/* Campos del formulario (iguales para crear y editar) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required disabled={isLoading} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Tipo</Label>
              <select id="type" name="type" value={formData.type} onChange={handleChange} className="col-span-3 w-full px-3 py-2 border border-slate-300 rounded-md text-sm ..." disabled={isLoading}>
                <option value="study">Sala de Estudio</option>
                <option value="lab">Laboratorio</option>
                <option value="sports">Cancha Deportiva</option>
                <option value="meeting">Sala de Reuniones</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacidad</Label>
              <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} className="col-span-3" min="1" required disabled={isLoading} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Emoji/Img</Label>
              <Input id="image" name="image" value={formData.image} onChange={handleChange} className="col-span-3" placeholder="Ej: 🔬 (Opcional)" disabled={isLoading} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={isLoading}>Cancelar</Button></DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : (isEditing ? 'Guardar Cambios' : 'Crear Espacio')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}