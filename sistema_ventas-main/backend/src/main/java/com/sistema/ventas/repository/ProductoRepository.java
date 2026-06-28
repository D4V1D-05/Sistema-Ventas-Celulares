package com.sistema.ventas.repository;

import com.sistema.ventas.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByMarca(String marca);

    List<Producto> findByModeloContainingIgnoreCase(String modelo);

    List<Producto> findByMarcaAndModeloContainingIgnoreCase(String marca, String modelo);
}
