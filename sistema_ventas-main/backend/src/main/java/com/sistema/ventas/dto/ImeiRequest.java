package com.sistema.ventas.dto;


public class ImeiRequest {
    private String imei;
    private Long productoId;

    public ImeiRequest() {
    }

    public ImeiRequest(String imei, Long productoId) {
        this.imei = imei;
        this.productoId = productoId;
    }

    public String getImei() {
        return imei;
    }

    public void setImei(String imei) {
        this.imei = imei;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }
}
