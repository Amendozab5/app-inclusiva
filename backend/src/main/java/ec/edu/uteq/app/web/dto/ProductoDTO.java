package ec.edu.uteq.app.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoDTO {
    private Long productId;
    private String urlImagen;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
}