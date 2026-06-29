-- ====================================================================
-- SCRIPT DE BASE DE DATOS PARA EL SISTEMA DE VENTAS
-- COMPATIBLE CON MYSQL
-- ====================================================================

CREATE DATABASE IF NOT EXISTS sistema_ventas_celulares;
USE sistema_ventas_celulares;

-- Desactivar restricciones de claves foráneas temporalmente para evitar conflictos al limpiar
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS imeis;
DROP TABLE IF EXISTS ingresos_equipos;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. Tabla: usuarios
-- --------------------------------------------------------------------
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    rol VARCHAR(20), -- 'ADMINISTRADOR', 'VENDEDOR'
    activo BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Tabla: proveedores
-- --------------------------------------------------------------------
CREATE TABLE proveedores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empresa VARCHAR(100) NOT NULL,
    ruc VARCHAR(11) NOT NULL UNIQUE,
    proveedor_contacto VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Tabla: productos
-- --------------------------------------------------------------------
CREATE TABLE productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    foto_url VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'DISPONIBLE', -- 'DISPONIBLE', 'AGOTADO'
    procesador VARCHAR(150),
    ram VARCHAR(50),
    almacenamiento VARCHAR(50),
    bateria VARCHAR(50),
    camara_principal VARCHAR(100),
    camara_frontal VARCHAR(100),
    pantalla VARCHAR(50),
    red VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Tabla: ventas
