"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"; // Importar useRouter para la redirección
import { useAuth } from "@/context/AuthContext"; // Importar el contexto de autenticación
import {
  Calendar,
  Settings,
  Users,
  Grid3x3,
  Menu,
  X,
  Clock,
  BarChart3,
  LogOut // Importar el ícono de LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeTab?: string
}

export function Sidebar({ activeTab = "dashboard" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();
  const { logout } = useAuth(); // Obtener la función logout del contexto de autenticación

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout(); // Limpia el estado de autenticación y redirige
  };

  const menuItems = [
    { id: "dashboard", label: "Panel principal", icon: Grid3x3, href: "/dashboard" },
    { id: "spaces", label: "Mis espacios", icon: Calendar, href: "/dashboard/spaces" },
    { id: "horarios", label: "Horarios", icon: Clock, href: "/dashboard/horarios" },
    { id: "reservations", label: "Reservas", icon: Calendar, href: "/dashboard/reservations" },
    { id: "analytics", label: "Análisis", icon: BarChart3, href: "/dashboard/analytics" },
    { id: "users", label: "Usuarios", icon: Users, href: "/dashboard/users" },
    { id: "settings", label: "Configuración", icon: Settings, href: "/dashboard/settings" },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">ReservaYA</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Button
            onClick={handleLogout} // Asignar la función de logout al evento onClick
            variant="outline"
            className="w-full text-slate-300 border-slate-700 hover:bg-slate-800 bg-transparent flex items-center justify-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}