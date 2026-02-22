package ec.edu.uteq.app.config;

import ec.edu.uteq.app.domain.enums.Rol;
import ec.edu.uteq.app.domain.model.Usuario;
import ec.edu.uteq.app.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Verificando existencia de usuario administrador...");
        var adminOpt = usuarioRepository.findByEmail("admin@app.com");
        if (adminOpt.isEmpty()) {
            log.info("Usuario admin@app.com no encontrado. Creándolo...");
            Usuario admin = Usuario.builder()
                    .nombre("Administrador")
                    .email("admin@app.com")
                    .password(passwordEncoder.encode("admin123"))
                    .rol(Rol.ADMIN)
                    .activo(true)
                    .fechaCreacion(OffsetDateTime.now())
                    .fechaActualizacion(OffsetDateTime.now())
                    .build();
            usuarioRepository.save(admin);
            log.info("Usuario administrador creado con éxito: admin@app.com / admin123");
        }

        // Crear Editor de prueba
        if (usuarioRepository.findByEmail("editor@app.com").isEmpty()) {
            Usuario editor = Usuario.builder()
                    .nombre("Editor de Contenidos")
                    .email("editor@app.com")
                    .password(passwordEncoder.encode("editor123"))
                    .rol(Rol.EDITOR)
                    .activo(true)
                    .fechaCreacion(OffsetDateTime.now())
                    .fechaActualizacion(OffsetDateTime.now())
                    .build();
            usuarioRepository.save(editor);
            log.info("Usuario editor creado: editor@app.com / editor123");
        }

        // Crear Visitante de prueba
        if (usuarioRepository.findByEmail("visitante@app.com").isEmpty()) {
            Usuario visitante = Usuario.builder()
                    .nombre("Usuario Invitado")
                    .email("visitante@app.com")
                    .password(passwordEncoder.encode("invitado123"))
                    .rol(Rol.VISITANTE)
                    .activo(true)
                    .fechaCreacion(OffsetDateTime.now())
                    .fechaActualizacion(OffsetDateTime.now())
                    .build();
            usuarioRepository.save(visitante);
            log.info("Usuario visitante creado: visitante@app.com / invitado123");
        }
    }
}
