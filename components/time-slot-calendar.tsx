"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TimeSlot {
  id: string
  time: string
  space: string
  user: string
  status: "available" | "reserved" | "occupied"
}

interface TimeSlotCalendarProps {
  onDateChange?: (date: Date) => void
}

export function TimeSlotCalendar({ onDateChange }: TimeSlotCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSpace, setSelectedSpace] = useState<string>("all")

  const spaces = [
    { id: "all", name: "Todos los espacios" },
    { id: "cancha-futbol", name: "Cancha de fútbol A" },
    { id: "sala-estudio", name: "Sala de estudio 1" },
    { id: "lab-quimica", name: "Laboratorio de química" },
    { id: "cancha-basquet", name: "Cancha de básquet" },
  ]

  // Generate time slots for the day (8 AM to 6 PM)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const hours = Array.from({ length: 11 }, (_, i) => i + 8) // 8 AM to 6 PM

    hours.forEach((hour) => {
      const time = `${hour.toString().padStart(2, "0")}:00`
      const statuses: Array<"available" | "reserved" | "occupied"> = ["available", "reserved", "occupied"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      slots.push({
        id: `${time}-${selectedSpace}`,
        time,
        space: selectedSpace === "all" ? "Cancha de fútbol A" : selectedSpace,
        user: randomStatus === "available" ? "" : "Usuario " + Math.floor(Math.random() * 100),
        status: randomStatus,
      })
    })

    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      onDateChange?.(date)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      case "reserved":
        return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
      case "occupied":
        return "bg-red-50 border-red-200 hover:bg-red-100"
      default:
        return "bg-slate-50 border-slate-200"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Disponible</span>
        )
      case "reserved":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Reservado</span>
        )
      case "occupied":
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Ocupado</span>
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calendar Sidebar */}
      <div className="lg:col-span-1">
        <Card className="p-4 border border-slate-200">
          <Calendar selected={selectedDate} onSelect={handleDateChange} />
        </Card>

        {/* Space Filter */}
        <Card className="p-4 border border-slate-200 mt-6">
          <h3 className="font-semibold text-slate-900 mb-3">Filtrar por espacio</h3>
          <div className="space-y-2">
            {spaces.map((space) => (
              <button
                key={space.id}
                onClick={() => setSelectedSpace(space.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedSpace === space.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {space.name}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Time Slots */}
      <div className="lg:col-span-3">
        <Card className="border border-slate-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {selectedSpace === "all" ? "Todos los espacios" : spaces.find((s) => s.id === selectedSpace)?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 bg-transparent"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setDate(newDate.getDate() - 1)
                  handleDateChange(newDate)
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 bg-transparent"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setDate(newDate.getDate() + 1)
                  handleDateChange(newDate)
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 border rounded-lg transition-colors cursor-pointer ${getStatusColor(slot.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{slot.time}</p>
                    {slot.user && <p className="text-sm text-slate-600 mt-1">{slot.user}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(slot.status)}
                    {slot.status === "available" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Reservar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
