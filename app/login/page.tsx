"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth-store"
import api from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const { setToken } = useAuthStore()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Intentando login con:", formData)
      console.log("URL de API:", process.env.NEXT_PUBLIC_API_BASE_URL)
      
      const response = await api.post('/auth/login', formData)
      console.log("Respuesta del servidor:", response.data)
      
      if (response.data.token) {
        setToken(response.data.token)
        toast({
          title: "¡Éxito!",
          description: "Has iniciado sesión correctamente",
        })
        router.push('/dashboard')
      } else {
        throw new Error("No se recibió token del servidor")
      }
    } catch (error: any) {
      console.error("Error completo en login:", error)
      console.error("Error response:", error.response)
      console.error("Error message:", error.message)
      
      let errorMessage = "Error desconocido"
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data)
      } else if (error.message) {
        errorMessage = error.message
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = "No se pudo conectar al servidor. Verifica que esté ejecutándose."
      }
      
      toast({
        variant: "destructive",
        title: "Error en el login",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title="Inicia sesión" description="Accede a tu panel de control">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 py-2"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
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