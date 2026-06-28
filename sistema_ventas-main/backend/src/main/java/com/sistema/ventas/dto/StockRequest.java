package com.sistema.ventas.dto;


public class StockRequest {
    private Integer cantidad;
    private String operacion; // AGREGAR, DISMINUIR

    public StockRequest() {
    }

    public StockRequest(Integer cantidad, String operacion) {
        this.cantidad = cantidad;
        this.operacion = operacion;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getOperacion() {
        return operacion;
    }

    public void setOperacion(String operacion) {
        this.operacion = operacion;
    }
}
