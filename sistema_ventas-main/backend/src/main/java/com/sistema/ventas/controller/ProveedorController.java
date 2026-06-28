package com.sistema.ventas.controller;

import com.sistema.ventas.model.Proveedor;
import com.sistema.ventas.service.ProveedorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "*")
@Tag(name = "Proveedores", description = "API para la gestión de proveedores")
public class ProveedorController {

    private final ProveedorService proveedorService;

    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los proveedores")
    public ResponseEntity<List<Proveedor>> findAll() {
        return ResponseEntity.ok(proveedorService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener proveedor por ID")
    public ResponseEntity<Proveedor> findById(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo proveedor")
    public ResponseEntity<Proveedor> crear(@RequestBody Proveedor proveedor) {
        return ResponseEntity.ok(proveedorService.crear(proveedor));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar proveedor existente")
    public ResponseEntity<Proveedor> actualizar(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        return ResponseEntity.ok(proveedorService.actualizar(id, proveedor));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar proveedor")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        proveedorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
