package com.sistema.ventas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "proveedores")
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String empresa;

    @Column(nullable = false, unique = true, length = 11)
    private String ruc;

    @Column(name = "proveedor_contacto", length = 100)
    private String proveedorContacto;

    @Column(length = 20)
    private String telefono;

    @Column(length = 100)
    private String correo;

    @Column(length = 255)
    private String direccion;

    public Proveedor() {
    }

    public Proveedor(Long id, String empresa, String ruc, String proveedorContacto, String telefono, String correo, String direccion) {
        this.id = id;
        this.empresa = empresa;
        this.ruc = ruc;
        this.proveedorContacto = proveedorContacto;
        this.telefono = telefono;
        this.correo = correo;
        this.direccion = direccion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmpresa() {
        return empresa;
    }

    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }

    public String getRuc() {
        return ruc;
    }

    public void setRuc(String ruc) {
        this.ruc = ruc;
    }

    public String getProveedorContacto() {
        return proveedorContacto;
    }

    public void setProveedorContacto(String proveedorContacto) {
        this.proveedorContacto = proveedorContacto;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}
