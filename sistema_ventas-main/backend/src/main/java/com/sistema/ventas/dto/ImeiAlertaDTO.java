package com.sistema.ventas.dto;

public class ImeiAlertaDTO {
    private Long productoId;
    private String marca;
    private String modelo;
    private long comprado;
    private long registrado;
    private long pendientes;

    public ImeiAlertaDTO() {
    }

    public ImeiAlertaDTO(Long productoId, String marca, String modelo, long comprado, long registrado, long pendientes) {
        this.productoId = productoId;
        this.marca = marca;
        this.modelo = modelo;
        this.comprado = comprado;
        this.registrado = registrado;
        this.pendientes = pendientes;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public long getComprado() {
        return comprado;
    }

    public void setComprado(long comprado) {
        this.comprado = comprado;
    }

    public long getRegistrado() {
        return registrado;
    }

    public void setRegistrado(long registrado) {
        this.registrado = registrado;
    }

    public long getPendientes() {
        return pendientes;
    }

    public void setPendientes(long pendientes) {
        this.pendientes = pendientes;
    }
}
