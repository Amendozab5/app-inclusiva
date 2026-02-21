import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const t = this.tokenService.get();
    let cloned = req;

    if (t) {
      cloned = req.clone({ setHeaders: { Authorization: `Bearer ${t}` } });
    }

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        // 🚨 401 Unauthorized -> Token expirado o inválido
        if (error.status === 401) {
          this.tokenService.clear();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}