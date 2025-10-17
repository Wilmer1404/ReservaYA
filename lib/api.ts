import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

const api = axios.create({
  // Esta línea ahora obtendrá 'http://localhost:8080/api/v1'
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Interceptor para añadir el token JWT a cada petición
api.interceptors.request.use(
  (config) => {
    // Asegurarse de que el token solo se obtenga en el lado del cliente
    if (typeof window !== 'undefined') {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;