package com.sistema.ventas.controller;

import com.sistema.ventas.model.IngresoEquipo;
import com.sistema.ventas.service.IngresoEquipoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingresos-equipos")
@CrossOrigin(origins = "*")
@Tag(name = "Ingresos de Equipos", description = "API para la gestión del ingreso de equipos")
public class IngresoEquipoController {

    private final IngresoEquipoService ingresoEquipoService;

    public IngresoEquipoController(IngresoEquipoService ingresoEquipoService) {
        this.ingresoEquipoService = ingresoEquipoService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los ingresos de equipos")
    public ResponseEntity<List<IngresoEquipo>> findAll() {
        return ResponseEntity.ok(ingresoEquipoService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener registro de ingreso por ID")
    public ResponseEntity<IngresoEquipo> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ingresoEquipoService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Registrar un nuevo ingreso de equipos")
    public ResponseEntity<IngresoEquipo> registrar(@RequestBody IngresoEquipo ingreso) {
        return ResponseEntity.ok(ingresoEquipoService.registrar(ingreso));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un registro de ingreso y revertir stock")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ingresoEquipoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
