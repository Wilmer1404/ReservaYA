// app/register/page.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Importar Input
import Link from "next/link";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react"; // Importar Loader2
import { useRouter } from 'next/navigation'; // Importar useRouter para redirección

// (Opcional) Si quieres usar notificaciones, importa tu hook de toast
import { useToast } from "@/hooks/use-toast"; // o el hook de Sonner si lo prefieres

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast(); // Descomenta si usas shadcn toast

  // Ajustamos el estado para que coincida con RegisterRequest del backend
  const [formData, setFormData] = useState({
    institutionName: "",
    institutionType: "university", // Valor por defecto
    institutionEmailDomain: "", // Campo nuevo
    adminName: "", // Campo nuevo
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "", // Solo para validación en frontend
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Limpiar errores al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación simple de contraseña
    if (formData.adminPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    // Preparamos los datos para enviar al backend (excluyendo confirmPassword)
    const payload = {
        institutionName: formData.institutionName,
        institutionType: formData.institutionType,
        institutionEmailDomain: formData.institutionEmailDomain,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'; // Usa tu variable de entorno

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Registration failed:", data);
        const errorMessage = data?.message || `Error ${response.status}: ${response.statusText || 'Error al registrar la institución'}`;
        throw new Error(errorMessage);
      }

      console.log("Registration successful:", data);
      // Mostrar notificación de éxito (opcional)
      // toast({ title: "Registro Exitoso", description: "Institución y administrador creados. Ahora puedes iniciar sesión." }); // Ejemplo con shadcn toast
      alert("¡Registro Exitoso! Institución y administrador creados. Ahora puedes iniciar sesión."); // Alerta simple

      // Redirigir a la página de login después de un registro exitoso
      router.push('/login');

    } catch (err: any) {
      console.error("Error en handleSubmit:", err);
      setError(err.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.');
      setIsLoading(false); // Detener carga en caso de error
    }
    // No necesitamos setIsLoading(false) aquí en caso de éxito debido a la redirección
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

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registra tu institución</h2>
          <p className="text-slate-600 mb-8">Comienza a gestionar tus espacios hoy</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos de Institución */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="institutionName">Nombre de la institución</label>
              <Input
                type="text"
                id="institutionName"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="Ej: Universidad Nacional"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="institutionType">Tipo de institución</label>
              <select
                id="institutionType"
                name="institutionType"
                value={formData.institutionType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed" // Añadido bg-white y estilos disabled
                disabled={isLoading}
              >
                <option value="university">Universidad</option>
                <option value="school">Colegio</option>
                <option value="sports">Centro deportivo</option>
                <option value="library">Biblioteca</option>
                <option value="institute">Instituto</option> {/* Añadido por ejemplo */}
                <option value="other">Otro</option>
              </select>
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="institutionEmailDomain">Dominio de correo (Opcional)</label>
              <Input
                type="text"
                id="institutionEmailDomain"
                name="institutionEmailDomain"
                value={formData.institutionEmailDomain}
                onChange={handleChange}
                placeholder="Ej: minstitucion.edu.pe"
                disabled={isLoading}
              />
               <p className="text-xs text-slate-500 mt-1">Si lo proporcionas, podría usarse para validar futuros registros de usuarios.</p>
            </div>

             {/* Campos del Administrador */}
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="adminName">Nombre del Administrador</label>
              <Input
                type="text"
                id="adminName"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="adminEmail">Correo del Administrador</label>
              <Input
                type="email"
                id="adminEmail"
                name="adminEmail" // Cambiado de 'email' a 'adminEmail'
                value={formData.adminEmail}
                onChange={handleChange}
                placeholder="admin@institucion.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="adminPassword">Contraseña del Administrador</label>
              <Input
                type="password"
                id="adminPassword"
                name="adminPassword" // Cambiado de 'password' a 'adminPassword'
                value={formData.adminPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="confirmPassword">Confirmar Contraseña</label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2" disabled={isLoading}>
               {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Crear cuenta institucional'
              )}
            </Button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className={`text-blue-600 hover:text-blue-700 font-medium ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
              Inicia sesión
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}