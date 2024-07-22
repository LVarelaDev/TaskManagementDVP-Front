import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (req.url.indexOf('Login') > 0) {
    return next(
      req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
      })
    );
  } else {
    const token = localStorage.getItem('token');
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedRequest).pipe(
      catchError((err) => {
        if (err.status === 401) {
          router.navigate(['/login']);
          toastr.info('Su sesion ha finalizado, inicie nuevamente!');
        }
        return throwError(() => err);
      })
    );
  }
};
