import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';           // ← faltaba
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { ProductosComponent } from './pages/productos/productos'; // ← agrega
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },                 // ← corregido
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
