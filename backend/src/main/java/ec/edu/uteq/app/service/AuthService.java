package ec.edu.uteq.app.service;

import ec.edu.uteq.app.config.JwtService;
import ec.edu.uteq.app.domain.enums.Rol;
import ec.edu.uteq.app.domain.model.Usuario;
import ec.edu.uteq.app.exception.ConflictException;
import ec.edu.uteq.app.repository.UsuarioRepository;
import ec.edu.uteq.app.web.dto.AuthResponse;
import ec.edu.uteq.app.web.dto.LoginRequest;
import ec.edu.uteq.app.web.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${app.jwt.expiration-minutes}")
    private long expirationMinutes;

    public AuthResponse register(RegisterRequest req) {

        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("El email ya está registrado");
        }

        Rol rol = (req.getRol() == null) ? Rol.USER : req.getRol();

        Usuario usuario = Usuario.builder()
                .nombre(req.getNombre())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .rol(rol)
                .activo(true)
                .fechaCreacion(OffsetDateTime.now())
                .fechaActualizacion(OffsetDateTime.now())
                .build();

        Usuario guardado = usuarioRepository.save(usuario);

        String token = jwtService.generarToken(String.valueOf(guardado.getId()), Map.of("rol", rol.name()));

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresInMinutes(expirationMinutes)
                .email(usuario.getEmail())
                .rol(rol.name())
                .build();
    }

    public AuthResponse login(LoginRequest req) {

        // valida credenciales contra UserDetailsService + PasswordEncoder
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        var usuario = usuarioRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado"));

        String token = jwtService.generarToken(String.valueOf(usuario.getId()), Map.of("rol", usuario.getRol().name()));

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresInMinutes(expirationMinutes)
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .build();
    }
}