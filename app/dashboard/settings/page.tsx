"use client"

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Lock, Bell, Shield } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    institutionName: "Universidad Nacional",
    email: "admin@universidad.com",
    phone: "+34 912 345 678",
    address: "Calle Principal 123, Madrid",
    notifications: true,
    emailAlerts: true,
    twoFactor: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="settings" />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
            <p className="text-slate-600 mt-2">Gestiona la configuración de tu institución</p>
          </div>

          {/* General Settings */}
          <Card className="p-6 border border-slate-200 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Información general</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la institución</label>
                <input
                  type="text"
                  name="institutionName"
                  value={settings.institutionName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
                <textarea
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 border border-slate-200 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-slate-700">Recibir notificaciones de nuevas reservas</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="emailAlerts"
                  checked={settings.emailAlerts}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-slate-700">Recibir alertas por correo electrónico</span>
              </label>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Seguridad
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900">Autenticación de dos factores</p>
                    <p className="text-sm text-slate-600">Añade una capa extra de seguridad a tu cuenta</p>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="twoFactor"
                    checked={settings.twoFactor}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                </label>
              </div>
              <Button variant="outline" className="border-slate-300 bg-transparent">
                Cambiar contraseña
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
