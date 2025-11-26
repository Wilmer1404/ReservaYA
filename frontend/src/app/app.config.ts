import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
// 1. IMPORTAR AlertCircle
import { LucideAngularModule, Calendar, ArrowLeft, Loader2, AlertCircle } from 'lucide-angular';

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
      AlertCircle
    }))
  ]
};
