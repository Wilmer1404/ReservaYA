"use client"

import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TimeSlotCalendar } from "@/components/time-slot-calendar"
import { Download } from "lucide-react"
import { useState } from "react"

export default function HorariosPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const stats = [
    { label: "Espacios disponibles", value: "8", color: "bg-green-100 text-green-600" },
    { label: "Espacios ocupados", value: "4", color: "bg-red-100 text-red-600" },
    { label: "Reservas hoy", value: "12", color: "bg-blue-100 text-blue-600" },
    { label: "Tasa de ocupación", value: "65%", color: "bg-orange-100 text-orange-600" },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="horarios" />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Horarios</h1>
              <p className="text-slate-600 mt-2">Visualiza y gestiona los horarios de tus espacios</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
              <Download className="w-4 h-4 mr-2" />
              Descargar calendario
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-4 border border-slate-200">
                <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <div className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Calendar and Time Slots */}
          <TimeSlotCalendar onDateChange={setSelectedDate} />
        </div>
      </main>
    </div>
  )
}
