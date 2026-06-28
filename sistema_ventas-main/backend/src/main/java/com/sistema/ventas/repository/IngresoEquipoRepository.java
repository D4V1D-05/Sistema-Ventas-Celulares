package com.sistema.ventas.repository;

import com.sistema.ventas.model.IngresoEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IngresoEquipoRepository extends JpaRepository<IngresoEquipo, Long> {

    @Query("SELECT COALESCE(SUM(i.cantidad), 0) FROM IngresoEquipo i WHERE i.producto.id = :productoId")
    long sumCantidadByProductoId(@Param("productoId") Long productoId);
}
