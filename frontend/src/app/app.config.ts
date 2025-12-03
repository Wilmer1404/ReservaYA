import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import {
  LucideAngularModule,
  // Generales
  Calendar, ArrowLeft, Loader2, AlertCircle, LayoutDashboard, LogOut, Settings, Plus, Edit, Trash2, X, ArrowRight, Save, Bell, Globe, Shield, Phone,
  // Formularios
  Mail, Lock, User, Building2, CheckCircle2, Clock, Image, Type,
  // Sidebar y Portal
  MapPin, Users, BarChart3, CalendarCheck, CalendarClock, CalendarOff, PieChart, TrendingUp, ArrowUp,
  // Espacios
  Dumbbell, Microscope, BookOpen
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    importProvidersFrom(LucideAngularModule.pick({
      Calendar, ArrowLeft, Loader2, AlertCircle, LayoutDashboard, LogOut, Settings, Plus, Edit, Trash2, X, ArrowRight, Save, Bell, Globe, Shield, Phone,
      Mail, Lock, User, Building2, CheckCircle2, Clock, Image, Type,
      MapPin, Users, BarChart3, CalendarCheck, CalendarClock, CalendarOff, PieChart, TrendingUp, ArrowUp,
      Dumbbell, Microscope, BookOpen
    }))
  ]
};
