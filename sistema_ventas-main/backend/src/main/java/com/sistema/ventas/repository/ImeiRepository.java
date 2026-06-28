package com.sistema.ventas.repository;

import com.sistema.ventas.model.Imei;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImeiRepository extends JpaRepository<Imei, Long> {

    Optional<Imei> findByImei(String imei);

    List<Imei> findByProductoId(Long productoId);

    List<Imei> findByProductoIdAndEstado(Long productoId, String estado);

    List<Imei> findByEstado(String estado);

    long countByProductoId(Long productoId);
}
