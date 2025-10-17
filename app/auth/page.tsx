"use client"

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import api from '@/lib/api';
import { useAuthStore } from "@/store/auth-store";

// Esquema de validación para el Login
const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

// Esquema de validación para el Registro
const registerSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"], // Campo donde se mostrará el error
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const router = useRouter();
  const { setToken } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(activeTab === "login" ? loginSchema : registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: LoginFormValues | RegisterFormValues) => {
    try {
      if (activeTab === 'login') {
        const response = await api.post('/auth/login', {
          email: values.email,
          password: values.password,
        });
        
        if (response.data && response.data.token) {
          toast.success("¡Bienvenido de vuelta!");
          setToken(response.data.token);
          router.push('/dashboard');
        } else {
          throw new Error("Respuesta de login inválida");
        }
      } else { // Lógica de Registro
        const registerValues = values as RegisterFormValues;
        await api.post('/auth/register', {
          name: registerValues.name,
          email: registerValues.email,
          password: registerValues.password,
        });
        
        toast.success("¡Registro exitoso!", {
          description: "Por favor, inicia sesión para continuar.",
        });
        setActiveTab("login");
        form.reset({ email: registerValues.email }); // Resetea el form manteniendo el email
      }
    } catch (err: any) {
      console.error("Error de autenticación:", err);
      const errorMessage = err.response?.data?.message || err.message || "Credenciales incorrectas o error en el servidor.";
      toast.error("Error de autenticación", {
        description: errorMessage,
      });
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
          <button onClick={() => { setActiveTab("login"); form.reset(); }} className={`flex-1 py-4 px-4 font-medium text-center transition-colors ${activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-600 hover:text-slate-900"}`}>
            Iniciar sesión
          </button>
          <button onClick={() => { setActiveTab("register"); form.reset(); }} className={`flex-1 py-4 px-4 font-medium text-center transition-colors ${activeTab === "register" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-600 hover:text-slate-900"}`}>
            Registrarse
          </button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-4">
            {activeTab === 'login' ? (
              <>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo institucional</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@institucion.edu" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ingresar
                </Button>
              </>
            ) : (
              <>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Pérez" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo institucional</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@institucion.edu" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear cuenta
                </Button>
              </>
            )}
          </form>
        </Form>
      </Card>
    </div>
  )
}

