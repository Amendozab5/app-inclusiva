import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UsuarioService, UsuarioDTO, UsuarioUpdateRequest } from '../../core/usuario.service';
import { TokenService } from '../../core/token.service';

type Draft = {
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
};

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioDTO[] = [];
  error = '';
  soloActivos = false;

  editId: number | null = null;
  drafts = new Map<number, Draft>();

  cargando = false;

  // ➕ Nuevo Usuario
  isNuevoModal = false;
  nuevoUsuario: any = { nombre: '', email: '', rol: 'USER', password: '' };

  // ✅ Toast
  toast = '';
  toastType: 'ok' | 'error' = 'ok';

  constructor(
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.cargar(false));
  }

  cargar(mostrarToast = true): void {
    this.cargando = true;
    this.error = '';
    this.usuarioService.listar(this.soloActivos)
      .pipe(finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.usuarios = data;
          if (this.editId != null && !this.usuarios.some(u => u.id === this.editId)) {
            this.cancelarEdicion();
          }
          this.cdr.detectChanges();
          if (mostrarToast) {
            this.showToast('Usuarios cargados correctamente ✅', 'ok');
          }
        },
        error: (e) => {
          if (e?.status === 401 || e?.status === 403) {
            this.error = 'Acceso denegado. Inicia sesión nuevamente.';
            this.showToast('Acceso denegado ❌', 'error');
          } else {
            this.error = 'No se pudo cargar usuarios.';
            if (mostrarToast) {
              this.showToast('Error al cargar usuarios ❌', 'error');
            }
          }
        }
      });
  }

  toggleActivos(): void {
    if (this.editId != null) this.cancelarEdicion();
    this.soloActivos = !this.soloActivos;
    this.cargar(true);
  }

  abrirNuevo(): void {
    this.nuevoUsuario = { nombre: '', email: '', rol: 'USER', password: '', activo: true };
    this.isNuevoModal = true;
  }

  cerrarNuevo(): void {
    this.isNuevoModal = false;
  }

  crearUsuario(): void {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      this.showToast('Todos los campos son obligatorios ⚠️', 'error');
      return;
    }

    this.cargando = true;
    this.usuarioService.crear(this.nuevoUsuario)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.showToast('Usuario creado correctamente ✅', 'ok');
          this.cerrarNuevo();
          this.cargar(false);
        },
        error: (e) => {
          const msg = e?.error?.message || 'Error al crear usuario ❌';
          this.showToast(msg, 'error');
        }
      });
  }

  iniciarEdicion(u: UsuarioDTO): void {
    if (!u.id) return;
    this.editId = u.id!;
    this.drafts.set(u.id!, {
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
      activo: u.activo ?? true
    });
  }

  cancelarEdicion(): void {
    if (this.editId != null) this.drafts.delete(this.editId);
    this.editId = null;
  }

  getDraft(id: number): Draft {
    return this.drafts.get(id) || { nombre: '', email: '', rol: 'USER', activo: true };
  }

  guardarEdicion(): void {
    if (this.editId == null) return;
    const draft = this.drafts.get(this.editId);
    if (!draft) return;

    this.cargando = true;
    this.usuarioService.actualizar(this.editId, draft as UsuarioUpdateRequest)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.showToast('Usuario actualizado ✅', 'ok');
          this.cancelarEdicion();
          this.cargar(false);
        },
        error: () => this.showToast('Error al actualizar ❌', 'error')
      });
  }

  desactivar(id: number): void {
    if (!confirm('¿Seguro que deseas desactivar este usuario?')) return;
    this.cargando = true;
    this.usuarioService.desactivar(id)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.showToast('Usuario desactivado ✅', 'ok');
          this.cargar(false);
        },
        error: () => this.showToast('Error al desactivar ❌', 'error')
      });
  }

  activar(id: number): void {
    this.cargando = true;
    this.usuarioService.activar(id)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.showToast('Usuario activado ✅', 'ok');
          this.cargar(false);
        },
        error: () => this.showToast('Error al activar ❌', 'error')
      });
  }

  eliminar(id: number): void {
    if (!confirm('⚠️ ¿ELIMINAR PERMANENTEMENTE?')) return;
    this.cargando = true;
    this.usuarioService.eliminar(id)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.showToast('Usuario eliminado 🔥', 'ok');
          this.cargar(false);
        },
        error: () => this.showToast('Error al eliminar ❌', 'error')
      });
  }

  showToast(msg: string, type: 'ok' | 'error' = 'ok') {
    this.toast = msg;
    this.toastType = type;
    setTimeout(() => this.toast = '', 2500);
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigateByUrl('/login');
  }
}