package ec.edu.uteq.app.service;

import ec.edu.uteq.app.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return new UsuarioDetails(usuario);
    }

    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return new UsuarioDetails(usuario);
    }
}