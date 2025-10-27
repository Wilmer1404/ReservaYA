// context/AuthContext.tsx
"use client"; // Necesario para usar hooks de React (useState, useContext, useEffect)

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Para redireccionar
import { useAuthStore } from '@/store/auth-store'; // Para sincronizar con el store

// Definimos la estructura de la información del usuario que guardaremos
interface UserAuthInfo {
  userId: number;
  userName: string;
  userRole: 'ADMIN' | 'USER';
  institutionId: number;
}

// Definimos la estructura completa del contexto
interface AuthContextType {
  user: UserAuthInfo | null;
  token: string | null;
  isLoading: boolean; // Para saber si estamos comprobando la sesión inicial
  isAuthenticated: boolean; // Derivado de user y token
  login: (loginData: AuthResponse) => void; // Función para actualizar estado al loguear
  logout: () => void; // Función para limpiar estado al desloguear
}

// Tipo de la respuesta esperada del backend al hacer login
interface AuthResponse {
    token: string;
    userRole: 'ADMIN' | 'USER';
    institutionId: number;
    userId: number;
    userName: string;
}

// Creamos el contexto con un valor inicial undefined (o null con tipo adecuado)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el componente Provider que envolverá nuestra aplicación
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuthInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Empezamos cargando
  const router = useRouter();

  // Efecto para intentar cargar sesión desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Sincronizar con el auth-store
        useAuthStore.getState().setToken(storedToken);
        
        console.log("AuthProvider: Sesión restaurada desde localStorage.");
      } else {
        console.log("AuthProvider: No hay sesión guardada.");
      }
    } catch (error) {
        console.error("AuthProvider: Error al leer localStorage", error);
        // Limpiar en caso de datos corruptos
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    } finally {
        setIsLoading(false); // Terminamos de cargar
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  // Función para manejar el login
  const login = (loginData: AuthResponse) => {
    const userData: UserAuthInfo = {
      userId: loginData.userId,
      userName: loginData.userName,
      userRole: loginData.userRole,
      institutionId: loginData.institutionId,
    };
    try {
        localStorage.setItem('authToken', loginData.token);
        localStorage.setItem('authUser', JSON.stringify(userData));
        setToken(loginData.token);
        setUser(userData);
        
        // Sincronizar con el auth-store
        useAuthStore.getState().setToken(loginData.token);
        
        console.log("AuthProvider: Usuario logueado y sesión guardada.", userData);

        // Redirección basada en rol
        if (userData.userRole === 'ADMIN' || userData.userRole === 'USER') {
            router.push('/dashboard');
        } else {
             router.push('/'); // Fallback a la home si el rol no es reconocido
        }

    } catch (error) {
        console.error("AuthProvider: Error al guardar en localStorage", error);
        // Considera mostrar un mensaje de error al usuario
    }
  };

  // Función para manejar el logout
  const logout = () => {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUser(null);
        
        // Sincronizar con el auth-store
        useAuthStore.getState().clearAllAuthStorage();
        
        console.log("AuthProvider: Usuario deslogueado y sesión eliminada.");
        router.push('/login'); // Redirigir a la página de login
    } catch (error) {
         console.error("AuthProvider: Error al limpiar localStorage", error);
    }
  };

  // Valor que proveerá el contexto
  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token, // Es autenticado si hay user y token
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};