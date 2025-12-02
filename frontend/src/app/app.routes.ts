// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
  },

  // Dashboard Protegido
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'horarios',
        loadComponent: () => import('./features/dashboard/horarios/horarios.component').then(m => m.HorariosComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/dashboard/reservations/reservations.component').then(m => m.ReservationsComponent)
      },
      // --- Rutas descomentadas y activadas ---
      {
        path: 'spaces',
        loadComponent: () => import('./features/dashboard/spaces/spaces.component').then(m => m.SpacesComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/dashboard/users/users.component').then(m => m.UsersComponent)
      },
      // Puedes añadir más rutas aquí, como 'settings' si creas ese componente en el futuro
    ]
  }
];
