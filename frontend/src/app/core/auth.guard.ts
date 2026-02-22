import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { TokenService } from './token.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole: string | undefined = route.data?.['role'];
  if (requiredRole && tokenService.getRol() !== requiredRole) {
    // Tiene sesión pero no tiene el rol → manda a su página
    tokenService.getRol() === 'ADMIN'
      ? router.navigate(['/usuarios'])
      : router.navigate(['/productos']);
    return false;
  }

  return true;
};
