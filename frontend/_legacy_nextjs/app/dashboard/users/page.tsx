// app/dashboard/users/page.tsx
"use client";

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, AlertCircle, Users as UsersIcon } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/sidebar";
// Importar AlertDialog para confirmación de borrado
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// --- IMPORTAR EL MODAL ---
import { UserModal } from "@/components/user-modal"; // Importación correcta

// Interfaz para el DTO de Usuario (debe coincidir con el backend UserDTO)
interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export default function UsersPage() {
  // Estados para datos, carga y errores
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para el modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);

  // Estado para la confirmación de borrado
  const [userToDelete, setUserToDelete] = useState<UserDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FUNCIÓN PARA OBTENER USUARIOS ---
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<UserDTO[]>('/users');
      setUsers(response.data);
      console.log("Usuarios cargados:", response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("No se pudo cargar los usuarios. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- USEEFFECT PARA CARGAR DATOS INICIALES ---
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- FUNCIONES PARA ABRIR MODALES ---

  const handleCreateUser = () => {
    setEditingUser(null); // Asegurarse que no estamos editando
    setShowUserModal(true);
  };

  const handleEditUser = (user: UserDTO) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  // --- FUNCIÓN PARA MANEJAR EL BORRADO ---
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setError(null); // Limpiar errores previos

    try {
      await api.delete(`/users/${userToDelete.id}`);
      console.log(`Usuario ID ${userToDelete.id} eliminado`);
      setUserToDelete(null); // Cerrar confirmación
      fetchUsers(); // Recargar la lista de usuarios
      // Aquí podrías añadir un toast de éxito si lo tienes configurado
    } catch (err: any) {
      console.error("Error deleting user:", err);
      // Actualizar el estado de error para mostrarlo en el diálogo si aún está abierto
      setError(err.response?.data?.message || "No se pudo eliminar el usuario.");
      // No cerramos el diálogo aquí para que el usuario vea el error
    } finally {
      setIsDeleting(false);
    }
  };

  // --- FUNCIÓN PARA RENDERIZAR LA TABLA O ESTADOS ALTERNATIVOS ---
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 inline-block mr-2" />
                <Skeleton className="h-8 w-8 inline-block" />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    }

    // Mostrar error dentro de la tabla si no se pudo cargar
    if (error && users.length === 0) { // Solo si no hay datos previos
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center text-red-600">
            <AlertCircle className="inline-block w-5 h-5 mr-2" /> {error}
            <Button onClick={fetchUsers} variant="link" size="sm" className="ml-2">Reintentar</Button>
          </TableCell>
        </TableRow>
      );
    }

    if (users.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center text-slate-500">
             <UsersIcon className="inline-block w-6 h-6 mr-2" /> No se encontraron usuarios. ¡Crea el primero!
          </TableCell>
        </TableRow>
      );
    }

    // Renderizar filas de usuarios
    return (
      <>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.role === 'ADMIN' ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              {/* Botón Editar */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEditUser(user)}
                className="h-8 w-8" // HABILITADO
              >
                <Edit className="h-4 w-4" />
              </Button>
              {/* Botón Eliminar con Confirmación */}
              <AlertDialogTrigger asChild>
                 <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                        setError(null); // Limpiar error antes de abrir dialogo de borrado
                        setUserToDelete(user);
                    }}
                    disabled={user.role === 'ADMIN'} // No permitir borrar admins
                    title={user.role === 'ADMIN' ? "No se puede eliminar a un administrador" : "Eliminar usuario"}
                    className="h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
              </AlertDialogTrigger>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab="users" />
      
      <main className="flex-1 overflow-auto md:ml-0">
        {/* Envolver en AlertDialog permite que AlertDialogTrigger funcione en cualquier parte dentro */}
        <AlertDialog>
          <div className="p-6 md:p-10">
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
            <p className="text-slate-600">
              Administra los usuarios de tu institución.
            </p>
          </div>
          {/* Botón Crear Usuario */}
          <Button onClick={handleCreateUser} > {/* HABILITADO */}
            <Plus className="w-4 h-4 mr-2" />
            Crear Usuario
          </Button>
        </div>

        {/* Tabla */}
        <div className="rounded-lg border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo Electrónico</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </div>

        {/* --- MODAL DE USUARIO --- */}
        <UserModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          initialData={editingUser} // Pasa datos si editamos, null si creamos
          onUserSaved={() => {
            console.log("UserModal reportó guardado, actualizando lista...");
            setShowUserModal(false); // Cierra el modal
            fetchUsers(); // Recarga la lista de usuarios
            // Aquí podrías añadir un toast de éxito
          }}
        />

        {/* --- DIÁLOGO DE CONFIRMACIÓN DE BORRADO --- */}
        {/* Este contenido solo se muestra cuando userToDelete no es null */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario{' '}
              <span className="font-semibold text-slate-800">{userToDelete?.name}</span>{' '}
              (<span className="italic text-slate-600">{userToDelete?.email}</span>).
              No podrás deshacer esta acción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {/* Mostrar error de borrado si ocurre */}
          {error && isDeleting && ( // Solo muestra el error si estamos intentando borrar
             <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setUserToDelete(null)}
              disabled={isDeleting} // Deshabilitar cancelar mientras se borra
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting} // Deshabilitar botón mientras se borra
              className="bg-destructive hover:bg-destructive/90" // Estilo rojo
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando...
                </>
              ) : (
                'Sí, eliminar usuario'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
          </div>
        </AlertDialog>
      </main>
    </div>
  );
}