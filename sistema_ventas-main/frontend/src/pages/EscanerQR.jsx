import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';
import './EscanerQR.css';

const EscanerQR = () => {
    const [scannerActive, setScannerActive] = useState(true);
    
    // Flag to prevent duplicate/lag scanning
    const isProcessingRef = useRef(false);

    // QR scan result (Model Summary)
    const [qrResult, setQrResult] = useState(null);
    const [loadingQr, setLoadingQr] = useState(false);

    // Manual IMEI search result (Auditing & Warranty)
    const [manualImei, setManualImei] = useState('');
    const [imeiResult, setImeiResult] = useState(null);
    const [loadingImei, setLoadingImei] = useState(false);


    const extractProductId = (text) => {
        if (!text) return null;
        const trimmed = text.trim();
        if (trimmed.startsWith("MODELO_ID:")) {
            return trimmed.replace("MODELO_ID:", "").trim();
        }
        if (trimmed.includes("qr=")) {
            const parts = trimmed.split("qr=");
            const val = parts[1] ? parts[1].split("&")[0] : "";
            if (val.startsWith("MODELO_ID:")) {
                return val.replace("MODELO_ID:", "").trim();
            }
            return val;
        }
        return trimmed;
    };

    const handleResetScanner = () => {
        isProcessingRef.current = false;
        setQrResult(null);
        setScannerActive(true);
    };

    useEffect(() => {
        if (!scannerActive) return;

        let scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(
            (decodedText) => {
                if (isProcessingRef.current) return;
                isProcessingRef.current = true;
                buscarProductoPorQR(decodedText);
                setScannerActive(false);
            },
            (error) => {
                // Quietly ignore scan failures
            }
        );

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, [scannerActive]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const qrId = params.get('qr');
        if (qrId) {
            isProcessingRef.current = true;
            buscarProductoPorQR(qrId);
            setScannerActive(false);
        }
    }, []);


    const buscarProductoPorQR = async (rawCode) => {
        if (!rawCode) return;
        const cleanId = extractProductId(rawCode);
        if (!cleanId || isNaN(cleanId)) {
            toast.error('Código QR con formato no válido');
            isProcessingRef.current = false;
            setScannerActive(true);
            return;
        }
        setLoadingQr(true);
        setQrResult(null);
        try {
            const res = await axiosInstance.get(`/api/imeis/producto/${cleanId}/resumen-qr`);
            if (res.data) {
                setQrResult(res.data);
                toast.success('Información del modelo cargada');
            }
        } catch (error) {
            toast.error('Código QR no válido o modelo no encontrado');
            setQrResult(null);
            isProcessingRef.current = false;
            setScannerActive(true);
        } finally {
            setLoadingQr(false);
        }
    };


    const handleManualImeiSearch = async (e) => {
        e.preventDefault();
        const trimmed = manualImei.trim();
        if (!trimmed) {
            toast.error('Por favor, ingrese un número de IMEI');
            return;
        }
        if (trimmed.length !== 15 || isNaN(trimmed)) {
            toast.error('El IMEI debe tener exactamente 15 dígitos numéricos');
            return;
        }

        setLoadingImei(true);
        setImeiResult(null);
        try {
            const res = await axiosInstance.get(`/api/imeis/trazabilidad/${trimmed}`);
            if (res.data) {
                setImeiResult(res.data);
                toast.success('Trazabilidad de IMEI encontrada');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'El IMEI ingresado no se encuentra registrado');
            setImeiResult(null);
        } finally {
            setLoadingImei(false);
        }
    };

    const getProductImage = (productId) => {
        return `http://localhost:8080/api/productos/${productId}/foto`;
    };

    const handleImageError = (e) => {
        e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect fill="#f1f5f9" width="60" height="60" rx="8"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="24" fill="#cbd5e1">📱</text></svg>`);
    };

    return (
        <div className="page-container qr-page">
            <div className="qr-title-header">
                <h1 className="qr-title">Consulta y Auditoría de Equipos</h1>
                <p className="qr-subtitle">Escanee códigos QR de modelos o realice auditorías completas por IMEI</p>
            </div>

            <div className="qr-grid">
                {/* FUNCIÓN 1: ESCÁNER DE QR (BÚSQUEDA POR MODELO) */}
                <div className="scanner-section card">
                    <div className="card-header-icon">
                        <span className="card-icon">📷</span>
                        <h3>Escáner de Código QR</h3>
                    </div>
                    
                    {scannerActive ? (
                        <div id="reader" className="qr-reader"></div>
                    ) : (
                        <div className="scanner-placeholder">
                            <span className="placeholder-icon-check">✅</span>
                            <p>Lectura completada exitosamente.</p>
                            <button className="btn-reset-scanner" onClick={handleResetScanner}>
                                Escanear nuevo equipo
                            </button>
                        </div>
                    )}
                </div>

    
                    {/* RESULTADO FUNCIÓN 1 */}
                    <div className="result-section card">
                        <div className="card-header-icon">
                            <span className="card-icon">📋</span>
                            <h3>Ficha del Modelo Base</h3>
                        </div>
    
                        {loadingQr ? (
                            <div className="qr-loading-container">
                                <div className="spinner"></div>
                                <p>Cargando información del modelo...</p>
                            </div>
                        ) : !qrResult ? (
                            <div className="empty-result">
                                <span className="qr-icon">📱</span>
                                <p>Escanee el código QR de un modelo para visualizar sus características y la disponibilidad de stock por IMEI.</p>
                            </div>
                        ) : (
                            <div className="qr-detalle-container">
                                <div className="qr-model-image-hero">
                                    <img 
                                        src={getProductImage(qrResult.producto.id)} 
                                        alt={qrResult.producto.modelo}
                                        onError={handleImageError}
                                        className="qr-hero-img"
                                    />
                                </div>
                                <div className="qr-model-meta-new">
                                    <h4>{qrResult.producto.modelo}</h4>
                                    <div className="qr-badges-row">
                                        <span className="qr-brand-badge">{qrResult.producto.marca}</span>
                                        <span className="qr-red-badge">Red: {qrResult.producto.red || 'N/A'}</span>
                                    </div>
                                    <div className="qr-stock-status">
                                        <span className="qr-stock-label">Stock en Inventario:</span>
                                        <span className={`stock-badge ${qrResult.producto.stock > 0 ? 'stock-green' : 'stock-red'}`}>
                                            {qrResult.producto.stock} unidades
                                        </span>
                                    </div>
                                </div>
    
                                <div className="specs-accordion">
                                    <h5>Ficha de Especificaciones Técnicas</h5>
                                    <div className="qr-specs-grid">
                                        <div className="qr-spec-item">
                                            <span>Procesador</span>
                                            <strong>{qrResult.producto.procesador || 'N/A'}</strong>
                                        </div>
                                        <div className="qr-spec-item">
                                            <span>RAM / Alm.</span>
                                            <strong>{qrResult.producto.ram || 'N/A'} / {qrResult.producto.almacenamiento || 'N/A'}</strong>
                                        </div>
                                        <div className="qr-spec-item">
                                            <span>Batería</span>
                                            <strong>{qrResult.producto.bateria || 'N/A'}</strong>
                                        </div>
                                        <div className="qr-spec-item">
                                            <span>Pantalla</span>
                                            <strong>{qrResult.producto.pantalla || 'N/A'}</strong>
                                        </div>
                                        <div className="qr-spec-item">
                                            <span>Cám. Principal</span>
                                            <strong>{qrResult.producto.camaraPrincipal || 'N/A'}</strong>
                                        </div>
                                        <div className="qr-spec-item">
                                            <span>Cám. Frontal</span>
                                            <strong>{qrResult.producto.camaraFrontal || 'N/A'}</strong>
                                        </div>
                                        <div className="qr-spec-item">
                                            <span>Precio de Venta</span>
                                            <strong>${Number(qrResult.producto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="reset-scanner-btn-wrapper" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                                    <button className="btn-reset-scanner" onClick={handleResetScanner}>
                                        Escanear nuevo equipo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
            </div>

            {/* FUNCIÓN 2: BUSCADOR MANUAL DE IMEIs (AUDITORÍA Y GARANTÍA) */}
            <div className="imei-auditor-section card" style={{ marginTop: '30px' }}>
                <div className="card-header-icon">
                    <span className="card-icon">🔍</span>
                    <h3>Auditoría y Trazabilidad por IMEI (Garantía)</h3>
                </div>
                <p className="section-desc">Consulte los datos de fabricación, el estado comercial del equipo y la ficha del comprador si ha sido vendido.</p>
                
                <form onSubmit={handleManualImeiSearch} className="imei-search-form">
                    <input 
                        type="text" 
                        maxLength={15}
                        placeholder="Ingrese IMEI del equipo (15 dígitos)..." 
                        value={manualImei}
                        onChange={(e) => setManualImei(e.target.value.replace(/\D/g, ''))}
                        className="imei-search-input"
                    />
                    <button type="submit" className="btn-new-model" disabled={loadingImei}>
                        {loadingImei ? 'Buscando...' : 'Buscar IMEI'}
                    </button>
                </form>

                {loadingImei ? (
                    <div className="qr-loading-container" style={{ margin: '30px 0' }}>
                        <div className="spinner"></div>
                        <p>Auditando trazabilidad de IMEI...</p>
                    </div>
                ) : imeiResult ? (
                    <div className="imei-audit-results">
                        <div className="audit-split-grid">
                            
                            {/* Model Info */}
                            <div className="audit-specs-card">
                                <h4>Especificaciones del Dispositivo</h4>
                                <div className="qr-model-image-hero">
                                    <img 
                                        src={getProductImage(imeiResult.producto.id)} 
                                        alt={imeiResult.producto.modelo}
                                        onError={handleImageError}
                                        className="qr-hero-img"
                                    />
                                </div>
                                <div className="audit-device-meta-new">
                                    <h5>{imeiResult.producto.modelo}</h5>
                                    <div style={{ marginTop: '6px', marginBottom: '8px' }}>
                                        <span className="qr-brand-badge">{imeiResult.producto.marca}</span>
                                    </div>
                                    <span className="font-mono text-sm block" style={{ color: '#64748b', fontSize: '13px' }}>IMEI: {imeiResult.imei}</span>
                                </div>

                                <div className="specs-list-audit">
                                    <div className="spec-audit-row">
                                        <span>Procesador:</span>
                                        <strong>{imeiResult.producto.procesador || 'N/A'}</strong>
                                    </div>
                                    <div className="spec-audit-row">
                                        <span>RAM / Almacenamiento:</span>
                                        <strong>{imeiResult.producto.ram || 'N/A'} / {imeiResult.producto.almacenamiento || 'N/A'}</strong>
                                    </div>
                                    <div className="spec-audit-row">
                                        <span>Batería:</span>
                                        <strong>{imeiResult.producto.bateria || 'N/A'}</strong>
                                    </div>
                                    <div className="spec-audit-row">
                                        <span>Tamaño de Pantalla:</span>
                                        <strong>{imeiResult.producto.pantalla || 'N/A'}</strong>
                                    </div>
                                    <div className="spec-audit-row">
                                        <span>Cámara Principal:</span>
                                        <strong>{imeiResult.producto.camaraPrincipal || 'N/A'}</strong>
                                    </div>
                                    <div className="spec-audit-row">
                                        <span>Cámara Frontal:</span>
                                        <strong>{imeiResult.producto.camaraFrontal || 'N/A'}</strong>
                                    </div>
                                    <div className="spec-audit-row">
                                        <span>Red:</span>
                                        <strong>{imeiResult.producto.red || 'N/A'}</strong>
                                    </div>
                                    <div className="spec-audit-row">
                                        <span>Precio Sugerido:</span>
                                        <strong>${Number(imeiResult.producto.precio).toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Commercial Status and Buyer */}
                            <div className="audit-status-card">
                                <h4>Estado Comercial y Trazabilidad</h4>
                                <div className="audit-status-header">
                                    <span>Estado del IMEI:</span>
                                    <span className={`estado-badge ${imeiResult.estado.toLowerCase()}`} style={{ fontSize: '15px', padding: '6px 16px' }}>
                                        {imeiResult.estado}
                                    </span>
                                </div>

                                {imeiResult.estado === 'VENDIDO' && imeiResult.cliente ? (
                                    <div className="buyer-info-card">
                                        <h5>Ficha del Comprador Registrado</h5>
                                        <div className="buyer-details-list">
                                            <div className="buyer-detail-item">
                                                <span>Nombre del Cliente</span>
                                                <strong>{imeiResult.cliente.nombre || 'N/A'}</strong>
                                            </div>
                                            <div className="buyer-detail-item">
                                                <span>DNI / RUC</span>
                                                <strong>{imeiResult.cliente.documento || 'N/A'}</strong>
                                            </div>
                                            <div className="buyer-detail-item">
                                                <span>Teléfono de Contacto</span>
                                                <strong>{imeiResult.cliente.telefono || 'N/A'}</strong>
                                            </div>
                                            <div className="buyer-detail-item">
                                                <span>Fecha y Hora de la Operación</span>
                                                <strong>{new Date(imeiResult.cliente.fechaVenta).toLocaleString('es-MX')}</strong>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="imei-available-banner">
                                        <div className="banner-icon">✔</div>
                                        <div className="banner-text">
                                            <h5>EQUIPO DISPONIBLE EN INVENTARIO</h5>
                                            <p>Este dispositivo cuenta con stock libre. Aún no ha sido asignado a ningún cliente ni se han registrado transacciones de salida para este número de IMEI.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="audit-empty-state">
                        <p>Ingrese un IMEI en la casilla superior para realizar la trazabilidad y auditoría de garantía.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default EscanerQR;
