import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

// Determinar la URL base
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // En el cliente, usar la variable de entorno o fallback
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
  }
  // En el servidor, usar localhost
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, // 15 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Importante para CORS
});

// Interceptor para añadir el token JWT a cada petición
api.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', config.method?.toUpperCase(), `${config.baseURL}${config.url}`);
    console.log('📝 Request headers:', config.headers);
    
    // Asegurarse de que el token solo se obtenga en el lado del cliente
    if (typeof window !== 'undefined') {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token added to request');
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
    
    // Si hay problemas con JWT o autenticación, limpiar automáticamente
    if (error.response?.status === 401 || 
        error.response?.status === 403 || 
        (error.response?.data && typeof error.response.data === 'string' && 
         (error.response.data.includes('JWT') || 
          error.response.data.includes('signature') || 
          error.response.data.includes('token')))) {
      
      if (typeof window !== 'undefined') {
        console.log('🔄 Auto-limpiando tokens inválidos...');
        // Limpieza automática y silenciosa
        useAuthStore.getState().clearAllAuthStorage();
        
        // No hacer retry automático para evitar loops infinitos
        // El usuario tendrá que intentar de nuevo manualmente
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;