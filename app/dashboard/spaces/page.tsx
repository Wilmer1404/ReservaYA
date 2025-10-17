"use client"

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Users, Loader2 } from "lucide-react";
import { SpaceModal, type SpaceFormData } from "@/components/space-modal";
import api from "@/lib/api";

// Interfaz que coincide con la entidad 'Space' del backend
interface Space {
  id: number;
  name: string;
  type: string;
  capacity: number;
  image: string;
}

const spaceTypes: { [key: string]: string } = {
  sports: "Deporte",
  study: "Estudio",
  lab: "Laboratorio",
  meeting: "Reunión",
  library: "Biblioteca",
};

export default function SpacesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Space[]>("/spaces");
      setSpaces(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar los espacios:", err);
      setError("No se pudieron cargar los espacios. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleOpenModal = (space?: Space) => {
    setEditingSpace(space || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSpace(null);
  };

  const handleSaveSpace = async (formData: SpaceFormData) => {
    try {
      if (editingSpace) {
        const response = await api.put<Space>(`/spaces/${editingSpace.id}`, formData);
        setSpaces((prev) => prev.map((s) => (s.id === editingSpace.id ? response.data : s)));
      } else {
        const response = await api.post<Space>("/spaces", formData);
        setSpaces((prev) => [...prev, response.data]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error al guardar el espacio:", err);
      alert("Hubo un error al guardar el espacio.");
    }
  };

  const handleDeleteSpace = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este espacio?")) {
      try {
        await api.delete(`/spaces/${id}`);
        setSpaces((prev) => prev.filter((space) => space.id !== id));
      } catch (err) {
        console.error("Error al eliminar el espacio:", err);
        alert("Hubo un error al eliminar el espacio.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="spaces" />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mis espacios</h1>
              <p className="text-slate-600 mt-2">Gestiona todos tus espacios disponibles</p>
            </div>
            <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Agregar nuevo espacio
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : error ? (
            <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space) => (
                <Card key={space.id} className="border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">{space.image}</div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900">{space.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{spaceTypes[space.type] || 'Desconocido'}</p>
                    <div className="space-y-2 my-4 pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>Capacidad: {space.capacity} personas</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleOpenModal(space)} variant="outline" size="sm" className="flex-1 border-slate-300 bg-transparent">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button onClick={() => handleDeleteSpace(space.id)} variant="outline" size="sm" className="flex-1 border-slate-300 text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <SpaceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSpace}
        initialData={editingSpace || undefined}
        isEditing={!!editingSpace}
      />
    </div>
  );
}