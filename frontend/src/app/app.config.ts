import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import {
  LucideAngularModule,
  // Generales
  Calendar, ArrowLeft, Loader2, AlertCircle, LayoutDashboard, LogOut, Settings, Plus, Edit, Trash2, X, ArrowRight, Save, Bell, Globe, Shield, Phone,
  // --- NUEVOS ICONOS AGREGADOS ---
  CalendarPlus, Info,
  // Formularios
  Mail, Lock, User, Building2, CheckCircle2, Clock, Image, Type,
  // Sidebar y Portal
  MapPin, Users, BarChart3, CalendarCheck, CalendarClock, CalendarOff, PieChart, TrendingUp, ArrowUp,
  // Espacios
  Dumbbell, Microscope, BookOpen
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'es' },

    importProvidersFrom(LucideAngularModule.pick({
      Calendar, ArrowLeft, Loader2, AlertCircle, LayoutDashboard, LogOut, Settings, Plus, Edit, Trash2, X, ArrowRight, Save, Bell, Globe, Shield, Phone,
      // --- REGISTRO ---
      CalendarPlus, Info,
      // ----------------
      Mail, Lock, User, Building2, CheckCircle2, Clock, Image, Type,
      MapPin, Users, BarChart3, CalendarCheck, CalendarClock, CalendarOff, PieChart, TrendingUp, ArrowUp,
      Dumbbell, Microscope, BookOpen
    }))
  ]
};
