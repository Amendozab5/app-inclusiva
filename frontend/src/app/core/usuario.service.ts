import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioDTO {
  id?: number;
  nombre: string;
  email: string;
  rol: string;
  activo?: boolean;
  password?: string;
}

export interface UsuarioUpdateRequest {
  nombre: string;
  email: string;
  rol?: string;
  activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly base = `${environment.apiBaseUrl}/api/usuarios`;

  constructor(private http: HttpClient) { }

  crear(req: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(this.base, req);
  }

  listar(soloActivos?: boolean): Observable<UsuarioDTO[]> {
    let params = new HttpParams();
    if (soloActivos !== undefined) {
      params = params.set('soloActivos', String(soloActivos));
    }
    return this.http.get<UsuarioDTO[]>(this.base, { params });
  }

  actualizar(id: number, req: UsuarioUpdateRequest): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(`${this.base}/${id}`, req);
  }

  desactivar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  activar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${id}/activar`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}/permanente`);
  }
}