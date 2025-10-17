"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        // Se ejecuta solo en el lado del cliente
        if (typeof window !== 'undefined') {
            if (!token) {
                router.push('/auth');
            } else {
                setIsVerified(true);
            }
        }
    }, [token, router]);

    if (!isVerified) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return <>{children}</>;
}