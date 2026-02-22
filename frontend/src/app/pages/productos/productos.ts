import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/producto.service';
import { Producto } from '../../core/producto.model';
import { AuthService } from '../../core/auth.service';
import { TokenService } from '../../core/token.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  error = '';
  email = '';
  rol = '';

  // Lógica para Agregar Producto (Editor/Admin)
  isNuevoModal = false;
  nuevoProducto: Producto = this.initProducto();

  // Detalle de Producto
  productoSeleccionado: Producto | null = null;
  isDetalleModal = false;

  // Toast
  toast = '';
  toastType: 'ok' | 'error' = 'ok';

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.email = this.tokenService.getEmail() || '';
    this.rol = this.tokenService.getRol() || '';
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
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

  abrirNuevo(): void {
    this.nuevoProducto = this.initProducto();
    this.isNuevoModal = true;
  }

  cerrarNuevo(): void {
    this.isNuevoModal = false;
  }

  verDetalles(p: Producto): void {
    this.productoSeleccionado = p;
    this.isDetalleModal = true;
  }

  cerrarDetalle(): void {
    this.isDetalleModal = false;
    this.productoSeleccionado = null;
  }

  crearProducto(): void {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.precio) return;

    this.productoService.crear(this.nuevoProducto).subscribe({
      next: () => {
        this.showToast('¡Producto registrado con éxito! 🚀', 'ok');
        this.cargarProductos();
        this.cerrarNuevo();
      },
      error: () => {
        this.showToast('Error al registrar el producto ❌', 'error');
        this.error = 'Error al crear el producto';
      }
    });
  }

  private showToast(msg: string, type: 'ok' | 'error' = 'ok') {
    this.toast = msg;
    this.toastType = type;
    setTimeout(() => this.toast = '', 3000);
  }

  eliminarProducto(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    this.productoService.eliminar(id).subscribe({
      next: () => this.cargarProductos(),
      error: () => this.error = 'Error al eliminar el producto'
    });
  }

  private initProducto(): Producto {
    return {
      nombre: '',
      descripcion: '',
      precio: 0,
      urlImagen: 'https://placehold.co/400x200?text=Nuevo+Producto'
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
