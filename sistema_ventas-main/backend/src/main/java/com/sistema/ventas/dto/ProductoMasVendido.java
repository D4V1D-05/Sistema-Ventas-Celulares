package com.sistema.ventas.dto;


import java.math.BigDecimal;

public class ProductoMasVendido {
    private Long productoId;
    private String modelo;
    private String marca;
    private Long cantidadVendida;
    private BigDecimal totalGenerado;

    public ProductoMasVendido() {
    }

    public ProductoMasVendido(Long productoId, String modelo, String marca, Long cantidadVendida, BigDecimal totalGenerado) {
        this.productoId = productoId;
        this.modelo = modelo;
        this.marca = marca;
        this.cantidadVendida = cantidadVendida;
        this.totalGenerado = totalGenerado;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public Long getCantidadVendida() {
        return cantidadVendida;
    }

    public void setCantidadVendida(Long cantidadVendida) {
        this.cantidadVendida = cantidadVendida;
    }

    public BigDecimal getTotalGenerado() {
        return totalGenerado;
    }

    public void setTotalGenerado(BigDecimal totalGenerado) {
        this.totalGenerado = totalGenerado;
    }
}
