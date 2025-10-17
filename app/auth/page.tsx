"use client"

import type React from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import api from '@/lib/api'; // Importamos nuestro cliente Axios centralizado
import { useAuthStore } from "@/store/auth-store"; // Importamos nuestro store de Zustand

export default function AuthPage() {
  const router = useRouter();
  const { setToken } = useAuthStore(); // Obtenemos la función para guardar el token del store
  
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    name: "", // Campo para el nombre en el registro
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        
        if (response.data && response.data.token) {
          setToken(response.data.token); // Guardamos el token en el store global (y en localStorage)
          router.push('/dashboard');    // Redirigimos al dashboard
        } else {
          throw new Error("Respuesta de login inválida");
        }
      } else { // Lógica de Registro
        if (formData.password !== formData.confirmPassword) {
          setError("Las contraseñas no coinciden.");
          setIsLoading(false);
          return;
        }
        await api.post('/auth/register', {
          name: formData.name, // Asegúrate de que el backend espera "name"
          email: formData.email,
          password: formData.password,
        });
        
        // Opcional: Mostrar un mensaje de éxito y cambiar a la pestaña de login
        alert("¡Registro exitoso! Por favor, inicia sesión para continuar.");
        setActiveTab("login");
        // Limpiamos los campos para el login
        setFormData({ name: "", email: formData.email, password: "", confirmPassword: "" });
      }
    } catch (err: any) {
      console.error("Error de autenticación:", err);
      // Extrae un mensaje de error más útil si está disponible en la respuesta del backend
      const errorMessage = err.response?.data?.message || err.message || "Error en el proceso. Revisa tus credenciales o intenta de nuevo.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            onClick={() => { setActiveTab("login"); setError(null); }}
            className={`flex-1 py-4 px-4 font-medium text-center transition-colors ${activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-600 hover:text-slate-900"}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setActiveTab("register"); setError(null); }}
            className={`flex-1 py-4 px-4 font-medium text-center transition-colors ${activeTab === "register" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-600 hover:text-slate-900"}`}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Ingresar
              </Button>
            </>
          ) : (
            <>
              {/* Register Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Completo</label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Ej: Juan Pérez"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                    disabled={isLoading}
                  />
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Crear cuenta
              </Button>
            </>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
              <p>{error}</p>
            </div>
          )}

          <p className="text-center text-sm text-slate-600 mt-4">
            {activeTab === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => { setActiveTab("register"); setError(null); }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isLoading}
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => { setActiveTab("login"); setError(null); }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isLoading}
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
