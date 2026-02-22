package ec.edu.uteq.app.service;

import ec.edu.uteq.app.domain.model.Productos;
import ec.edu.uteq.app.repository.ProductoRepository;
import ec.edu.uteq.app.web.dto.ProductoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<ProductoDTO> listarProductos() {
        return productoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO obtenerPorId(Long id) {
        Productos p = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return toDTO(p);
    }

    @Transactional
    public ProductoDTO crear(ProductoDTO dto) {
        Productos p = new Productos();
        updateEntity(p, dto);
        return toDTO(productoRepository.save(p));
    }

    @Transactional
    public ProductoDTO actualizar(Long id, ProductoDTO dto) {
        Productos p = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        updateEntity(p, dto);
        return toDTO(productoRepository.save(p));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }

    private ProductoDTO toDTO(Productos p) {
        return new ProductoDTO(
                p.getProductId(),
                p.getUrlImagen(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecio());
    }

    private void updateEntity(Productos p, ProductoDTO dto) {
        p.setNombre(dto.getNombre());
        p.setDescripcion(dto.getDescripcion());
        p.setUrlImagen(dto.getUrlImagen());
        p.setPrecio(dto.getPrecio());
    }
}