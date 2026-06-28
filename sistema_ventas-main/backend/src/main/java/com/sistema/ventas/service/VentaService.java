package com.sistema.ventas.service;

import com.sistema.ventas.dto.VentaItemRequest;
import com.sistema.ventas.dto.VentaRequest;
import com.sistema.ventas.model.*;
import com.sistema.ventas.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class VentaService {
    public VentaService(VentaRepository ventaRepository, UsuarioRepository usuarioRepository, ProductoRepository productoRepository, ImeiRepository imeiRepository) {
        this.ventaRepository = ventaRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.imeiRepository = imeiRepository;
    }


    private final VentaRepository ventaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final ImeiRepository imeiRepository;

    @Transactional
    public Venta registrarVenta(VentaRequest request) {
        Usuario vendedor = usuarioRepository.findById(request.getVendedorId())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        Venta venta = new Venta();
        venta.setVendedor(vendedor);
        venta.setMetodoPago(request.getMetodoPago());
        venta.setFecha(LocalDateTime.now());

        // Set client fields
        venta.setClienteNombre(request.getClienteNombre());
        venta.setClienteDocumento(request.getClienteDocumento());
        venta.setClienteTelefono(request.getClienteTelefono());
        venta.setClienteDireccion(request.getClienteDireccion());

        BigDecimal descuentoPorcentaje = request.getDescuentoPorcentaje() != null
                ? request.getDescuentoPorcentaje() : BigDecimal.ZERO;
        BigDecimal interesPorcentaje = request.getInteresPorcentaje() != null
                ? request.getInteresPorcentaje() : BigDecimal.ZERO;
        Integer numeroCuotas = request.getNumeroCuotas() != null
                ? request.getNumeroCuotas() : 0;

        venta.setDescuentoPorcentaje(descuentoPorcentaje);
        venta.setInteresPorcentaje(interesPorcentaje);
        venta.setNumeroCuotas(numeroCuotas);

        // Calculate subtotal from items and validate stock and IMEIs
        BigDecimal subtotal = BigDecimal.ZERO;
        List<DetalleVenta> detalles = new ArrayList<>();

        for (VentaItemRequest item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

            // Validate stock
            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para " + producto.getModelo()
                        + ". Stock disponible: " + producto.getStock());
            }

            // Validate IMEIs list size matches quantity
            List<String> selectedImeis = item.getImeis();
            if (selectedImeis == null || selectedImeis.size() != item.getCantidad()) {
                throw new RuntimeException("Debe proporcionar exactamente " + item.getCantidad()
                        + " IMEIs para el producto: " + producto.getMarca() + " " + producto.getModelo());
            }

            // Verify each IMEI is available and belongs to this product
            for (String imeiCode : selectedImeis) {
                Imei imei = imeiRepository.findByImei(imeiCode)
                        .orElseThrow(() -> new RuntimeException("IMEI no encontrado: " + imeiCode));

                if (!"DISPONIBLE".equals(imei.getEstado())) {
                    throw new RuntimeException("El IMEI " + imeiCode + " no está disponible (Estado: " + imei.getEstado() + ")");
                }

                if (!imei.getProducto().getId().equals(producto.getId())) {
                    throw new RuntimeException("El IMEI " + imeiCode + " no pertenece al producto seleccionado");
                }
            }

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());

            BigDecimal subtotalItem = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(item.getCantidad()));
            detalle.setSubtotal(subtotalItem);
            subtotal = subtotal.add(subtotalItem);

            detalles.add(detalle);
        }

        venta.setSubtotal(subtotal);
        venta.setDetalles(detalles);

        // Calculate total based on payment method
        BigDecimal total;
        if ("CONTADO".equals(request.getMetodoPago())) {
            // Apply discount
            BigDecimal descuento = subtotal.multiply(descuentoPorcentaje)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            total = subtotal.subtract(descuento);
            venta.setMontoCuota(BigDecimal.ZERO);
        } else {
            // CUOTAS - Apply interest
            BigDecimal interes = subtotal.multiply(interesPorcentaje)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            total = subtotal.add(interes);

            if (numeroCuotas > 0) {
                BigDecimal montoCuota = total.divide(BigDecimal.valueOf(numeroCuotas), 2, RoundingMode.HALF_UP);
                venta.setMontoCuota(montoCuota);
            } else {
                venta.setMontoCuota(total);
            }
        }
        venta.setTotal(total);

        // Save venta first to generate the ID
        Venta savedVenta = ventaRepository.save(venta);

        // Now process stock subtraction and IMEI updates
        for (VentaItemRequest item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId()).orElseThrow();
            
            // Decrease stock
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            // Update IMEI status and link to this sale
            for (String imeiCode : item.getImeis()) {
                Imei imei = imeiRepository.findByImei(imeiCode).orElseThrow();
                imei.setEstado("VENDIDO");
                imei.setVentaId(savedVenta.getId());
                imeiRepository.save(imei);
            }
        }

        return savedVenta;
    }


    public List<Venta> findAll() {
        return ventaRepository.findAll();
    }

    public Venta findById(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con id: " + id));
    }
}
