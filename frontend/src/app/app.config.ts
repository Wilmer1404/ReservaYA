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
    Plus,
    Edit,
    Trash2,

    // Iconos para Formularios (NUEVOS)
    Mail,         // Para input email
    Lock,         // Para input password
    User,         // Para input nombre
    Building2,    // Para input institución
    CheckCircle2, // Para éxito

    // Iconos del Sidebar
    MapPin,
    Users,
    BarChart3,
    CalendarCheck,
    CalendarClock,

    // Iconos de Espacios
    Dumbbell,
    Microscope,
    BookOpen
  } from 'lucide-angular';

  import { routes } from './app.routes';
  import { authInterceptor } from './core/interceptors/auth.interceptor';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes),
      provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

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
        Mail,
        Lock,
        User,
        Building2,
        CheckCircle2,
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
