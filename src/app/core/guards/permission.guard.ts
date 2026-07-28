import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { Modulo } from '../models/permissions.model';

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPermission = route.data['permission'] as Modulo | string;

  if (requiredPermission && authService.hasPermission(requiredPermission)) {
    return true;
  }

  if (authService.getToken()) {
    const initialRoute = authService.getInitialRouteForUser();
    return router.createUrlTree([initialRoute]);
  }

  return router.createUrlTree(['/login']);
};
