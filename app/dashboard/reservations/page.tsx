"use client"

import { DashboardPage } from "@/components/dashboard/dashboard-page" // Componente reutilizable
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
    <DashboardPage
      activeTab="reservations"
      title="Reservas"
      description="Gestiona todas las reservas de tus espacios"
      button={
        <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
          <Download className="w-4 h-4 mr-2" />
          Descargar reporte
        </Button>
      }
    >
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {/* ... tus botones de filtro ... */}
      </div>

      {/* Reservations Table */}
      <Card className="border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* ... tu tabla de reservaciones ... */}
        </div>
      </Card>
    </DashboardPage>
  )
}
