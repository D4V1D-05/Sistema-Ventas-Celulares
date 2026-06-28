package com.sistema.ventas.controller;

import com.sistema.ventas.dto.ImeiAlertaDTO;
import com.sistema.ventas.dto.ImeiRequest;
import com.sistema.ventas.dto.MultipleImeiRequest;
import com.sistema.ventas.model.Imei;
import com.sistema.ventas.service.ImeiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/imeis")
@CrossOrigin(origins = "*")
@Tag(name = "IMEI", description = "API para gestión de IMEIs")
public class ImeiController {
    public ImeiController(ImeiService imeiService) {
        this.imeiService = imeiService;
    }


    private final ImeiService imeiService;

    @GetMapping
    @Operation(summary = "Listar todos los IMEIs registrados")
    public ResponseEntity<List<Imei>> findAll() {
        return ResponseEntity.ok(imeiService.findAll());
    }

    @PostMapping
    @Operation(summary = "Registrar nuevo IMEI")
    public ResponseEntity<Imei> registrar(@RequestBody ImeiRequest request) {
        return ResponseEntity.ok(imeiService.registrar(request));
    }

    @PostMapping("/multiple")
    @Operation(summary = "Registrar múltiples IMEIs")
    public ResponseEntity<List<Imei>> registrarMultiple(@RequestBody MultipleImeiRequest request) {
        return ResponseEntity.ok(imeiService.registrarMultiple(request));
    }

    @GetMapping("/producto/{productoId}/disponibles")
    @Operation(summary = "Obtener IMEIs disponibles para un producto")
    public ResponseEntity<List<Imei>> obtenerDisponiblesPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(imeiService.obtenerDisponiblesPorProducto(productoId));
    }

    @GetMapping("/alertas")
    @Operation(summary = "Obtener alertas de IMEIs pendientes por registrar")
    public ResponseEntity<List<ImeiAlertaDTO>> obtenerAlertas() {
        return ResponseEntity.ok(imeiService.obtenerAlertas());
    }

    @GetMapping("/{imei}")
    @Operation(summary = "Buscar detalles de un IMEI específico")
    public ResponseEntity<Imei> findByImei(@PathVariable String imei) {
        return ResponseEntity.ok(imeiService.findByImei(imei));
    }

    @PutMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado del IMEI (DISPONIBLE/VENDIDO)")
    public ResponseEntity<Imei> cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(imeiService.cambiarEstado(id, estado));
    }

    @GetMapping("/producto/{productoId}/resumen-qr")
    @Operation(summary = "Obtener resumen del modelo y sus IMEIs para QR")
    public ResponseEntity<Map<String, Object>> obtenerResumenQR(@PathVariable Long productoId) {
        return ResponseEntity.ok(imeiService.obtenerResumenQR(productoId));
    }

    @GetMapping("/trazabilidad/{imei}")
    @Operation(summary = "Obtener trazabilidad completa de un IMEI y datos de venta")
    public ResponseEntity<Map<String, Object>> obtenerTrazabilidad(@PathVariable String imei) {
        return ResponseEntity.ok(imeiService.obtenerTrazabilidad(imei));
    }
}
