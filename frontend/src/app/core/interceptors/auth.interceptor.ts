// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.currentUser && typeof authService.currentUser === 'function'
    ? authService.currentUser()
    : (authService as any).currentUser;
  const token = user?.token;
  const url = req.url || '';

  // Do not attach token to auth endpoints (login/register)
  if (url.includes('/api/v1/auth')) {
    return next(req);
  }

  if (token && token.toString().trim().length > 0) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  return next(req);
};
