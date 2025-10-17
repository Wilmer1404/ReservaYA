"use client"

import { useState, useEffect } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Loader2, ShieldAlert } from "lucide-react";
import api from "@/lib/api";

// Interfaz para el DTO que viene del backend
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<User[]>("/users");
        setUsers(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error al cargar los usuarios:", err);
        if (err.response?.status === 403) {
          setError("Acceso denegado. Solo los administradores pueden ver esta página.");
        } else {
          setError("No se pudieron cargar los usuarios.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <DashboardPage
      activeTab="users"
      title="Usuarios"
      description="Gestiona los usuarios de tu institución"
      button={
        <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Agregar usuario
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center text-red-600 bg-red-50 p-8 rounded-lg border border-red-200">
          <ShieldAlert className="w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="p-6 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-slate-100 text-slate-600'
                  }`}>
                  {user.role}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 truncate">{user.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardPage>
  );
}