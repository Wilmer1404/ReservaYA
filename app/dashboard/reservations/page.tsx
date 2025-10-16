"use client"

import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, Download } from "lucide-react"
import { useState } from "react"

export default function ReservationsPage() {
  const [filterStatus, setFilterStatus] = useState("all")

  const reservations = [
    {
      id: 1,
      space: "Cancha de fútbol A",
      user: "Juan García",
      date: "2025-10-20",
      time: "14:00 - 15:30",
      status: "confirmada",
      capacity: "22 personas",
    },
    {
      id: 2,
      space: "Sala de estudio 1",
      user: "María López",
      date: "2025-10-20",
      time: "15:00 - 17:00",
      status: "confirmada",
      capacity: "30 personas",
    },
    {
      id: 3,
      space: "Laboratorio de química",
      user: "Carlos Rodríguez",
      date: "2025-10-21",
      time: "09:00 - 11:00",
      status: "pendiente",
      capacity: "25 personas",
    },
    {
      id: 4,
      space: "Cancha de básquet",
      user: "Ana Martínez",
      date: "2025-10-21",
      time: "16:00 - 17:30",
      status: "confirmada",
      capacity: "20 personas",
    },
    {
      id: 5,
      space: "Sala de conferencias",
      user: "Pedro Sánchez",
      date: "2025-10-22",
      time: "10:00 - 12:00",
      status: "cancelada",
      capacity: "50 personas",
    },
    {
      id: 6,
      space: "Biblioteca",
      user: "Laura Fernández",
      date: "2025-10-22",
      time: "13:00 - 15:00",
      status: "confirmada",
      capacity: "100 personas",
    },
  ]

  const filteredReservations =
    filterStatus === "all" ? reservations : reservations.filter((r) => r.status === filterStatus)

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="reservations" />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Reservas</h1>
              <p className="text-slate-600 mt-2">Gestiona todas las reservas de tus espacios</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
              <Download className="w-4 h-4 mr-2" />
              Descargar reporte
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className={filterStatus === "all" ? "bg-blue-600" : "border-slate-300"}
            >
              <Filter className="w-4 h-4 mr-2" />
              Todas
            </Button>
            <Button
              variant={filterStatus === "confirmada" ? "default" : "outline"}
              onClick={() => setFilterStatus("confirmada")}
              className={filterStatus === "confirmada" ? "bg-green-600" : "border-slate-300"}
            >
              Confirmadas
            </Button>
            <Button
              variant={filterStatus === "pendiente" ? "default" : "outline"}
              onClick={() => setFilterStatus("pendiente")}
              className={filterStatus === "pendiente" ? "bg-yellow-600" : "border-slate-300"}
            >
              Pendientes
            </Button>
            <Button
              variant={filterStatus === "cancelada" ? "default" : "outline"}
              onClick={() => setFilterStatus("cancelada")}
              className={filterStatus === "cancelada" ? "bg-red-600" : "border-slate-300"}
            >
              Canceladas
            </Button>
          </div>

          {/* Reservations Table */}
          <Card className="border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Espacio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Usuario</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Hora</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Capacidad</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{reservation.space}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{reservation.user}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{reservation.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{reservation.time}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{reservation.capacity}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reservation.status === "confirmada"
                              ? "bg-green-100 text-green-700"
                              : reservation.status === "pendiente"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          Ver detalles
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
