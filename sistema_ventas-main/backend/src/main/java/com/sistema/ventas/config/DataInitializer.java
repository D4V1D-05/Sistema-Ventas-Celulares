package com.sistema.ventas.config;

import com.sistema.ventas.model.Producto;
import com.sistema.ventas.model.Usuario;
import com.sistema.ventas.repository.ProductoRepository;
import com.sistema.ventas.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    public DataInitializer(UsuarioRepository usuarioRepository, ProductoRepository productoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }


    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setNombreCompleto("Administrador del Sistema");
            admin.setRol("ADMINISTRADOR");
            admin.setActivo(true);
            admin.setCreatedAt(LocalDateTime.now());
            usuarioRepository.save(admin);

            Usuario vendedor = new Usuario();
            vendedor.setUsername("vendedor");
            vendedor.setPassword("vendedor123");
            vendedor.setNombreCompleto("Vendedor Principal");
            vendedor.setRol("VENDEDOR");
            vendedor.setActivo(true);
            vendedor.setCreatedAt(LocalDateTime.now());
            usuarioRepository.save(vendedor);
        }

        if (productoRepository.count() == 0) {
            crearProducto("iPhone 15 Pro", "Apple", "1200.00", 10);
            crearProducto("Galaxy S24 Ultra", "Samsung", "1100.00", 8);
            crearProducto("Xiaomi 14 Pro", "Xiaomi", "800.00", 15);
            crearProducto("iPhone 14", "Apple", "900.00", 5);
            crearProducto("Galaxy A54", "Samsung", "350.00", 20);
            crearProducto("Redmi Note 13", "Xiaomi", "250.00", 25);
        }
    }

    private void crearProducto(String modelo, String marca, String precioStr, int stock) {
        Producto p = new Producto();
        p.setModelo(modelo);
        p.setMarca(marca);
        p.setPrecio(new BigDecimal(precioStr));
        p.setStock(stock);
        p.setEstado("DISPONIBLE");
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());
        productoRepository.save(p);
    }
}
