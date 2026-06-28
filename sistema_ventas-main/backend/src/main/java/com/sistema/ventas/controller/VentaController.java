package com.sistema.ventas.controller;

import com.sistema.ventas.dto.VentaRequest;
import com.sistema.ventas.model.Venta;
import com.sistema.ventas.service.VentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
@Tag(name = "Ventas", description = "API para registro y consulta de ventas")
public class VentaController {
    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }


    private final VentaService ventaService;

    @PostMapping
    @Operation(summary = "Registrar nueva venta")
    public ResponseEntity<Venta> registrarVenta(@RequestBody VentaRequest request) {
        return ResponseEntity.ok(ventaService.registrarVenta(request));
    }

    @GetMapping
    @Operation(summary = "Listar todas las ventas")
    public ResponseEntity<List<Venta>> findAll() {
        return ResponseEntity.ok(ventaService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de venta por ID")
    public ResponseEntity<Venta> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.findById(id));
    }
}
