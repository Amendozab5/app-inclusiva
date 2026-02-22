package ec.edu.uteq.app.web.dto;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private OffsetDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

    // Para errores de validación: campo -> mensaje
    private Map<String, String> fieldErrors;
}