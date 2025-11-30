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
      // --- Aquí irán las rutas de Alvaro y Leonardo ---
      // Por ahora, si haces clic darán error en consola hasta que creemos los archivos.
      // Ejemplo de cómo quedará cuando Alvaro termine Spaces:
      {
        path: 'spaces',
        loadComponent: () => import('./features/dashboard/spaces/spaces.component').then(m => m.SpacesComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/dashboard/users/users.component').then(m => m.UsersComponent)
      },
      /*
      {
        path: 'horarios',
        loadComponent: () => import('./features/dashboard/schedule/schedule.component').then(m => m.ScheduleComponent)
      },
      */
    ]
  }
];
