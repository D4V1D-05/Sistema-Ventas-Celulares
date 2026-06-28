package com.sistema.ventas.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String modelo;

    @Column(nullable = false, length = 50)
    private String marca; // Samsung, Apple, Xiaomi

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Column(length = 20)
    private String estado = "DISPONIBLE"; // DISPONIBLE, AGOTADO

    @Column(name = "procesador", length = 150)
    private String procesador;

    @Column(name = "ram", length = 50)
    private String ram;

    @Column(name = "almacenamiento", length = 50)
    private String almacenamiento;

    @Column(name = "bateria", length = 50)
    private String bateria;

    @Column(name = "camara_principal", length = 100)
    private String camaraPrincipal;

    @Column(name = "camara_frontal", length = 100)
    private String camaraFrontal;

    @Column(name = "pantalla", length = 50)
    private String pantalla;

    @Column(name = "red", length = 20)
    private String red;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Imei> imeis;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<IngresoEquipo> ingresos;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<DetalleVenta> detalles;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        actualizarEstado();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        actualizarEstado();
    }

    private void actualizarEstado() {
        if (this.stock != null && this.stock == 0) {
            this.estado = "AGOTADO";
        } else {
            this.estado = "DISPONIBLE";
        }
    }

    public Producto() {
    }

    public Producto(Long id, String modelo, String marca, BigDecimal precio, Integer stock, String fotoUrl, String estado, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.modelo = modelo;
        this.marca = marca;
        this.precio = precio;
        this.stock = stock;
        this.fotoUrl = fotoUrl;
        this.estado = estado;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getProcesador() {
        return procesador;
    }

    public void setProcesador(String procesador) {
        this.procesador = procesador;
    }

    public String getRam() {
        return ram;
    }

    public void setRam(String ram) {
        this.ram = ram;
    }

    public String getAlmacenamiento() {
        return almacenamiento;
    }

    public void setAlmacenamiento(String almacenamiento) {
        this.almacenamiento = almacenamiento;
    }

    public String getBateria() {
        return bateria;
    }

    public void setBateria(String bateria) {
        this.bateria = bateria;
    }

    public String getCamaraPrincipal() {
        return camaraPrincipal;
    }

    public void setCamaraPrincipal(String camaraPrincipal) {
        this.camaraPrincipal = camaraPrincipal;
    }

    public String getCamaraFrontal() {
        return camaraFrontal;
    }

    public void setCamaraFrontal(String camaraFrontal) {
        this.camaraFrontal = camaraFrontal;
    }

    public String getPantalla() {
        return pantalla;
    }

    public void setPantalla(String pantalla) {
        this.pantalla = pantalla;
    }

    public String getRed() {
        return red;
    }

    public void setRed(String red) {
        this.red = red;
    }

    public List<Imei> getImeis() {
        return imeis;
    }

    public void setImeis(List<Imei> imeis) {
        this.imeis = imeis;
    }

    public List<IngresoEquipo> getIngresos() {
        return ingresos;
    }

    public void setIngresos(List<IngresoEquipo> ingresos) {
        this.ingresos = ingresos;
    }

    public List<DetalleVenta> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleVenta> detalles) {
        this.detalles = detalles;
    }
}