-- --------------------------------------------------------------------
CREATE TABLE ventas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendedor_id BIGINT NOT NULL,
    metodo_pago VARCHAR(20) NOT NULL, -- 'CONTADO', 'CUOTAS'
    subtotal DECIMAL(10, 2) NOT NULL,
    descuento_porcentaje DECIMAL(5, 2) DEFAULT 0.00,
    interes_porcentaje DECIMAL(5, 2) DEFAULT 0.00,
    numero_cuotas INT DEFAULT 0,
    monto_cuota DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    cliente_nombre VARCHAR(150),
    cliente_documento VARCHAR(20),
    cliente_telefono VARCHAR(20),
    CONSTRAINT fk_ventas_vendedor FOREIGN KEY (vendedor_id) REFERENCES usuarios (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Tabla: detalle_ventas
-- --------------------------------------------------------------------
CREATE TABLE detalle_ventas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_detalle_venta FOREIGN KEY (venta_id) REFERENCES ventas (id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. Tabla: ingresos_equipos
-- --------------------------------------------------------------------
CREATE TABLE ingresos_equipos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    cantidad INT NOT NULL,
    producto_id BIGINT NOT NULL,
    proveedor_id BIGINT NOT NULL,
    CONSTRAINT fk_ingreso_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
    CONSTRAINT fk_ingreso_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. Tabla: imeis
-- --------------------------------------------------------------------
CREATE TABLE imeis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    imei VARCHAR(15) NOT NULL UNIQUE,
    producto_id BIGINT NOT NULL,
    estado VARCHAR(20) DEFAULT 'DISPONIBLE', -- 'DISPONIBLE', 'VENDIDO'
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    venta_id BIGINT DEFAULT NULL,
    CONSTRAINT fk_imeis_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
    CONSTRAINT fk_imeis_venta FOREIGN KEY (venta_id) REFERENCES ventas (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- REGISTROS DE PRUEBA (DATOS INICIALES)
-- ====================================================================

-- Datos para usuarios (Contraseñas en texto plano según AuthService.java)
INSERT INTO usuarios (username, password, nombre_completo, rol, activo, created_at) VALUES
('admin', 'admin123', 'Administrador del Sistema', 'ADMINISTRADOR', TRUE, NOW()),
('vendedor', 'vendedor123', 'Vendedor Principal', 'VENDEDOR', TRUE, NOW());

-- Datos para proveedores
INSERT INTO proveedores (empresa, ruc, proveedor_contacto, telefono, correo, direccion) VALUES
('Movistar Mayorista', '20100034567', 'Carlos Gómez', '987654321', 'contacto@movistarmayorista.pe', 'Av. Javier Prado Este 456, San Isidro'),
('Claro Distribuidor', '20200054321', 'Ana Martínez', '912345678', 'ventas@clarodistribuidor.pe', 'Av. Aramburú 789, Surquillo'),
('Apple Importaciones Perú', '20555566677', 'Robert Jobs', '999888777', 'robert.jobs@appleimport.com.pe', 'Av. El Derby 123, Santiago de Surco');

-- Datos para productos (Con especificaciones técnicas completas para las fichas de consulta)
INSERT INTO productos (modelo, marca, precio, stock, foto_url, estado, procesador, ram, almacenamiento, bateria, camara_principal, camara_frontal, pantalla, red, created_at, updated_at) VALUES
('iPhone 15 Pro', 'Apple', 1200.00, 9, NULL, 'DISPONIBLE', 'Apple A17 Pro', '8 GB', '256 GB', '3274 mAh', '48 MP', '12 MP', '6.1 inches OLED', '5G', NOW(), NOW()),
('Galaxy S24 Ultra', 'Samsung', 1100.00, 7, NULL, 'DISPONIBLE', 'Snapdragon 8 Gen 3', '12 GB', '512 GB', '5000 mAh', '200 MP', '12 MP', '6.8 inches Dynamic AMOLED', '5G', NOW(), NOW()),
('Xiaomi 14 Pro', 'Xiaomi', 800.00, 15, NULL, 'DISPONIBLE', 'Snapdragon 8 Gen 3', '12 GB', '256 GB', '4880 mAh', '50 MP', '32 MP', '6.73 inches AMOLED', '5G', NOW(), NOW()),
('iPhone 14', 'Apple', 900.00, 5, NULL, 'DISPONIBLE', 'Apple A15 Bionic', '6 GB', '128 GB', '3279 mAh', '12 MP', '12 MP', '6.1 inches Super Retina', '5G', NOW(), NOW()),
('Galaxy A54', 'Samsung', 350.00, 20, NULL, 'DISPONIBLE', 'Exynos 1380', '8 GB', '128 GB', '5000 mAh', '50 MP', '32 MP', '6.4 inches Super AMOLED', '5G', NOW(), NOW()),
('Redmi Note 13', 'Xiaomi', 250.00, 25, NULL, 'DISPONIBLE', 'MediaTek Dimensity 6080', '6 GB', '128 GB', '5000 mAh', '108 MP', '16 MP', '6.67 inches AMOLED', '5G', NOW(), NOW());

-- Datos para ventas (Historial de transacciones de ejemplo)
INSERT INTO ventas (vendedor_id, metodo_pago, subtotal, descuento_porcentaje, interes_porcentaje, numero_cuotas, monto_cuota, total, fecha, cliente_nombre, cliente_documento, cliente_telefono, cliente_direccion) VALUES
(2, 'CONTADO', 1200.00, 0.00, 0.00, 0, 0.00, 1200.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Juan Pérez', '45678912', '987654321', 'Av. Larco 123, Miraflores'),
(2, 'CUOTAS', 1100.00, 5.00, 10.00, 3, 383.17, 1149.50, DATE_SUB(NOW(), INTERVAL 1 DAY), 'María Lopez', '76543210', '912345678', 'Calle Tulipanes 456, San Isidro');

-- Datos para detalle_ventas (Detalle de los equipos vendidos)
INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 1200.00, 1200.00),
(2, 2, 1, 1100.00, 1100.00);

-- Datos para ingresos_equipos (Historial de ingresos por stock)
INSERT INTO ingresos_equipos (fecha_ingreso, cantidad, producto_id, proveedor_id) VALUES
(DATE_SUB(NOW(), INTERVAL 10 DAY), 10, 1, 3),
(DATE_SUB(NOW(), INTERVAL 9 DAY), 8, 2, 2),
(DATE_SUB(NOW(), INTERVAL 8 DAY), 15, 3, 1),
(DATE_SUB(NOW(), INTERVAL 7 DAY), 5, 4, 3),
(DATE_SUB(NOW(), INTERVAL 6 DAY), 20, 5, 2),
(DATE_SUB(NOW(), INTERVAL 5 DAY), 25, 6, 1);

-- Datos para imeis (Números de IMEI de los equipos, asociando los ya vendidos y dejando libres el resto)
-- iPhone 15 Pro (ID: 1) - 10 iniciales, 1 vendido, 9 disponibles
INSERT INTO imeis (imei, producto_id, estado, fecha_registro, venta_id) VALUES
('860000000000011', 1, 'VENDIDO', DATE_SUB(NOW(), INTERVAL 10 DAY), 1),
('860000000000012', 1, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
('860000000000013', 1, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
('860000000000014', 1, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
('860000000000015', 1, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
('860000000000016', 1, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
('860000000000017', 1, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
('860000000000018', 1, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
('860000000000019', 1, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL),
('860000000000020', 1, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL);

-- Galaxy S24 Ultra (ID: 2) - 8 iniciales, 1 vendido, 7 disponibles
INSERT INTO imeis (imei, producto_id, estado, fecha_registro, venta_id) VALUES
('860000000000021', 2, 'VENDIDO', DATE_SUB(NOW(), INTERVAL 9 DAY), 2),
('860000000000022', 2, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 9 DAY), NULL),
('860000000000023', 2, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 9 DAY), NULL),
('860000000000024', 2, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 9 DAY), NULL),
('860000000000025', 2, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 9 DAY), NULL),
('860000000000026', 2, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 9 DAY), NULL),
('860000000000027', 2, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 9 DAY), NULL),
('860000000000028', 2, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 9 DAY), NULL);

-- Xiaomi 14 Pro (ID: 3) - 15 iniciales, todos disponibles
INSERT INTO imeis (imei, producto_id, estado, fecha_registro, venta_id) VALUES
('860000000000031', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000032', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000033', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000034', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000035', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000036', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000037', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000038', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000039', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000040', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000041', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000042', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000043', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000044', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL),
('860000000000045', 3, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 8 DAY), NULL);

-- iPhone 14 (ID: 4) - 5 iniciales, todos disponibles
INSERT INTO imeis (imei, producto_id, estado, fecha_registro, venta_id) VALUES
('860000000000046', 4, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 7 DAY), NULL),
('860000000000047', 4, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 7 DAY), NULL),
('860000000000048', 4, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 7 DAY), NULL),
('860000000000049', 4, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 7 DAY), NULL),
('860000000000050', 4, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 7 DAY), NULL);

-- Galaxy A54 (ID: 5) - 20 iniciales, todos disponibles
INSERT INTO imeis (imei, producto_id, estado, fecha_registro, venta_id) VALUES
('860000000000051', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000052', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000053', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000054', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000055', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000056', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000057', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000058', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000059', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000060', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000061', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000062', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000063', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000064', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000065', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000066', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000067', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000068', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000069', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('860000000000070', 5, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL);

-- Redmi Note 13 (ID: 6) - 25 iniciales, todos disponibles (se muestran los primeros 15 en inserción)
INSERT INTO imeis (imei, producto_id, estado, fecha_registro, venta_id) VALUES
('860000000000071', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000072', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000073', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000074', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000075', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000076', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000077', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000078', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000079', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000080', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000081', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000082', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000083', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000084', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000085', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000086', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000087', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000088', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000089', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000090', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000091', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000092', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000093', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000094', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL),
('860000000000095', 6, 'DISPONIBLE', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL);