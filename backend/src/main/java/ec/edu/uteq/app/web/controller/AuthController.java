package ec.edu.uteq.app.web.controller;

import ec.edu.uteq.app.service.AuthService;
import ec.edu.uteq.app.web.dto.AuthResponse;
import ec.edu.uteq.app.web.dto.LoginRequest;
import ec.edu.uteq.app.web.dto.RegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        log.info("Intento de login para el usuario: {}", req.getEmail());
        return ResponseEntity.ok(authService.login(req));
    }
}