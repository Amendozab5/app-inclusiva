import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TokenService } from '../../core/token.service';   // ← agrega

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private token: TokenService,                           // ← agrega
    private router: Router
  ) { }

  onSubmit(): void {
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const rol = this.token.getRol();                   // ← lee el rol guardado
        if (rol === 'ADMIN') {
          this.router.navigateByUrl('/usuarios');
        } else {
          this.router.navigateByUrl('/productos');
        }
      },
      error: () => (this.error = 'Credenciales inválidas o acceso no autorizado.')
    });
  }
}
