import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'No se pudo procesar la solicitud.';

      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string' && error.error.trim()) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      switch (error.status) {
        case 0:
          notificationService.showError('Sin Conexión', 'No se pudo establecer conexión con el servidor backend.');
          break;
        case 400:
          notificationService.showWarn('Solicitud Incorrecta', errorMessage);
          break;
        case 401:
          notificationService.showError('No Autorizado', 'Sesión no válida o expirada.');
          break;
        case 403:
          notificationService.showError('Acceso Denegado', 'No cuenta con permisos para realizar esta acción.');
          break;
        case 404:
          notificationService.showWarn('No Encontrado', errorMessage || 'El recurso solicitado no fue encontrado.');
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          notificationService.showError('Error en el Servidor', errorMessage || 'Ocurrió un error interno en el servidor.');
          break;
        default:
          notificationService.showError(`Error (${error.status})`, errorMessage);
          break;
      }

      return throwError(() => error);
    })
  );
};
