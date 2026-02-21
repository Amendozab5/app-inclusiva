import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UsuarioService, UsuarioDTO, UsuarioUpdateRequest } from '../../core/usuario.service';
import { TokenService } from '../../core/token.service';

type Draft = {
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'USER';
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
  soloActivos = false; // 🔄 Cambiado a FALSE por defecto para cargar todo al inicio

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

  // ==============================
  // 🔄 CARGAR USUARIOS
  // ==============================
  cargar(mostrarToast = true): void {
    this.cargando = true;
    this.error = '';
    console.log('Cargando usuarios... soloActivos:', this.soloActivos);
    this.usuarioService.listar(this.soloActivos)
      .pipe(finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          console.log('Usuarios recibidos:', data);
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

  // ==============================
  // ➕ CREACIÓN
  // ==============================
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

    if (this.nuevoUsuario.password.length < 8) {
      this.showToast('La contraseña debe tener al menos 8 caracteres ⚠️', 'error');
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
          console.error('Error al crear usuario:', e);
          const msg = e?.error?.message || 'Error al crear usuario ❌';

          if (e?.status === 409) {
            this.showToast('El email ya existe ❌', 'error');
          } else if (e?.status === 400 && e?.error?.fieldErrors) {
            // Si hay errores de validación específicos
            const firstError = Object.values(e.error.fieldErrors)[0];
            this.showToast(`${firstError} ⚠️`, 'error');
          } else {
            this.showToast(msg, 'error');
          }
        }
      });
  }

  // ==============================
  // ✏️ EDICIÓN
  // ==============================
  iniciarEdicion(u: UsuarioDTO): void {
    if (!u.id) return;
    this.error = '';
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
    const d = this.drafts.get(id);
    if (!d) {
      return { nombre: '', email: '', rol: 'USER', activo: true };
    }
    return d;
  }

  guardarEdicion(): void {
    if (this.editId == null) return;

    const draft = this.drafts.get(this.editId);
    if (!draft) return;

    const usuarioOriginal = this.usuarios.find(u => u.id === this.editId);
    if (!usuarioOriginal) return;

    const emailActualLogueado = this.tokenService.getEmail();

    const req: UsuarioUpdateRequest = {
      nombre: draft.nombre,
      email: draft.email,
      rol: draft.rol,
      activo: draft.activo
    };

    this.cargando = true;
    this.usuarioService.actualizar(this.editId, req)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {

          // 🔥 Si cambiaste tu propio email, el JWT queda inválido
          if (
            emailActualLogueado &&
            usuarioOriginal.email === emailActualLogueado &&
            req.email !== usuarioOriginal.email
          ) {
            this.showToast('Cambiaste tu email. Vuelve a iniciar sesión ✅', 'ok');
            this.logout();
            return;
          }

          this.showToast('Usuario actualizado correctamente ✅', 'ok');
          this.cancelarEdicion();

          // recargar SIN mostrar toast de "usuarios cargados"
          this.cargar(false);
        },
        error: (e) => {

          if (e?.status === 409) {
            this.error = 'Ese email ya está registrado por otro usuario.';
            this.showToast('Email duplicado ❌', 'error');
            return;
          }

          if (e?.status === 401 || e?.status === 403) {
            this.error = 'Acceso denegado. Inicia sesión nuevamente.';
            this.showToast('Acceso denegado ❌', 'error');
            return;
          }

          this.error = 'No se pudo actualizar el usuario.';
          this.showToast('Error al actualizar ❌', 'error');
        }
      });
  }

  // ==============================
  // 🛑 DESACTIVAR
  // ==============================
  desactivar(id: number): void {
    const u = this.usuarios.find(x => x.id === id);
    if (!u) return;

    if (!this.confirmDesactivar(u.nombre)) return;

    if (this.editId === id) this.cancelarEdicion();

    this.cargando = true;
    this.usuarioService.desactivar(id)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: () => {
          this.showToast('Usuario desactivado correctamente ✅', 'ok');
          this.cargar(false);
        },
        error: (e) => {

          if (e?.status === 401 || e?.status === 403) {
            this.error = 'Acceso denegado. Inicia sesión nuevamente.';
            this.showToast('Acceso denegado ❌', 'error');
            return;
          }

          this.error = 'No se pudo desactivar el usuario.';
          this.showToast('Error al desactivar ❌', 'error');
        }
      });
  }

  confirmDesactivar(nombre: string): boolean {
    return confirm(`¿Seguro que deseas desactivar a: ${nombre}?`);
  }

  // ==============================
  // ✅ ACTIVAR
  // ==============================
  activar(id: number): void {
    this.cargando = true;

    this.usuarioService.activar(id)
      .pipe(finalize(() => {
        this.cargando = false;
      }))
      .subscribe({
        next: () => {
          this.showToast('Usuario activado correctamente ✅', 'ok');
          this.cargar(false);
        },
        error: () => {
          this.showToast('Error al activar usuario ❌', 'error');
        }
      });
  }

  // ==============================
  // 🔥 ELIMINAR PERMANENTE
  // ==============================
  eliminar(id: number): void {
    const u = this.usuarios.find(x => x.id === id);
    if (!u) return;

    const conf = confirm(`⚠️ ¡ATENCIÓN! ¿Seguro que deseas ELIMINAR PERMANENTEMENTE a ${u.nombre}? Esta acción no se puede deshacer.`);
    if (!conf) return;

    this.cargando = true;

    this.usuarioService.eliminar(id)
      .pipe(finalize(() => {
        this.cargando = false;
      }))
      .subscribe({
        next: () => {
          this.showToast('Usuario eliminado permanentemente 🔥', 'ok');
          this.cargar(false);
        },
        error: () => {
          this.showToast('Error al eliminar permanentemente ❌', 'error');
        }
      });
  }

  showToast(msg: string, type: 'ok' | 'error' = 'ok') {
    this.toast = msg;
    this.toastType = type;

    setTimeout(() => {
      this.toast = '';
    }, 2500);
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigateByUrl('/login');
  }
}