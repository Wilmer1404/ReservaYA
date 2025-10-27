"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        // Esperar a que termine de cargar la verificación inicial de auth
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else {
                setIsVerified(true);
            }
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isVerified) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return <>{children}</>;
}