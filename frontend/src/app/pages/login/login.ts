import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

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

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit(): void {
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/usuarios'),
      error: () => (this.error = 'Credenciales inválidas o acceso no autorizado.')
    });
  }
}