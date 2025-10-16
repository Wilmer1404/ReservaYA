"use client"

import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Users, Clock } from "lucide-react"
import { useState } from "react"
import { SpaceModal, type SpaceFormData } from "@/components/space-modal"

interface Space extends SpaceFormData {
  availability: string
  reservations: number
}

export default function SpacesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)
  const [spaces, setSpaces] = useState<Space[]>([
    {
      id: 1,
      name: "Cancha de fútbol A",
      type: "sports",
      capacity: 22,
      availability: "Disponible",
      reservations: 5,
      image: "⚽",
    },
    {
      id: 2,
      name: "Sala de estudio 1",
      type: "study",
      capacity: 30,
      availability: "Disponible",
      reservations: 8,
      image: "📚",
    },
    {
      id: 3,
      name: "Laboratorio de química",
      type: "lab",
      capacity: 25,
      availability: "Ocupado",
      reservations: 3,
      image: "🧪",
    },
    {
      id: 4,
      name: "Cancha de básquet",
      type: "sports",
      capacity: 20,
      availability: "Disponible",
      reservations: 6,
      image: "🏀",
    },
    {
      id: 5,
      name: "Sala de conferencias",
      type: "meeting",
      capacity: 50,
      availability: "Disponible",
      reservations: 4,
      image: "🎤",
    },
    {
      id: 6,
      name: "Biblioteca",
      type: "library",
      capacity: 100,
      availability: "Disponible",
      reservations: 12,
      image: "📖",
    },
  ])

  const spaceTypes = {
    sports: "Deporte",
    study: "Estudio",
    lab: "Laboratorio",
    meeting: "Reunión",
    library: "Biblioteca",
  }

  const handleOpenModal = (space?: Space) => {
    if (space) {
      setEditingSpace(space)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSpace(null)
  }

  const handleSaveSpace = (formData: SpaceFormData) => {
    if (editingSpace) {
      // Update existing space
      setSpaces((prev) => prev.map((space) => (space.id === editingSpace.id ? { ...space, ...formData } : space)))
    } else {
      // Create new space
      const newSpace: Space = {
        ...formData,
        id: Math.max(...spaces.map((s) => s.id), 0) + 1,
        availability: "Disponible",
        reservations: 0,
      }
      setSpaces((prev) => [...prev, newSpace])
    }
    handleCloseModal()
  }

  const handleDeleteSpace = (id: number) => {
    setSpaces((prev) => prev.filter((space) => space.id !== id))
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="spaces" />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-8">
          {/* Header */}
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

          {/* Spaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Card
                key={space.id}
                className="border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Space Image */}
                <div className="h-40 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">
                  {space.image}
                </div>

                {/* Space Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900">{space.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{spaceTypes[space.type as keyof typeof spaceTypes]}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      <span>Capacidad: {space.capacity} personas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{space.reservations} reservas este mes</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        space.availability === "Disponible" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {space.availability}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenModal(space)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-300 bg-transparent"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteSpace(space.id!)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-300 text-red-600 hover:text-red-700 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
  )
}
