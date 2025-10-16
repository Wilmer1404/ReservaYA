"use client"

import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Mail, Phone, Calendar } from "lucide-react"

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: "Juan García",
      email: "juan@example.com",
      phone: "+34 612 345 678",
      joinDate: "2025-01-15",
      reservations: 12,
    },
    {
      id: 2,
      name: "María López",
      email: "maria@example.com",
      phone: "+34 623 456 789",
      joinDate: "2025-02-20",
      reservations: 8,
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      phone: "+34 634 567 890",
      joinDate: "2025-03-10",
      reservations: 15,
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana@example.com",
      phone: "+34 645 678 901",
      joinDate: "2025-04-05",
      reservations: 6,
    },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="users" />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>
              <p className="text-slate-600 mt-2">Gestiona los usuarios de tu institución</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Agregar usuario
            </Button>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                    ⋮
                  </Button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{user.name}</h3>

                <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Se unió: {user.joinDate}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{user.reservations}</span> reservas realizadas
                  </p>
                </div>

                <Button variant="outline" className="w-full border-slate-300 bg-transparent">
                  Ver perfil
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
