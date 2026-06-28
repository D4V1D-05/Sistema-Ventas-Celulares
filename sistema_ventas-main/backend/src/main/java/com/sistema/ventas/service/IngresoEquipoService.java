package com.sistema.ventas.service;

import com.sistema.ventas.model.IngresoEquipo;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.model.Proveedor;
import com.sistema.ventas.repository.IngresoEquipoRepository;
import com.sistema.ventas.repository.ProductoRepository;
import com.sistema.ventas.repository.ProveedorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IngresoEquipoService {

    private final IngresoEquipoRepository ingresoEquipoRepository;
    private final ProductoRepository productoRepository;
    private final ProveedorRepository proveedorRepository;

    public IngresoEquipoService(IngresoEquipoRepository ingresoEquipoRepository,
                                ProductoRepository productoRepository,
                                ProveedorRepository proveedorRepository) {
        this.ingresoEquipoRepository = ingresoEquipoRepository;
        this.productoRepository = productoRepository;
        this.proveedorRepository = proveedorRepository;
    }

    public List<IngresoEquipo> findAll() {
        return ingresoEquipoRepository.findAll();
    }

    public IngresoEquipo findById(Long id) {
        return ingresoEquipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de ingreso no encontrado con id: " + id));
    }

    @Transactional
    public IngresoEquipo registrar(IngresoEquipo request) {
        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a cero");
        }
        if (request.getProducto() == null || request.getProducto().getId() == null) {
            throw new RuntimeException("El producto es requerido");
        }
        if (request.getProveedor() == null || request.getProveedor().getId() == null) {
            throw new RuntimeException("El proveedor es requerido");
        }

        Producto producto = productoRepository.findById(request.getProducto().getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + request.getProducto().getId()));

        Proveedor proveedor = proveedorRepository.findById(request.getProveedor().getId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id: " + request.getProveedor().getId()));

        IngresoEquipo ingreso = new IngresoEquipo();
        ingreso.setProducto(producto);
        ingreso.setProveedor(proveedor);
        ingreso.setCantidad(request.getCantidad());
        if (request.getFechaIngreso() != null) {
            ingreso.setFechaIngreso(request.getFechaIngreso());
        } else {
            ingreso.setFechaIngreso(LocalDateTime.now());
        }

        return ingresoEquipoRepository.save(ingreso);
    }

    @Transactional
    public void eliminar(Long id) {
        IngresoEquipo ingreso = findById(id);
        ingresoEquipoRepository.delete(ingreso);
    }
}
