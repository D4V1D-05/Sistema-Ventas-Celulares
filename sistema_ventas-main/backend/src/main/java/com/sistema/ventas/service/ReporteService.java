package com.sistema.ventas.service;

import com.sistema.ventas.dto.*;
import com.sistema.ventas.model.Venta;
import com.sistema.ventas.model.DetalleVenta;
import com.sistema.ventas.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReporteService {
    public ReporteService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }


    private final VentaRepository ventaRepository;

    public List<VentaPorDia> ventasPorDia(int mes, int anio) {
        LocalDateTime start = LocalDateTime.of(anio, mes, 1, 0, 0, 0);
        LocalDateTime end = YearMonth.of(anio, mes).atEndOfMonth().atTime(23, 59, 59);

        List<Venta> ventas = ventaRepository.findByFechaBetween(start, end);

        Map<Integer, BigDecimal> ventasPorDiaMap = new TreeMap<>();
        for (Venta venta : ventas) {
            int dia = venta.getFecha().getDayOfMonth();
            ventasPorDiaMap.merge(dia, venta.getTotal(), BigDecimal::add);
        }

        return ventasPorDiaMap.entrySet().stream()
                .map(entry -> new VentaPorDia(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public List<VentaPorMetodo> ventasPorMetodo(int mes, int anio) {
        LocalDateTime start = LocalDateTime.of(anio, mes, 1, 0, 0, 0);
        LocalDateTime end = YearMonth.of(anio, mes).atEndOfMonth().atTime(23, 59, 59);

        List<Venta> ventas = ventaRepository.findByFechaBetween(start, end);

        Map<String, List<Venta>> grouped = ventas.stream()
                .collect(Collectors.groupingBy(Venta::getMetodoPago));

        return grouped.entrySet().stream()
                .map(entry -> {
                    BigDecimal total = entry.getValue().stream()
                            .map(Venta::getTotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new VentaPorMetodo(entry.getKey(), total, (long) entry.getValue().size());
                })
                .collect(Collectors.toList());
    }

    public List<ProductoMasVendido> productosMasVendidos(int mes, int anio) {
        LocalDateTime start = LocalDateTime.of(anio, mes, 1, 0, 0, 0);
        LocalDateTime end = YearMonth.of(anio, mes).atEndOfMonth().atTime(23, 59, 59);

        List<Venta> ventas = ventaRepository.findByFechaBetween(start, end);

        Map<Long, ProductoMasVendido> productoMap = new HashMap<>();

        for (Venta venta : ventas) {
            for (DetalleVenta detalle : venta.getDetalles()) {
                Long productoId = detalle.getProducto().getId();
                ProductoMasVendido pmv = productoMap.getOrDefault(productoId,
                        new ProductoMasVendido(
                                productoId,
                                detalle.getProducto().getModelo(),
                                detalle.getProducto().getMarca(),
                                0L,
                                BigDecimal.ZERO
                        ));

                pmv.setCantidadVendida(pmv.getCantidadVendida() + detalle.getCantidad());
                pmv.setTotalGenerado(pmv.getTotalGenerado().add(detalle.getSubtotal()));
                productoMap.put(productoId, pmv);
            }
        }

        return productoMap.values().stream()
                .sorted((a, b) -> Long.compare(b.getCantidadVendida(), a.getCantidadVendida()))
                .collect(Collectors.toList());
    }

    public ReporteResumen resumen(int mes, int anio) {
        LocalDateTime start = LocalDateTime.of(anio, mes, 1, 0, 0, 0);
        LocalDateTime end = YearMonth.of(anio, mes).atEndOfMonth().atTime(23, 59, 59);

        List<Venta> ventas = ventaRepository.findByFechaBetween(start, end);

        String mesNombre = YearMonth.of(anio, mes).getMonth()
                .getDisplayName(TextStyle.FULL, new Locale("es", "ES"))
                + " " + anio;

        BigDecimal totalVentas = ventas.stream()
                .map(Venta::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long cantidadTransacciones = ventas.size();

        BigDecimal promedio = cantidadTransacciones > 0
                ? totalVentas.divide(BigDecimal.valueOf(cantidadTransacciones), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new ReporteResumen(mesNombre, totalVentas, cantidadTransacciones, promedio);
    }
}
