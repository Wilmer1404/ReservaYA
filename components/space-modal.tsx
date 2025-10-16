"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface SpaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (space: SpaceFormData) => void
  initialData?: SpaceFormData
  isEditing?: boolean
}

export interface SpaceFormData {
  id?: number
  name: string
  type: string
  capacity: number
  image: string
}

const spaceTypes = [
  { value: "sports", label: "Deporte" },
  { value: "study", label: "Estudio" },
  { value: "lab", label: "Laboratorio" },
  { value: "meeting", label: "Reunión" },
  { value: "library", label: "Biblioteca" },
]

const spaceEmojis = ["⚽", "📚", "🧪", "🏀", "🎤", "📖", "🎨", "🏋️", "🎭", "🖥️"]

export function SpaceModal({ isOpen, onClose, onSave, initialData, isEditing }: SpaceModalProps) {
  const [formData, setFormData] = useState<SpaceFormData>(
    initialData || {
      name: "",
      type: "sports",
      capacity: 20,
      image: "⚽",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      name: "",
      type: "sports",
      capacity: 20,
      image: "⚽",
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-slate-200 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{isEditing ? "Editar espacio" : "Crear nuevo espacio"}</h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del espacio</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Cancha de fútbol A"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de espacio</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {spaceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Capacidad (personas)</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="500"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Icono del espacio</label>
              <div className="grid grid-cols-5 gap-2">
                {spaceEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: emoji }))}
                    className={`p-3 text-2xl rounded-lg border-2 transition-colors ${
                      formData.image === emoji
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-300 bg-transparent"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                {isEditing ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
