"use client"

import { useState, useEffect } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Grid3x3, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface DashboardSummary {
  activeSpaces: number;
  totalUsers: number;
  reservationsToday: number;
}

export default function DashboardPageContent() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<DashboardSummary>('/dashboard/summary');
        setSummary(response.data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar el resumen del dashboard:", err);
        setError("No se pudo cargar el resumen.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const stats = summary ? [
    { label: "Espacios activos", value: String(summary.activeSpaces), Icon: Grid3x3, color: "bg-blue-100 text-blue-600" },
    { label: "Reservas hoy", value: String(summary.reservationsToday), Icon: Calendar, color: "bg-green-100 text-green-600" },
    { label: "Usuarios registrados", value: String(summary.totalUsers), Icon: Users, color: "bg-purple-100 text-purple-600" },
  ] : [];

  return (
    <DashboardPage
      activeTab="dashboard"
      title="Panel principal"
      description="Bienvenido a tu panel de control"
      button={
        <Link href="/dashboard/spaces">
          <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Agregar espacio
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}
      
      {/* Aquí podrías añadir una tabla con las reservas más recientes */}
    </DashboardPage>
  );
}