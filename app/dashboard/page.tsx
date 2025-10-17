"use client"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { StatCard } from "@/components/dashboard/stat-card" // Componente reutilizable
import { Button } from "@/components/ui/button"
import { Calendar, Users, Grid3x3, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPageContent() {
  const stats = [
    { label: "Espacios activos", value: "12", Icon: Grid3x3, color: "bg-blue-100 text-blue-600" },
    { label: "Reservas hoy", value: "8", Icon: Calendar, color: "bg-green-100 text-green-600" },
    { label: "Usuarios registrados", value: "245", Icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Tasa de ocupación", value: "78%", Icon: TrendingUp, color: "bg-orange-100 text-orange-600" },
  ]

  const recentReservations = [
    {
      id: 1,
      space: "Cancha de fútbol A",
      user: "Juan García",
      date: "Hoy, 14:00 - 15:30",
      status: "confirmada",
    },
    {
      id: 2,
      space: "Sala de estudio 1",
      user: "María López",
      date: "Hoy, 15:00 - 17:00",
      status: "confirmada",
    },
    {
      id: 3,
      space: "Laboratorio de química",
      user: "Carlos Rodríguez",
      date: "Mañana, 09:00 - 11:00",
      status: "pendiente",
    },
    {
      id: 4,
      space: "Cancha de básquet",
      user: "Ana Martínez",
      date: "Mañana, 16:00 - 17:30",
      status: "confirmada",
    },
  ]

  return (
    <DashboardPage
      activeTab="dashboard"
      title="Panel principal"
      description="Bienvenido a tu panel de control"
      button={
        <Link href="/dashboard/spaces">
          <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Agregar espacio
          </Button>
        </Link>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent Reservations */}
      {/* ... tu tabla de reservaciones recientes ... */}
    </DashboardPage>
  )
}