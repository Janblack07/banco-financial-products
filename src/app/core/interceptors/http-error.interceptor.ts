import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocurrió un error inesperado.';

      if (error.status === 0) {
        message =
          'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
      } else if (error.status === 400) {
        message =
          error.error?.message ??
          'La información enviada no es válida.';
      } else if (error.status === 404) {
        message =
          error.error?.message ??
          'No se encontró el recurso solicitado.';
      } else if (error.status >= 500) {
        message = 'El servidor presentó un error. Intenta nuevamente.';
      }

      return throwError(() => ({
        originalError: error,
        message
      }));
    })
  );
};
