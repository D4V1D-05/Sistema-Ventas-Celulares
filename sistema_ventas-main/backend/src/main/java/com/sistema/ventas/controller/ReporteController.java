package com.sistema.ventas.controller;

import com.sistema.ventas.dto.ProductoMasVendido;
import com.sistema.ventas.dto.ReporteResumen;
import com.sistema.ventas.dto.VentaPorDia;
import com.sistema.ventas.dto.VentaPorMetodo;
import com.sistema.ventas.service.ReporteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
@Tag(name = "Reportes", description = "API para gráficos y reportes analíticos")
public class ReporteController {
    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }


    private final ReporteService reporteService;

    @GetMapping("/ventas-por-dia")
    @Operation(summary = "Ventas agrupadas por día del mes")
    public ResponseEntity<List<VentaPorDia>> ventasPorDia(@RequestParam int mes, @RequestParam int anio) {
        return ResponseEntity.ok(reporteService.ventasPorDia(mes, anio));
    }

    @GetMapping("/ventas-por-metodo")
    @Operation(summary = "Ventas agrupadas por método de pago")
    public ResponseEntity<List<VentaPorMetodo>> ventasPorMetodo(@RequestParam int mes, @RequestParam int anio) {
        return ResponseEntity.ok(reporteService.ventasPorMetodo(mes, anio));
    }

    @GetMapping("/productos-mas-vendidos")
    @Operation(summary = "Top de productos más vendidos")
    public ResponseEntity<List<ProductoMasVendido>> productosMasVendidos(@RequestParam int mes, @RequestParam int anio) {
        return ResponseEntity.ok(reporteService.productosMasVendidos(mes, anio));
    }

    @GetMapping("/resumen")
    @Operation(summary = "Resumen numérico del mes")
    public ResponseEntity<ReporteResumen> resumen(@RequestParam int mes, @RequestParam int anio) {
        return ResponseEntity.ok(reporteService.resumen(mes, anio));
    }
}
