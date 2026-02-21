package ec.edu.uteq.app.service;

import ec.edu.uteq.app.domain.enums.Rol;
import ec.edu.uteq.app.domain.model.Usuario;
import ec.edu.uteq.app.exception.ConflictException;
import ec.edu.uteq.app.exception.ResourceNotFoundException;
import ec.edu.uteq.app.repository.UsuarioRepository;
import ec.edu.uteq.app.web.dto.UsuarioDTO;
import ec.edu.uteq.app.web.dto.UsuarioUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // ===============================
    // CREAR USUARIO
    // ===============================
    public UsuarioDTO crear(UsuarioDTO dto) {

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new ConflictException("El email ya está registrado");
        }

        Rol rol = (dto.getRol() == null) ? Rol.USER : dto.getRol();

        Usuario usuario = Usuario.builder()
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .rol(rol)
                .activo(true)
                .fechaCreacion(OffsetDateTime.now())
                .fechaActualizacion(OffsetDateTime.now())
                .build();

        Usuario guardado = usuarioRepository.save(usuario);

        return mapToDTO(guardado);
    }

    // ===============================
    // LISTAR
    // ===============================
    public List<UsuarioDTO> listar(Boolean soloActivos) {
        List<Usuario> usuarios;

        if (Boolean.TRUE.equals(soloActivos)) {
            usuarios = usuarioRepository.findAllByActivo(true);
        } else {
            usuarios = usuarioRepository.findAll();
        }

        return usuarios.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ===============================
    // OBTENER POR ID
    // ===============================
    public UsuarioDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return mapToDTO(usuario);
    }

    // ===============================
    // ACTUALIZAR
    // ===============================
    public UsuarioDTO actualizar(Long id, UsuarioUpdateRequest req) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (usuarioRepository.existsByEmailAndIdNot(req.getEmail(), id)) {
            throw new ConflictException("El email ya está registrado por otro usuario");
        }

        // Si se intenta desactivar a un ADMIN, verificar que no sea el último
        if (usuario.getRol() == Rol.ADMIN && Boolean.FALSE.equals(req.getActivo())) {
            validarNoEsUltimoAdmin(id);
        }

        usuario.setNombre(req.getNombre());
        usuario.setEmail(req.getEmail());

        if (req.getRol() != null) usuario.setRol(req.getRol());
        if (req.getActivo() != null) usuario.setActivo(req.getActivo());

        usuario.setFechaActualizacion(OffsetDateTime.now());

        Usuario guardado = usuarioRepository.save(usuario);
        return mapToDTO(guardado);
    }

    // ===============================
    // DESACTIVAR (SOFT DELETE)
    // ===============================
    public void desactivar(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (Boolean.FALSE.equals(usuario.getActivo())) return;

        // Si es ADMIN, verificar que no sea el último activo
        if (usuario.getRol() == Rol.ADMIN) {
            validarNoEsUltimoAdmin(id);
        }

        usuario.setActivo(false);
        usuario.setFechaActualizacion(OffsetDateTime.now());

        usuarioRepository.save(usuario);
    }

    // ===============================
    // ACTIVAR USUARIO
    // ===============================
    public void activar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (Boolean.TRUE.equals(usuario.getActivo())) return;

        usuario.setActivo(true);
        usuario.setFechaActualizacion(OffsetDateTime.now());

        usuarioRepository.save(usuario);
    }

    // ===============================
    // ELIMINAR PERMANENTE (HARD DELETE)
    // ===============================
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Si es ADMIN y está activo, verificar que no sea el último
        if (usuario.getRol() == Rol.ADMIN && Boolean.TRUE.equals(usuario.getActivo())) {
            validarNoEsUltimoAdmin(id);
        }

        usuarioRepository.deleteById(id);
    }

    private void validarNoEsUltimoAdmin(Long id) {
        long adminsActivos = usuarioRepository.countByRolAndActivo(Rol.ADMIN, true);
        if (adminsActivos <= 1) {
            throw new ConflictException("No se puede desactivar o eliminar al último administrador activo.");
        }
    }

    // ===============================
    // MAPEO A DTO
    // ===============================
    private UsuarioDTO mapToDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .activo(usuario.getActivo())
                .build();
    }
}