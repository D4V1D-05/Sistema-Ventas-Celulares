import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Historial.css';

const Historial = () => {
    const [ventas, setVentas] = useState([]);
    const [filteredVentas, setFilteredVentas] = useState([]);
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVentas();
    }, []);

    const fetchVentas = async () => {
        try {
            const res = await axiosInstance.get('/api/ventas');
            const data = res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            setVentas(data);
            setFilteredVentas(data);
        } catch (error) {
            toast.error('Error al cargar el historial de ventas');
        }
    };

    useEffect(() => {
        if (!searchTerm) {
            setFilteredVentas(ventas);
            return;
        }
        const lower = searchTerm.toLowerCase();
        setFilteredVentas(
            ventas.filter(v => 
                v.id.toString().includes(lower) || 
                (v.vendedor && v.vendedor.nombreCompleto.toLowerCase().includes(lower)) ||
                (v.vendedor && v.vendedor.username.toLowerCase().includes(lower)) ||
                (v.clienteNombre && v.clienteNombre.toLowerCase().includes(lower)) ||
                (v.clienteDocumento && v.clienteDocumento.toLowerCase().includes(lower))
            )
        );
    }, [searchTerm, ventas]);

    const handleSelectVenta = async (id) => {
        try {
            const res = await axiosInstance.get(`/api/ventas/${id}`);
            setSelectedVenta(res.data);
        } catch (error) {
            toast.error('Error al cargar los detalles de la venta');
        }
    };

    return (
        <div className="page-container historial-page">
            <h2>Historial de Ventas</h2>
            
            <div className="historial-grid">
                <div className="historial-list-section card">
                    <div className="search-bar">
                        <span role="img" aria-label="search">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Buscar por vendedor o ID de venta..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="ventas-list">
                        {filteredVentas.map(venta => (
                            <div 
                                key={venta.id} 
                                className={`venta-card ${selectedVenta?.id === venta.id ? 'selected' : ''}`}
                                onClick={() => handleSelectVenta(venta.id)}
                            >
                                <div className="venta-header">
                                    <span className="venta-id">Venta #{venta.id}</span>
                                    <span className="venta-total">${venta.total.toFixed(2)}</span>
                                </div>
                                <div className="venta-date">
                                    {new Date(venta.fecha).toLocaleString()}
                                </div>
                                <div className="venta-footer">
                                    <span className="vendedor">Vendedor: {venta.vendedor?.nombreCompleto || venta.vendedor?.username || 'N/A'}</span>
                                    <span className={`badge ${venta.metodoPago === 'CONTADO' ? 'green' : 'yellow'}`}>
                                        {venta.metodoPago}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {filteredVentas.length === 0 && (
                            <div className="no-results">No se encontraron ventas</div>
                        )}
                    </div>
                </div>

                <div className="historial-detail-section card">
                    {!selectedVenta ? (
                        <div className="empty-selection">
                            <span className="eye-icon">👁️</span>
                            <p>Seleccione una venta para ver los detalles</p>
                        </div>
                    ) : (
                        <div className="venta-detail">
                            <h3>Detalle de Venta #{selectedVenta.id}</h3>
                            <div className="detail-header">
                                <div className="detail-info">
                                    <p><strong>Fecha:</strong> {new Date(selectedVenta.fecha).toLocaleString()}</p>
                                    <p><strong>Vendedor:</strong> {selectedVenta.vendedor?.nombreCompleto || selectedVenta.vendedor?.username}</p>
                                    <p><strong>Método:</strong> {selectedVenta.metodoPago}</p>
                                    {selectedVenta.clienteNombre && (
                                        <>
                                            <p><strong>Cliente:</strong> {selectedVenta.clienteNombre}</p>
                                            <p><strong>Doc / DNI:</strong> {selectedVenta.clienteDocumento}</p>
                                            <p><strong>Teléfono:</strong> {selectedVenta.clienteTelefono}</p>
                                        </>
                                    )}
                                </div>
                                <div className="detail-amounts">
                                    <p><strong>Subtotal:</strong> ${selectedVenta.subtotal.toFixed(2)}</p>
                                    {selectedVenta.metodoPago === 'CONTADO' && selectedVenta.descuentoPorcentaje > 0 && (
                                        <p className="discount"><strong>Descuento ({selectedVenta.descuentoPorcentaje}%):</strong> -${(selectedVenta.subtotal * selectedVenta.descuentoPorcentaje / 100).toFixed(2)}</p>
                                    )}
                                    {selectedVenta.metodoPago === 'CUOTAS' && selectedVenta.interesPorcentaje > 0 && (
                                        <p className="interest"><strong>Interés ({selectedVenta.interesPorcentaje}%):</strong> +${(selectedVenta.subtotal * selectedVenta.interesPorcentaje / 100).toFixed(2)}</p>
                                    )}
                                    <h4 className="total">Total: ${selectedVenta.total.toFixed(2)}</h4>
                                    {selectedVenta.metodoPago === 'CUOTAS' && (
                                        <p className="cuotas"><strong>{selectedVenta.numeroCuotas} cuotas de:</strong> ${selectedVenta.montoCuota.toFixed(2)}</p>
                                    )}
                                </div>
                            </div>

                            <div className="detail-items">
                                <h4>Productos</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Modelo</th>
                                            <th>Marca</th>
                                            <th>Cant.</th>
                                            <th>P. Unit.</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedVenta.detalles && selectedVenta.detalles.map(detalle => {
                                            const productImeis = selectedVenta.imeis 
                                                ? selectedVenta.imeis.filter(i => i.producto?.id === detalle.producto?.id)
                                                : [];
                                            return (
                                                <tr key={detalle.id}>
                                                    <td>
                                                        <div style={{ fontWeight: '600' }}>{detalle.producto?.modelo}</div>
                                                        {productImeis.length > 0 && (
                                                            <div className="detalle-imeis-list" style={{ marginTop: '5px' }}>
                                                                <small style={{ color: '#666', display: 'block', marginBottom: '2px' }}>IMEIs:</small>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                                    {productImeis.map(i => (
                                                                        <span key={i.id} style={{ 
                                                                            fontSize: '11px', 
                                                                            fontFamily: 'monospace', 
                                                                            background: '#e3f2fd', 
                                                                            color: '#1976D2', 
                                                                            padding: '1px 5px', 
                                                                            borderRadius: '3px',
                                                                            border: '1px solid #bbdefb'
                                                                        }}>
                                                                            {i.imei}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{detalle.producto?.marca}</td>
                                                    <td>{detalle.cantidad}</td>
                                                    <td>${detalle.precioUnitario.toFixed(2)}</td>
                                                    <td>${detalle.subtotal.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Historial;
