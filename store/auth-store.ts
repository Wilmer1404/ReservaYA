import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Definimos la respuesta de la API que esperamos
// Coincide con tu AuthResponse.java
interface AuthResponse {
  token: string;
  userRole: 'ADMIN' | 'USER';
  institutionId: number;
  userId: number;
  userName: string;
}

// Definimos el estado del store
interface AuthState {
  token: string | null;
  userRole: 'ADMIN' | 'USER' | null;
  userName: string | null;
  userId: number | null;
  isAuthenticated: () => boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

/**
 * Crítica de Diseño:
 * Este store es ahora la fuente única de verdad para la identidad del usuario.
 * Almacenamos 'userRole' y 'userName' que nos da el backend al hacer login.
 * El 'RouteGuard' y los 'Layouts' leerán de aquí para decidir qué mostrar
 * y a dónde redirigir.
 * Se elimina la dependencia del 'AuthContext' [cite: `context/AuthContext.tsx`]
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado Inicial
      token: null,
      userRole: null,
      userName: null,
      userId: null,

      // Selectors/Computados
      isAuthenticated: () => !!get().token,

      // Acciones
      login: (authResponse: AuthResponse) => {
        set({
          token: authResponse.token,
          userRole: authResponse.userRole,
          userName: authResponse.userName,
          userId: authResponse.userId,
        });
      },

      logout: () => {
        // Limpia todo al salir
        set({
          token: null,
          userRole: null,
          userName: null,
          userId: null,
        });
      },
    }),
    {
      // Configuración de persistencia
      name: 'auth-storage', // Nombre en localStorage
      storage: createJSONStorage(() => localStorage), // Usar localStorage
    }
  )
);
