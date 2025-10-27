// components/user-modal.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge"; // Para mostrar el rol actual

// Interfaz para el DTO de Usuario (debe coincidir con el backend UserDTO)
// Podríamos importarlo desde la página si lo exportamos allí, o definirlo aquí
interface UserDTO {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

// Interfaz para las props del modal
interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: UserDTO | null; // Datos para editar, null si es creación
    onUserSaved: () => void; // Función para notificar que se guardó
}

// Interfaz para el estado del formulario
interface UserFormData {
    name: string;
    email: string;
    password?: string; // Opcional, solo para creación
    role: 'ADMIN' | 'USER'; // Permitimos editar el rol
}

export function UserModal({ isOpen, onClose, initialData, onUserSaved }: UserModalProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        password: "",
        role: "USER", // Rol por defecto al crear
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!initialData; // Determina si estamos editando basado en initialData

    // Efecto para llenar el formulario cuando initialData cambia (al abrir para editar)
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                role: initialData.role,
                // No cargamos la contraseña para editar
            });
            setError(null); // Limpiar errores previos al abrir
        } else {
            // Si es creación, reseteamos el formulario
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "USER",
            });
            setError(null);
        }
    }, [isOpen, isEditing, initialData]); // Dependencias: se ejecuta si cambia alguna

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null); // Limpiar error al cambiar
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let response;
            if (isEditing && initialData) {
                // --- LLAMADA PUT PARA ACTUALIZAR ---
                const payload = {
                    name: formData.name,
                    // email: formData.email, // Podríamos permitir cambiar email, pero requiere validación extra
                    role: formData.role, // Permitimos cambiar rol (validación en backend)
                };
                console.log("Actualizando usuario:", initialData.id, payload);
                response = await api.put(`/users/${initialData.id}`, payload);
            } else {
                // --- LLAMADA POST PARA CREAR ---
                // Validar contraseña solo al crear
                if (!formData.password || formData.password.length < 6) { // Ejemplo de validación simple
                    throw new Error("La contraseña es requerida y debe tener al menos 6 caracteres.");
                }
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    // El rol USER se asigna por defecto en el backend al crear
                };
                console.log("Creando usuario:", payload);
                response = await api.post('/users', payload);
            }

            console.log(isEditing ? "User updated:" : "User created:", response.data);
            onUserSaved(); // Notificar al padre que se guardó (para recargar y cerrar)

        } catch (err: any) {
            console.error("Error saving user:", err);
            setError(err.response?.data?.message || err.message || `No se pudo ${isEditing ? 'actualizar' : 'crear'} el usuario.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setError(null); // Limpiar errores al cerrar
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? `Modifica los detalles del usuario ${initialData?.name}.`
                                : "Completa los datos para el nuevo usuario (tendrá rol USER)."}
                        </DialogDescription>
                        {/* Mostrar ID y rol actual si estamos editando */}
                        {isEditing && initialData && (
                            <div className="text-sm text-slate-500 pt-2">
                                ID: {initialData.id} | Rol Actual: <Badge variant={initialData.role === 'ADMIN' ? 'default' : 'secondary'}>{initialData.role}</Badge>
                            </div>
                        )}
                    </DialogHeader>

                    {error && (
                        <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-4 py-4">
                        {/* Campo Nombre */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="col-span-3"
                                placeholder="Nombre completo"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Campo Email */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Correo
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="col-span-3"
                                placeholder="usuario@institucion.com"
                                required
                                // Deshabilitar email al editar (cambiar email puede ser complejo)
                                disabled={isLoading || isEditing}
                                title={isEditing ? "El correo no se puede cambiar al editar." : ""}
                            />
                        </div>

                        {/* Campo Contraseña (solo para creación) */}
                        {!isEditing && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="col-span-3"
                                    placeholder="Mínimo 6 caracteres"
                                    required={!isEditing} // Requerido solo al crear
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        {/* Campo Rol (solo para edición, con precaución) */}
                        {isEditing && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">Rol</Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="col-span-3 w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    disabled={isLoading || initialData?.role === 'ADMIN'} // No permitir cambiar rol de ADMIN
                                    title={initialData?.role === 'ADMIN' ? "No se puede cambiar el rol de un ADMIN." : ""}
                                >
                                    {/* Solo permitir cambiar a USER por ahora */}
                                    <option value="USER">USER</option>
                                    {/* <option value="ADMIN">ADMIN</option> */} {/* Podríamos añadir lógica para permitir esto con cuidado */}
                                </select>
                            </div>
                        )}

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isLoading}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                                </>
                            ) : (
                                isEditing ? 'Guardar Cambios' : 'Crear Usuario'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}