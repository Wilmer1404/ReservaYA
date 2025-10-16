"use client"

import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Grid3x3, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    { label: "Espacios activos", value: "12", icon: Grid3x3, color: "bg-blue-100 text-blue-600" },
    { label: "Reservas hoy", value: "8", icon: Calendar, color: "bg-green-100 text-green-600" },
    { label: "Usuarios registrados", value: "245", icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Tasa de ocupación", value: "78%", icon: TrendingUp, color: "bg-orange-100 text-orange-600" },
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
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="dashboard" />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Panel principal</h1>
              <p className="text-slate-600 mt-2">Bienvenido a tu panel de control</p>
            </div>
            <Link href="/dashboard/spaces">
              <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Agregar espacio
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-6 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Reservations */}
          <Card className="border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Reservas recientes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Espacio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Usuario</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Fecha y hora</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900">{reservation.space}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{reservation.user}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{reservation.date}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reservation.status === "confirmada"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {reservation.status}
                        </span>
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
