package ec.edu.uteq.app.web.controller;

import ec.edu.uteq.app.service.UsuarioService;
import ec.edu.uteq.app.web.dto.UsuarioDTO;
import ec.edu.uteq.app.web.dto.UsuarioUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    // ===============================
    // CREAR USUARIO
    // ===============================
    @PostMapping
    public ResponseEntity<UsuarioDTO> crear(@Valid @RequestBody UsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.crear(dto));
    }

    // ===============================
    // LISTAR USUARIOS
    // ===============================
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar(@RequestParam(required = false) Boolean soloActivos) {
        return ResponseEntity.ok(usuarioService.listar(soloActivos));
    }

    // ===============================
    // OBTENER POR ID
    // ===============================
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    // ===============================
    // ACTUALIZAR USUARIO
    // ===============================
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest req
    ) {
        return ResponseEntity.ok(usuarioService.actualizar(id, req));
    }

    // ===============================
    // DESACTIVAR (SOFT DELETE)
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        usuarioService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    // ===============================
    // ACTIVAR USUARIO
    // ===============================
    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        usuarioService.activar(id);
        return ResponseEntity.noContent().build();
    }

    // ===============================
    // ELIMINAR PERMANENTE
    // ===============================
    @DeleteMapping("/{id}/permanente")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}