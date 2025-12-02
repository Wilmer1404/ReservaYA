'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store'; // Importar el store

// Definimos la respuesta de la API que esperamos
interface AuthResponse {
  token: string;
  userRole: 'ADMIN' | 'USER';
  institutionId: number;
  userId: number;
  userName: string;
}

export default function LoginPage() {
  const router = useRouter();
  // Obtener la acción 'login' de nuestro store
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Iniciando sesión...');

    // Usamos el API_URL (asumiendo que está en variables de entorno)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      // 1. Obtener la respuesta completa del backend
      const authResponse: AuthResponse = await response.json();

      // 2. Guardar TODA la respuesta en el store de Zustand
      login(authResponse);

      toast.dismiss();
      toast.success(`Bienvenido, ${authResponse.userName}!`);

      // 3. Crítica de Ruteo: REDIRIGIR BASADO EN ROL
      // Esta es la lógica clave. El login ahora distribuye al usuario.
      if (authResponse.userRole === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/portal'); // Los 'USER' van al nuevo portal
      }
    } catch (err: any) {
      setIsLoading(false);
      toast.dismiss();
      toast.error(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <AuthCard
      title="Iniciar Sesión"
      description="Ingresa a tu cuenta para gestionar tus reservas."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>
      </form>
    </AuthCard>
  );
}
