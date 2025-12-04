import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- Redirección Inicial ---
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // --- Autenticación ---
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
  },

  // --- Portal del Estudiante ---
  // Layout diferente (Navbar superior) y vistas simplificadas
  {
    path: 'portal',
    canActivate: [authGuard],
    loadComponent: () => import('./features/portal/layout/portal-layout.component').then(m => m.PortalLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/portal/home/portal-home.component').then(m => m.PortalHomeComponent)
      },
      {
        path: 'mis-reservas',
        loadComponent: () => import('./features/portal/mis-reservas/mis-reservas.component').then(m => m.MisReservasComponent)
      },
      // --- NUEVA RUTA AGREGADA ---
      {
        path: 'nueva-reserva',
        loadComponent: () => import('./features/portal/reservar/portal-reservar.component').then(m => m.PortalReservarComponent)
      }
    ]
  },

  // --- Dashboard Administrativo ---
  // Layout con Sidebar lateral y gestión completa
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      // Inicio del Dashboard
      {
        path: '',
        loadComponent: () => import('./features/dashboard/home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      // Gestión de Espacios
      {
        path: 'spaces',
        loadComponent: () => import('./features/dashboard/spaces/spaces.component').then(m => m.SpacesComponent)
      },
      // Gestión de Usuarios
      {
        path: 'users',
        loadComponent: () => import('./features/dashboard/users/users.component').then(m => m.UsersComponent)
      },
      // Historial de Reservas
      {
        path: 'reservations',
        loadComponent: () => import('./features/dashboard/reservations/reservations.component').then(m => m.ReservationsComponent)
      },
      // Vista de Horarios (Calendario)
      {
        path: 'horarios',
        loadComponent: () => import('./features/dashboard/horarios/horarios.component').then(m => m.HorariosComponent)
      },
      // Reportes y Métricas (Chart.js)
      {
        path: 'analytics',
        loadComponent: () => import('./features/dashboard/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      // Configuración de la Institución
      {
        path: 'settings',
        loadComponent: () => import('./features/dashboard/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // --- Ruta comodín (404) ---
  // Redirige al login si la ruta no existe
  { path: '**', redirectTo: 'login' }
];
