"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    institutionName: "",
    institutionType: "university",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      {/* Back to home link */}
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Volver</span>
      </Link>

      <Card className="w-full max-w-md border-0 shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white rounded-t-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl">ReservaYA</span>
          </div>
          <p className="text-blue-50 text-sm">Gestión de espacios simplificada</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-4 px-4 font-medium text-center transition-colors ${activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-4 px-4 font-medium text-center transition-colors ${activeTab === "register"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {activeTab === "login" ? (
            <>
              {/* Login Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Correo institucional</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="tu@institucion.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-slate-600">Recuérdame</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">Ingresar</Button>
            </>
          ) : (
            <>
              {/* Register Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la institución</label>
                  <Input
                    type="text"
                    name="institutionName"
                    placeholder="Universidad Nacional"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de institución</label>
                  <select
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="university">Universidad</option>
                    <option value="school">Colegio</option>
                    <option value="sports">Centro Deportivo</option>
                    <option value="library">Biblioteca</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Correo institucional</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="admin@institucion.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar contraseña</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" required />
                  <span className="text-slate-600">Acepto los términos y condiciones</span>
                </label>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-2">Crear cuenta</Button>
            </>
          )}

          <p className="text-center text-sm text-slate-600 mt-4">
            {activeTab === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </form>
      </Card>
    </div>
  )
}
