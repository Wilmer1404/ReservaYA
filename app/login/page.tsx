// app/login/page.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // --- CORRECCIÓN AQUÍ ---
    // Variable para la URL de la API (asegúrate que .env.local existe y tiene NEXT_PUBLIC_API_URL)
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
    try {
      // --- AJUSTE AQUÍ: Ya no añadimos /api/v1 ---
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data);
        const errorMessage = data?.message || `Error ${response.status}: ${response.statusText || 'Error al iniciar sesión'}`;
        throw new Error(errorMessage);
      }

      login(data);

    } catch (err: any) { // <<< CORREGIDO: Se eliminó la 'V'
      console.error("Error en handleSubmit:", err);
      setError(err.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <Card className="p-8 border border-slate-200 shadow-lg">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">ReservaYA</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Inicia sesión</h2>
          <p className="text-slate-600 mb-8">Accede a tu panel de control</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="email">Correo electrónico</label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@institucion.com"
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="password">Contraseña</label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" disabled={isLoading} />
                <span className="text-sm text-slate-600">Recuérdame</span>
              </label>
              <Link href="#" className={`text-sm text-blue-600 hover:text-blue-700 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            ¿No tienes cuenta institucional?{" "}
            <Link href="/register" className={`text-blue-600 hover:text-blue-700 font-medium ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
              Registra tu institución aquí
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}