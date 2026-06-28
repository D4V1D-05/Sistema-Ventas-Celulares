package com.sistema.ventas.dto;

import java.util.List;

public class VentaItemRequest {
    private Long productoId;
    private Integer cantidad;
    private List<String> imeis;

    public VentaItemRequest() {
    }

    public VentaItemRequest(Long productoId, Integer cantidad) {
        this.productoId = productoId;
        this.cantidad = cantidad;
    }

    public VentaItemRequest(Long productoId, Integer cantidad, List<String> imeis) {
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.imeis = imeis;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public List<String> getImeis() {
        return imeis;
    }

    public void setImeis(List<String> imeis) {
        this.imeis = imeis;
    }
}

