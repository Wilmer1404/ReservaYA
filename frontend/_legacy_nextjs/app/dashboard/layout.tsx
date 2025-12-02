import { RouteGuard } from "@/components/auth/route-guard";

// Forzar renderizado dinámico para todo el dashboard
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard>{children}</RouteGuard>;
}