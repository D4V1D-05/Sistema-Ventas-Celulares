package com.sistema.ventas.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ventas")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendedor_id")
    private Usuario vendedor;

    @Column(name = "metodo_pago", length = 20)
    private String metodoPago; // CONTADO, CUOTAS

    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "descuento_porcentaje", precision = 5, scale = 2)
    private BigDecimal descuentoPorcentaje = BigDecimal.ZERO;

    @Column(name = "interes_porcentaje", precision = 5, scale = 2)
    private BigDecimal interesPorcentaje = BigDecimal.ZERO;

    @Column(name = "numero_cuotas")
    private Integer numeroCuotas = 0;

    @Column(name = "monto_cuota", precision = 10, scale = 2)
    private BigDecimal montoCuota = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal total;

    private LocalDateTime fecha;

    @Column(name = "cliente_nombre", length = 150)
    private String clienteNombre;

    @Column(name = "cliente_documento", length = 20)
    private String clienteDocumento;

    @Column(name = "cliente_telefono", length = 20)
    private String clienteTelefono;

    @Column(name = "cliente_direccion", length = 250)
    private String clienteDireccion;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "venta_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<Imei> imeis = new ArrayList<>();

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<DetalleVenta> detalles = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.fecha == null) {
            this.fecha = LocalDateTime.now();
        }
    }

    public Venta() {
    }

    public Venta(Long id, Usuario vendedor, String metodoPago, BigDecimal subtotal, BigDecimal descuentoPorcentaje, BigDecimal interesPorcentaje, Integer numeroCuotas, BigDecimal montoCuota, BigDecimal total, LocalDateTime fecha, List<DetalleVenta> detalles) {
        this.id = id;
        this.vendedor = vendedor;
        this.metodoPago = metodoPago;
        this.subtotal = subtotal;
        this.descuentoPorcentaje = descuentoPorcentaje;
        this.interesPorcentaje = interesPorcentaje;
        this.numeroCuotas = numeroCuotas;
        this.montoCuota = montoCuota;
        this.total = total;
        this.fecha = fecha;
        this.detalles = detalles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getVendedor() {
        return vendedor;
    }

    public void setVendedor(Usuario vendedor) {
        this.vendedor = vendedor;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
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

    public BigDecimal getMontoCuota() {
        return montoCuota;
    }

    public void setMontoCuota(BigDecimal montoCuota) {
        this.montoCuota = montoCuota;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public List<DetalleVenta> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleVenta> detalles) {
        this.detalles = detalles;
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

    public List<Imei> getImeis() {
        return imeis;
    }

    public void setImeis(List<Imei> imeis) {
        this.imeis = imeis;
    }
}
