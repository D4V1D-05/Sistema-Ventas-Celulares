package com.sistema.ventas.controller;

import com.sistema.ventas.dto.StockRequest;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
@Tag(name = "Productos", description = "API para la gestión de productos/celulares")
public class ProductoController {
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }


    private final ProductoService productoService;

    @GetMapping
    @Operation(summary = "Listar todos los productos")
    public ResponseEntity<List<Producto>> findAll() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ResponseEntity<Producto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar productos por marca o modelo")
    public ResponseEntity<List<Producto>> buscar(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo) {
        return ResponseEntity.ok(productoService.buscar(marca, modelo));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo producto")
    public ResponseEntity<?> crear(
            @RequestBody Producto producto,
            @RequestHeader(value = "X-Role", required = false) String role) {
        if (!"ADMINISTRADOR".equals(role)) {
            return ResponseEntity.status(403).body("Acceso denegado: Se requiere rol ADMINISTRADOR");
        }
        return ResponseEntity.ok(productoService.crear(producto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto existente")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody Producto producto,
            @RequestHeader(value = "X-Role", required = false) String role) {
        if (!"ADMINISTRADOR".equals(role)) {
            return ResponseEntity.status(403).body("Acceso denegado: Se requiere rol ADMINISTRADOR");
        }
        return ResponseEntity.ok(productoService.actualizar(id, producto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id,
            @RequestHeader(value = "X-Role", required = false) String role) {
        if (!"ADMINISTRADOR".equals(role)) {
            return ResponseEntity.status(403).body("Acceso denegado: Se requiere rol ADMINISTRADOR");
        }
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/stock")
    @Operation(summary = "Modificar stock de producto")
    public ResponseEntity<?> modificarStock(
            @PathVariable Long id,
            @RequestBody StockRequest request,
            @RequestHeader(value = "X-Role", required = false) String role) {
        if (!"ADMINISTRADOR".equals(role)) {
            return ResponseEntity.status(403).body("Acceso denegado: Se requiere rol ADMINISTRADOR");
        }
        return ResponseEntity.ok(productoService.modificarStock(id, request));
    }

    @PostMapping(value = "/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir foto del producto")
    public ResponseEntity<Producto> guardarFoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(productoService.guardarFoto(id, file));
    }

    @GetMapping("/{id}/foto")
    @Operation(summary = "Obtener foto del producto")
    public ResponseEntity<byte[]> obtenerFoto(@PathVariable Long id) {
        try {
            byte[] imagen = productoService.obtenerFoto(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imagen);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
