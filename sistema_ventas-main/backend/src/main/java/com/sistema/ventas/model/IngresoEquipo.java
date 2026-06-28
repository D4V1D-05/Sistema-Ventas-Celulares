package com.sistema.ventas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ingresos_equipos")
public class IngresoEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaIngreso;

    @Column(nullable = false)
    private Integer cantidad;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;

    @PrePersist
    protected void onCreate() {
        if (this.fechaIngreso == null) {
            this.fechaIngreso = LocalDateTime.now();
        }
    }

    public IngresoEquipo() {
    }

    public IngresoEquipo(Long id, LocalDateTime fechaIngreso, Integer cantidad, Producto producto, Proveedor proveedor) {
        this.id = id;
        this.fechaIngreso = fechaIngreso;
        this.cantidad = cantidad;
        this.producto = producto;
        this.proveedor = proveedor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDateTime fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }
}
