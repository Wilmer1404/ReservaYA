"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card" // Componente reutilizable
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login:", formData)
  }

  return (
    <AuthCard title="Inicia sesión" description="Accede a tu panel de control">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... tus campos de input ... */}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2">
          Iniciar sesión
        </Button>
      </form>

      <p className="text-center text-slate-600 mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Regístrate aquí
        </Link>
      </p>
    </AuthCard>
  )
}