'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Home, User, Calendar, LogOut, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

// Componente de navegación simple solo para este layout
function PortalNav() {
  const { logout, userName } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Has cerrado sesión exitosamente.');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/portal" className="flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6" />
          <span className="font-bold">Portal de Estudiante</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/portal">
              <Home className="mr-2 h-4 w-4" />
              Inicio
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/portal/mis-reservas">
              <Calendar className="mr-2 h-4 w-4" />
              Mis Reservas
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/portal/perfil">
              <User className="mr-2 h-4 w-4" />
              {userName || 'Perfil'}
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </nav>
      </div>
    </header>
  );
}

// Layout principal del portal
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalNav />
      <main className="flex-1 p-4 md:p-8 container max-w-screen-2xl">
        {children}
      </main>
    </div>
  );
}
