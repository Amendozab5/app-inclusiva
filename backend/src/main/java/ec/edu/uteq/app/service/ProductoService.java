package ec.edu.uteq.app.service;

import ec.edu.uteq.app.repository.ProductoRepository;
import ec.edu.uteq.app.web.dto.ProductoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<ProductoDTO> listarProductos() {
        return productoRepository.findAll()
                .stream()
                .map(p -> new ProductoDTO(
                        p.getProductId(),
                        p.getUrlImagen(),
                        p.getNombre(),
                        p.getDescripcion(),
                        p.getPrecio()
                ))
                .collect(Collectors.toList());
    }
}