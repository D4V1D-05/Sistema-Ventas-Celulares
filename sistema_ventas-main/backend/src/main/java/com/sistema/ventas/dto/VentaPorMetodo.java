package com.sistema.ventas.dto;


import java.math.BigDecimal;

public class VentaPorMetodo {
    private String metodoPago;
    private BigDecimal total;
    private Long cantidad;

    public VentaPorMetodo() {
    }

    public VentaPorMetodo(String metodoPago, BigDecimal total, Long cantidad) {
        this.metodoPago = metodoPago;
        this.total = total;
        this.cantidad = cantidad;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public Long getCantidad() {
        return cantidad;
    }

    public void setCantidad(Long cantidad) {
        this.cantidad = cantidad;
    }
}
