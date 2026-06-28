package com.sistema.ventas.dto;


import java.math.BigDecimal;
import java.util.List;

public class VentaRequest {
    private Long vendedorId;
    private String metodoPago;
    private BigDecimal descuentoPorcentaje;
    private BigDecimal interesPorcentaje;
    private Integer numeroCuotas;
    private List<VentaItemRequest> items;
    private String clienteNombre;
    private String clienteDocumento;
    private String clienteTelefono;
    private String clienteDireccion;

    public VentaRequest() {
    }

    public VentaRequest(Long vendedorId, String metodoPago, BigDecimal descuentoPorcentaje, BigDecimal interesPorcentaje, Integer numeroCuotas, List<VentaItemRequest> items, String clienteNombre, String clienteDocumento, String clienteTelefono, String clienteDireccion) {
        this.vendedorId = vendedorId;
        this.metodoPago = metodoPago;
        this.descuentoPorcentaje = descuentoPorcentaje;
        this.interesPorcentaje = interesPorcentaje;
        this.numeroCuotas = numeroCuotas;
        this.items = items;
        this.clienteNombre = clienteNombre;
        this.clienteDocumento = clienteDocumento;
        this.clienteTelefono = clienteTelefono;
        this.clienteDireccion = clienteDireccion;
    }

    public Long getVendedorId() {
        return vendedorId;
    }

    public void setVendedorId(Long vendedorId) {
        this.vendedorId = vendedorId;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public BigDecimal getDescuentoPorcentaje() {
        return descuentoPorcentaje;
    }

    public void setDescuentoPorcentaje(BigDecimal descuentoPorcentaje) {
        this.descuentoPorcentaje = descuentoPorcentaje;
    }

    public BigDecimal getInteresPorcentaje() {
        return interesPorcentaje;
    }

    public void setInteresPorcentaje(BigDecimal interesPorcentaje) {
        this.interesPorcentaje = interesPorcentaje;
    }

    public Integer getNumeroCuotas() {
        return numeroCuotas;
    }

    public void setNumeroCuotas(Integer numeroCuotas) {
        this.numeroCuotas = numeroCuotas;
    }

    public List<VentaItemRequest> getItems() {
        return items;
    }

    public void setItems(List<VentaItemRequest> items) {
        this.items = items;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteDocumento() {
        return clienteDocumento;
    }

    public void setClienteDocumento(String clienteDocumento) {
        this.clienteDocumento = clienteDocumento;
    }

    public String getClienteTelefono() {
        return clienteTelefono;
    }

    public void setClienteTelefono(String clienteTelefono) {
        this.clienteTelefono = clienteTelefono;
    }

    public String getClienteDireccion() {
        return clienteDireccion;
    }

    public void setClienteDireccion(String clienteDireccion) {
        this.clienteDireccion = clienteDireccion;
    }
}
