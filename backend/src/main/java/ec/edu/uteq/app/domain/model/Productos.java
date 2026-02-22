package ec.edu.uteq.app.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "productos")
public class Productos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "url_imagen", nullable = false, length = 550)
    private String urlImagen;

    @Column(name = "nombre", length = 150)
    private String nombre;

    @Column(name = "descripcion", length = 350)
    private String descripcion;

    @Column(name = "precio", length = 150)
    private BigDecimal precio;
}
