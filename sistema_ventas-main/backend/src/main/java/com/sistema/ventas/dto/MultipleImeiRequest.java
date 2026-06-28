package com.sistema.ventas.dto;

import java.util.List;

public class MultipleImeiRequest {
    private List<String> imeis;
    private Long productoId;

    public MultipleImeiRequest() {
    }

    public MultipleImeiRequest(List<String> imeis, Long productoId) {
        this.imeis = imeis;
        this.productoId = productoId;
    }

    public List<String> getImeis() {
        return imeis;
    }

    public void setImeis(List<String> imeis) {
        this.imeis = imeis;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }
}
