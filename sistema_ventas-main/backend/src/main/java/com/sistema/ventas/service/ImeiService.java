package com.sistema.ventas.service;

import com.sistema.ventas.dto.ImeiAlertaDTO;
import com.sistema.ventas.dto.ImeiRequest;
import com.sistema.ventas.dto.MultipleImeiRequest;
import com.sistema.ventas.model.Imei;
import com.sistema.ventas.model.Producto;
import com.sistema.ventas.model.Venta;
import com.sistema.ventas.repository.ImeiRepository;
import com.sistema.ventas.repository.IngresoEquipoRepository;
import com.sistema.ventas.repository.ProductoRepository;
import com.sistema.ventas.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImeiService {
    private final ImeiRepository imeiRepository;
    private final ProductoRepository productoRepository;
    private final IngresoEquipoRepository ingresoEquipoRepository;
    private final VentaRepository ventaRepository;

    public ImeiService(ImeiRepository imeiRepository, 
                       ProductoRepository productoRepository,
                       IngresoEquipoRepository ingresoEquipoRepository,
                       VentaRepository ventaRepository) {
        this.imeiRepository = imeiRepository;
        this.productoRepository = productoRepository;
        this.ingresoEquipoRepository = ingresoEquipoRepository;
        this.ventaRepository = ventaRepository;
    }

    public List<Imei> findAll() {
        return imeiRepository.findAll();
    }

    @Transactional
    public Imei registrar(ImeiRequest request) {
        // Validate IMEI is exactly 15 digits
        if (request.getImei() == null || !request.getImei().matches("\\d{15}")) {
            throw new RuntimeException("El IMEI debe tener exactamente 15 dígitos numéricos");
        }

        // Check if IMEI already exists
        if (imeiRepository.findByImei(request.getImei()).isPresent()) {
            throw new RuntimeException("El IMEI ya está registrado: " + request.getImei());
        }

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + request.getProductoId()));

        Imei imei = new Imei();
        imei.setImei(request.getImei());
        imei.setProducto(producto);
        imei.setEstado("DISPONIBLE");
        imei.setFechaRegistro(LocalDateTime.now());

        Imei savedImei = imeiRepository.save(imei);

        // Incrementar stock en +1
        producto.setStock(producto.getStock() + 1);
        productoRepository.save(producto);

        return savedImei;
    }

    @Transactional
    public List<Imei> registrarMultiple(MultipleImeiRequest request) {
        if (request.getImeis() == null || request.getImeis().isEmpty()) {
            throw new RuntimeException("La lista de IMEIs no puede estar vacía");
        }

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + request.getProductoId()));

        List<Imei> savedImeis = new ArrayList<>();

        for (String imeiVal : request.getImeis()) {
            if (imeiVal == null || !imeiVal.trim().matches("\\d{15}")) {
                throw new RuntimeException("El IMEI '" + imeiVal + "' debe tener exactamente 15 dígitos numéricos");
            }

            if (imeiRepository.findByImei(imeiVal.trim()).isPresent()) {
                throw new RuntimeException("El IMEI ya está registrado: " + imeiVal);
            }

            Imei imei = new Imei();
            imei.setImei(imeiVal.trim());
            imei.setProducto(producto);
            imei.setEstado("DISPONIBLE");
            imei.setFechaRegistro(LocalDateTime.now());
            savedImeis.add(imeiRepository.save(imei));

            // Incrementar stock en +1 por cada IMEI exitoso
            producto.setStock(producto.getStock() + 1);
        }

        productoRepository.save(producto);

        return savedImeis;
    }

    public List<ImeiAlertaDTO> obtenerAlertas() {
        List<Producto> productos = productoRepository.findAll();
        List<ImeiAlertaDTO> alertas = new ArrayList<>();

        for (Producto prod : productos) {
            long comprado = ingresoEquipoRepository.sumCantidadByProductoId(prod.getId());
            long registrado = imeiRepository.countByProductoId(prod.getId());
            long pendientes = comprado - registrado;

            if (pendientes > 0) {
                alertas.add(new ImeiAlertaDTO(
                    prod.getId(),
                    prod.getMarca(),
                    prod.getModelo(),
                    comprado,
                    registrado,
                    pendientes
                ));
            }
        }

        return alertas;
    }

    public Imei findByImei(String imei) {
        return imeiRepository.findByImei(imei)
                .orElseThrow(() -> new RuntimeException("IMEI no encontrado: " + imei));
    }

    public List<Imei> obtenerDisponiblesPorProducto(Long productoId) {
        return imeiRepository.findByProductoIdAndEstado(productoId, "DISPONIBLE");
    }

    public Imei cambiarEstado(Long id, String estado) {
        Imei imei = imeiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("IMEI no encontrado con id: " + id));

        if (!"DISPONIBLE".equals(estado) && !"VENDIDO".equals(estado)) {
            throw new RuntimeException("Estado no válido. Use DISPONIBLE o VENDIDO");
        }

        imei.setEstado(estado);
        return imeiRepository.save(imei);
    }

    public Map<String, Object> obtenerResumenQR(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Modelo no encontrado con id: " + productoId));

        List<Imei> imeis = imeiRepository.findByProductoId(productoId);

        List<Map<String, Object>> imeisSimplificados = imeis.stream().map(i -> {
            Map<String, Object> map = new HashMap<>();
            map.put("imei", i.getImei());
            map.put("estado", i.getEstado());
            return map;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("producto", producto);
        response.put("imeis", imeisSimplificados);
        return response;
    }

    public Map<String, Object> obtenerTrazabilidad(String imeiCode) {
        Imei imei = imeiRepository.findByImei(imeiCode)
                .orElseThrow(() -> new RuntimeException("IMEI no registrado: " + imeiCode));

        Map<String, Object> response = new HashMap<>();
        response.put("imei", imei.getImei());
        response.put("estado", imei.getEstado());
        response.put("fechaRegistro", imei.getFechaRegistro());
        response.put("producto", imei.getProducto());

        if ("VENDIDO".equals(imei.getEstado()) && imei.getVentaId() != null) {
            Optional<Venta> ventaOpt = ventaRepository.findById(imei.getVentaId());
            if (ventaOpt.isPresent()) {
                Venta venta = ventaOpt.get();
                Map<String, Object> cliente = new HashMap<>();
                cliente.put("nombre", venta.getClienteNombre());
                cliente.put("documento", venta.getClienteDocumento());
                cliente.put("telefono", venta.getClienteTelefono());
                cliente.put("direccion", venta.getClienteDireccion());
                cliente.put("fechaVenta", venta.getFecha());
                response.put("cliente", cliente);
            }
        }
        return response;
    }
}
