package ec.edu.uteq.app.web.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String type; // Bearer
    private long expiresInMinutes;
    private String email;
    private String rol;
}