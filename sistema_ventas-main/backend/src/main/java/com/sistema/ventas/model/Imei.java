package com.sistema.ventas.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "imeis")
public class Imei {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 15)
    private String imei;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @Column(length = 20)
    private String estado = "DISPONIBLE"; // DISPONIBLE, VENDIDO

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(name = "venta_id")
    private Long ventaId;

    @PrePersist
    protected void onCreate() {
        if (this.fechaRegistro == null) {
            this.fechaRegistro = LocalDateTime.now();
        }
        if (this.estado == null) {
            this.estado = "DISPONIBLE";
        }
    }

    public Imei() {
    }

    public Imei(Long id, String imei, Producto producto, String estado, LocalDateTime fechaRegistro, Long ventaId) {
        this.id = id;
        this.imei = imei;
        this.producto = producto;
        this.estado = estado;
        this.fechaRegistro = fechaRegistro;
        this.ventaId = ventaId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImei() {
        return imei;
    }

    public void setImei(String imei) {
        this.imei = imei;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Long getVentaId() {
        return ventaId;
    }

    public void setVentaId(Long ventaId) {
        this.ventaId = ventaId;
    }
}
