package ec.edu.uteq.app.web.controller;

import ec.edu.uteq.app.service.ProductoService;
import ec.edu.uteq.app.web.dto.ProductoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> listarProductos() {
        return ResponseEntity.ok(productoService.listarProductos());
    }
}