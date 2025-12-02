import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import {
  LucideAngularModule,
  // Iconos Generales
  Calendar,
  ArrowLeft,
  Loader2,
  AlertCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  Plus,         // Nuevo: Para botones "Crear"
  Edit,         // Nuevo: Para editar
  Trash2,       // Nuevo: Para eliminar

  // Iconos del Sidebar
  MapPin,
  Users,
  BarChart3,
  CalendarCheck,
  CalendarClock,

  // Iconos de Espacios (Spaces)
  Dumbbell,     // Deportes
  Microscope,   // Laboratorio
  BookOpen      // Estudio/Biblioteca
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    // Registramos TODOS los íconos aquí para que estén disponibles en la app
    importProvidersFrom(LucideAngularModule.pick({
      Calendar,
      ArrowLeft,
      Loader2,
      AlertCircle,
      LayoutDashboard,
      LogOut,
      Settings,
      Plus,
      Edit,
      Trash2,
      MapPin,
      Users,
      BarChart3,
      CalendarCheck,
      CalendarClock,
      Dumbbell,
      Microscope,
      BookOpen
    }))
  ]
};
