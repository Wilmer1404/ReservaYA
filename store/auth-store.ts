import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  clearAllAuthStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
      clearAllAuthStorage: () => {
        // Limpiar silenciosamente sin logs molestos
        
        // Limpiar el estado del store
        set({ token: null });
        
        // Limpiar localStorage completamente
        localStorage.removeItem('auth-storage');
        
        // Limpiar sessionStorage si existe
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('auth-storage');
        }
      },
    }),
    {
      name: 'auth-storage', // Nombre para el localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);