package com.sistema.ventas.service;

import com.sistema.ventas.model.Proveedor;
import com.sistema.ventas.repository.ProveedorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    public List<Proveedor> findAll() {
        return proveedorRepository.findAll();
    }

    public Proveedor findById(Long id) {
        return proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id: " + id));
    }

    public Proveedor crear(Proveedor proveedor) {
        if (proveedor.getRuc() == null || proveedor.getRuc().trim().isEmpty()) {
            throw new RuntimeException("El RUC es requerido");
        }
        if (proveedorRepository.findByRuc(proveedor.getRuc()).isPresent()) {
            throw new RuntimeException("El RUC " + proveedor.getRuc() + " ya está registrado");
        }
        return proveedorRepository.save(proveedor);
    }

    public Proveedor actualizar(Long id, Proveedor proveedor) {
        Proveedor existing = findById(id);
        
        if (proveedor.getRuc() == null || proveedor.getRuc().trim().isEmpty()) {
            throw new RuntimeException("El RUC es requerido");
        }
        
        proveedorRepository.findByRuc(proveedor.getRuc()).ifPresent(p -> {
            if (!p.getId().equals(id)) {
                throw new RuntimeException("El RUC " + proveedor.getRuc() + " ya está registrado por otro proveedor");
            }
        });

        existing.setEmpresa(proveedor.getEmpresa());
        existing.setRuc(proveedor.getRuc());
        existing.setProveedorContacto(proveedor.getProveedorContacto());
        existing.setTelefono(proveedor.getTelefono());
        existing.setCorreo(proveedor.getCorreo());
        existing.setDireccion(proveedor.getDireccion());

        return proveedorRepository.save(existing);
    }

    public void eliminar(Long id) {
        Proveedor proveedor = findById(id);
        proveedorRepository.delete(proveedor);
    }
}
