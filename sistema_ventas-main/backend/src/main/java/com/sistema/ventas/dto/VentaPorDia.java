package com.sistema.ventas.dto;


import java.math.BigDecimal;

public class VentaPorDia {
    private Integer dia;
    private BigDecimal total;

    public VentaPorDia() {
    }

    public VentaPorDia(Integer dia, BigDecimal total) {
        this.dia = dia;
        this.total = total;
    }

    public Integer getDia() {
        return dia;
    }

    public void setDia(Integer dia) {
        this.dia = dia;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
