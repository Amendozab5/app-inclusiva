import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];