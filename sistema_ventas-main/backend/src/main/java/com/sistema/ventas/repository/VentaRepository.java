package com.sistema.ventas.repository;

import com.sistema.ventas.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    List<Venta> findByFechaBetween(LocalDateTime start, LocalDateTime end);

    List<Venta> findByVendedorId(Long vendedorId);
}
