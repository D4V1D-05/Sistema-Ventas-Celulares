package com.sistema.ventas.dto;


import java.math.BigDecimal;

public class ReporteResumen {
    private String mesActual;
    private BigDecimal totalVentas;
    private Long cantidadTransacciones;
    private BigDecimal promedioPorVenta;

    public ReporteResumen() {
    }

    public ReporteResumen(String mesActual, BigDecimal totalVentas, Long cantidadTransacciones, BigDecimal promedioPorVenta) {
        this.mesActual = mesActual;
        this.totalVentas = totalVentas;
        this.cantidadTransacciones = cantidadTransacciones;
        this.promedioPorVenta = promedioPorVenta;
    }

    public String getMesActual() {
        return mesActual;
    }

    public void setMesActual(String mesActual) {
        this.mesActual = mesActual;
    }

    public BigDecimal getTotalVentas() {
        return totalVentas;
    }

    public void setTotalVentas(BigDecimal totalVentas) {
        this.totalVentas = totalVentas;
    }

    public Long getCantidadTransacciones() {
        return cantidadTransacciones;
    }

    public void setCantidadTransacciones(Long cantidadTransacciones) {
        this.cantidadTransacciones = cantidadTransacciones;
    }

    public BigDecimal getPromedioPorVenta() {
        return promedioPorVenta;
    }

    public void setPromedioPorVenta(BigDecimal promedioPorVenta) {
        this.promedioPorVenta = promedioPorVenta;
    }
}
