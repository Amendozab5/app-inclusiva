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
        } else {
            log.info(
                    "El usuario administrador ya existe. Actualizando contraseña a 'admin123' para asegurar acceso...");
            Usuario admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setActivo(true); // Aseguramos que esté activo
            usuarioRepository.save(admin);
            log.info("Contraseña de administrador actualizada.");
        }
    }
}
