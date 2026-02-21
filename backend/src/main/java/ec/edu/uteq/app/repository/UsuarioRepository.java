package ec.edu.uteq.app.repository;

import ec.edu.uteq.app.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);

    java.util.List<ec.edu.uteq.app.domain.model.Usuario> findAllByActivo(boolean activo);

    long countByRolAndActivo(ec.edu.uteq.app.domain.enums.Rol rol, boolean activo);
}