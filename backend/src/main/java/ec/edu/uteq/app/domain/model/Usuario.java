package ec.edu.uteq.app.domain.model;

import ec.edu.uteq.app.domain.enums.Rol;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "usuarios", uniqueConstraints = {
        @UniqueConstraint(name = "uk_usuarios_email", columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 80, message = "El nombre no debe exceder 80 caracteres")
    @Column(nullable = false, length = 80)
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    @Size(max = 120, message = "El email no debe exceder 120 caracteres")
    @Column(nullable = false, length = 120)
    private String email;

    // IMPORTANTE: aquí se guardará la contraseña ya ENCRIPTADA (BCrypt) cuando hagamos Security
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @Column(nullable = false)
    private Boolean activo;

    @Column(nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(nullable = false)
    private OffsetDateTime fechaActualizacion;

    @PrePersist
    void onCreate() {
        var now = OffsetDateTime.now();
        this.fechaCreacion = now;
        this.fechaActualizacion = now;
        if (this.activo == null) this.activo = true;
        if (this.rol == null) this.rol = Rol.USER;
    }

    @PreUpdate
    void onUpdate() {
        this.fechaActualizacion = OffsetDateTime.now();
    }
}