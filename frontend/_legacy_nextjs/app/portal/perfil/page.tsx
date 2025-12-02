'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Label } from 'recharts';

// Esquema de validación con Zod
// Coincide con la lógica de 'isPasswordStrong' [cite: `service/UserService.java`]
const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'La contraseña actual es requerida.'),
  newPassword: z
    .string()
    .min(8, 'Debe tener al menos 8 caracteres')
    .regex(/[a-z]/, 'Debe incluir una minúscula')
    .regex(/[A-Z]/, 'Debe incluir una mayúscula')
    .regex(/[0-9]/, 'Debe incluir un número'),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function PerfilPage() {
  const { userName, userId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    const toastId = toast.loading('Actualizando contraseña...');

    try {
      // Usamos el endpoint que probamos en el backend
      const response = await api.post('/users/me/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      toast.dismiss(toastId);
      toast.success(response.data.message || 'Contraseña actualizada');
      form.reset();
    } catch (err: any) {
      console.error(err);
      toast.dismiss(toastId);
      // Mostramos el mensaje de error del backend (ej. "Contraseña antigua incorrecta")
      toast.error(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
            <CardDescription>
              Esta es la información asociada a tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input value={userName || 'N/A'} disabled />
            </div>
            <div className="space-y-1">
              <Label>ID de Usuario</Label>
              <Input value={userId || 'N/A'} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>
              Actualiza tu contraseña. Asegúrate de que sea segura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña Actual</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Actualizar Contraseña
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
