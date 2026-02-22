import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductoService } from '../../core/producto.service';
import { Producto } from '../../core/producto.model';
import { AuthService } from '../../core/auth.service';
import { TokenService } from '../../core/token.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  error = '';
  email = '';

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.email = this.tokenService.getEmail() || '';
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar los productos';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
