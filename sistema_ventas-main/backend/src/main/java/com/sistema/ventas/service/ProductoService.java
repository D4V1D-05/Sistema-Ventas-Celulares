package com.sistema.ventas.service;

import com.sistema.ventas.dto.StockRequest;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class ProductoService {
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }


    private final ProductoRepository productoRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    public Producto findById(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }

    public List<Producto> buscar(String marca, String modelo) {
        if (marca != null && !marca.isEmpty() && modelo != null && !modelo.isEmpty()) {
            return productoRepository.findByMarcaAndModeloContainingIgnoreCase(marca, modelo);
        } else if (marca != null && !marca.isEmpty()) {
            return productoRepository.findByMarca(marca);
        } else if (modelo != null && !modelo.isEmpty()) {
            return productoRepository.findByModeloContainingIgnoreCase(modelo);
        }
        return productoRepository.findAll();
    }

    public Producto crear(Producto producto) {
        producto.setStock(0);
        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, Producto producto) {
        Producto existing = findById(id);
        existing.setModelo(producto.getModelo());
        existing.setMarca(producto.getMarca());
        existing.setPrecio(producto.getPrecio());
        
        // Copy specifications
        existing.setProcesador(producto.getProcesador());
        existing.setRam(producto.getRam());
        existing.setAlmacenamiento(producto.getAlmacenamiento());
        existing.setBateria(producto.getBateria());
        existing.setCamaraPrincipal(producto.getCamaraPrincipal());
        existing.setCamaraFrontal(producto.getCamaraFrontal());
        existing.setPantalla(producto.getPantalla());
        existing.setRed(producto.getRed());

        if (producto.getFotoUrl() != null) {
            existing.setFotoUrl(producto.getFotoUrl());
        }
        return productoRepository.save(existing);
    }

    public void eliminar(Long id) {
        Producto producto = findById(id);
        productoRepository.delete(producto);
    }

    public Producto modificarStock(Long id, StockRequest request) {
        Producto producto = findById(id);
        if ("AGREGAR".equals(request.getOperacion())) {
            producto.setStock(producto.getStock() + request.getCantidad());
        } else if ("DISMINUIR".equals(request.getOperacion())) {
            int nuevoStock = producto.getStock() - request.getCantidad();
            if (nuevoStock < 0) {
                throw new RuntimeException("Stock insuficiente. Stock actual: " + producto.getStock());
            }
            producto.setStock(nuevoStock);
        } else {
            throw new RuntimeException("Operación no válida. Use AGREGAR o DISMINUIR");
        }
        return productoRepository.save(producto);
    }

    public Producto guardarFoto(Long id, MultipartFile file) {
        Producto producto = findById(id);
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = "producto_" + id + extension;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            producto.setFotoUrl(filename);
            return productoRepository.save(producto);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la foto: " + e.getMessage());
        }
    }

    public byte[] obtenerFoto(Long id) {
        Producto producto = findById(id);
        if (producto.getFotoUrl() == null || producto.getFotoUrl().isEmpty()) {
            throw new RuntimeException("El producto no tiene foto");
        }
        try {
            Path filePath = Paths.get(uploadDir).resolve(producto.getFotoUrl());
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Error al leer la foto: " + e.getMessage());
        }
    }

    public String obtenerContentType(Long id) {
        Producto producto = findById(id);
        String fotoUrl = producto.getFotoUrl();
        if (fotoUrl == null) return "application/octet-stream";

        String lower = fotoUrl.toLowerCase();
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        return "image/jpeg";
    }
}
