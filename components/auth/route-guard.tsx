'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

// Definimos las rutas públicas que no requieren autenticación
const PUBLIC_PATHS = ['/login', '/register', '/contact'];
// Definimos las rutas de solo administrador
const ADMIN_PATHS = ['/dashboard'];
// Definimos las rutas de solo usuario
const USER_PATHS = ['/portal'];

/**
 * Crítica de Arquitectura:
 * Este componente es el "guardia de seguridad" del frontend.
 * Lee el estado del useAuthStore (que es la fuente de verdad) y
 * el pathname actual para forzar redirecciones.
 *
 * Lógica:
 * 1. Si no hay token Y la ruta NO es pública -> Redirigir a /login.
 * 2. Si HAY token:
 * a. Si el rol es USER e intenta acceder a /dashboard -> Redirigir a /portal.
 * b. Si el rol es ADMIN e intenta acceder a /portal -> Redirigir a /dashboard.
 * c. Si el rol es USER o ADMIN e intenta acceder a /login -> Redirigir a su portal.
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { token, userRole } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Definimos si la ruta actual es una de las protegidas (admin o user)
        const isUserPath = USER_PATHS.some((p) => pathname.startsWith(p));
        const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
        const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

        // Caso 1: Usuario NO autenticado
        if (!token) {
            setIsChecking(false);
            // Si no está en una ruta pública, lo mandamos a login
            if (!isPublicPath) {
                router.push('/login');
            }
            return;
        }

        // Caso 2: Usuario SÍ autenticado (token existe)

        // 2a: USER intentando acceder a rutas ADMIN
        if (userRole === 'USER' && isAdminPath) {
            toast.error('Acceso denegado. Redirigiendo a tu portal.');
            router.push('/portal'); // Redirigir a su dashboard
            return;
        }

        // 2b: ADMIN intentando acceder a rutas USER
        if (userRole === 'ADMIN' && isUserPath) {
            toast.error('Acceso denegado. Redirigiendo a tu dashboard.');
            router.push('/dashboard'); // Redirigir a su dashboard
            return;
        }

        // 2c: Usuario autenticado intentando acceder a rutas públicas (ej. /login)
        if (isPublicPath && !pathname.startsWith('/contact')) {
            // Redirigir a su página principal
            router.push(userRole === 'ADMIN' ? '/dashboard' : '/portal');
            return;
        }

        // Si ninguna regla de redirección se aplica, dejar de chequear
        setIsChecking(false);
    }, [pathname, token, userRole, router]);

    // Mostrar un spinner o nada mientras se verifica
    if (isChecking) {
        // Puedes poner un componente de 'loading' global aquí
        return null;
    }

    return <>{children}</>;
}
