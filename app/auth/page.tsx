"use client"

import type React from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import api from '@/lib/api';
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

export default function AuthPage() {
  const router = useRouter();
  const { setToken, clearAllAuthStorage, token } = useAuthStore();

  // Limpiar automáticamente tokens antiguos al cargar la página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar si hay múltiples entradas de auth en localStorage (indica corrupción)
      const allKeys = Object.keys(localStorage);
      const authKeys = allKeys.filter(key => key.includes('auth'));
      
      if (authKeys.length > 1) {
        // Hay múltiples entradas de auth, limpiar todo
        clearAllAuthStorage();
      }
    }
  }, [clearAllAuthStorage]);

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    name: "",
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

    console.log('🔄 Submitting form:', activeTab, { email: formData.email });

    try {
      if (activeTab === 'login') {
        console.log('🔐 Attempting login...');
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        console.log('✅ Login response:', response.data);

        if (response.data && response.data.token) {
          setToken(response.data.token);
          console.log('🎉 Login successful, redirecting to dashboard');
          router.push('/dashboard');
        } else {
          throw new Error("Respuesta de login inválida - no se recibió token");
        }
      } else { // Lógica de Registro
        if (formData.password !== formData.confirmPassword) {
          setError("Las contraseñas no coinciden.");
          setIsLoading(false);
          return;
        }

        console.log('📝 Attempting registration...');
        const response = await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        console.log('✅ Registration response:', response.data);
        alert("¡Registro exitoso! Por favor, inicia sesión para continuar.");
        setActiveTab("login");
        setFormData({ name: "", email: formData.email, password: "", confirmPassword: "" });
      }
    } catch (err: any) {
      console.error("❌ Error de autenticación:", err);
      
      let errorMessage = "Ocurrió un error inesperado.";
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        errorMessage = "No se puede conectar al servidor. Verifica que el backend esté funcionando en http://localhost:8080";
      } else if (err.response) {
        // Error del servidor con respuesta
        const responseData = err.response.data;
        
        // Detectar errores específicos de JWT y autenticación
        if (err.response.status === 403 || err.response.status === 401) {
          // La limpieza ya se hace automáticamente en el interceptor de API
          errorMessage = "Sesión expirada. Por favor, intenta de nuevo.";
        } else if (typeof responseData === 'string' && (responseData.includes('JWT') || responseData.includes('signature'))) {
          // La limpieza ya se hace automáticamente en el interceptor de API
          errorMessage = "Datos de sesión actualizados. Intenta nuevamente.";
        } else {
          errorMessage = responseData?.message || `Error del servidor: ${err.response.status}`;
        }
      } else if (err.request) {
        // Error de red sin respuesta
        errorMessage = "Error de conexión. Verifica tu conexión a internet y que el backend esté funcionando.";
      } else {
        // Otro tipo de error
        errorMessage = err.message || "Error desconocido";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Volver</span>
      </Link>

      <Card className="w-full max-w-md border-0 shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white rounded-t-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl">ReservaYA</span>
          </div>
          <p className="text-blue-50 text-sm">Gestión de espacios simplificada</p>
        </div>

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

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {activeTab === "login" ? (
            <>
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