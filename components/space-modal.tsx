// components/space-modal.tsx
"use client";

import { useState } from "react";
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

interface SpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpaceCreated: () => void; // Prop para notificar creación
}

// Interfaz para el formulario
// --- CORRECCIÓN AQUÍ: Añadido 'export' ---
export interface SpaceFormData {
  name: string;
  type: string;
  capacity: number;
  image: string; // Emoji o URL
}

export function SpaceModal({ isOpen, onClose, onSpaceCreated }: SpaceModalProps) {
  const [formData, setFormData] = useState<SpaceFormData>({
    name: "",
    type: "study", // Valor por defecto
    capacity: 10, // Valor por defecto
    image: "📚", // Valor por defecto
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("Por favor, completa todos los campos correctamente.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/spaces', formData);
      console.log("Space created successfully:", response.data);
      
      onSpaceCreated(); // Llamar a la función del padre

      // Limpiar formulario
      setFormData({
        name: "",
        type: "study",
        capacity: 10,
        image: "📚",
      });
      // onSpaceCreated se encarga de cerrar el modal
    } catch (err: any) {
      console.error("Error creating space:", err);
      setError(err.response?.data?.message || "No se pudo crear el espacio. Inténtalo de nuevo.");
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
            <DialogTitle>Crear nuevo espacio</DialogTitle>
            <DialogDescription>
              Completa los detalles de tu nuevo espacio.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ej: Laboratorio de Química"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="col-span-3 w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="study">Sala de Estudio</option>
                <option value="lab">Laboratorio</option>
                <option value="sports">Cancha Deportiva</option>
                <option value="meeting">Sala de Reuniones</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacidad
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                className="col-span-3"
                min="1"
                disabled={isLoading}
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Emoji/Img
              </Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ej: 🔬"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Espacio'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}