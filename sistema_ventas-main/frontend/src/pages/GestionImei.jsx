import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';
import './GestionImei.css';

const GestionImei = () => {
    const [imeis, setImeis] = useState([]);
    const [productos, setProductos] = useState([]);
    const [productoId, setProductoId] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [imeisInputs, setImeisInputs] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('TODOS');
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        fetchImeis();
        fetchProductos();
        fetchAlertas();
    }, []);

    const fetchImeis = async () => {
        try {
            const res = await axiosInstance.get('/api/imeis');
            setImeis(res.data);
        } catch (error) {
            toast.error('Error al cargar IMEIs');
        }
    };

    const fetchProductos = async () => {
        try {
            const res = await axiosInstance.get('/api/productos');
            setProductos(res.data);
        } catch (error) {
            toast.error('Error al cargar productos');
        }
    };

    const fetchAlertas = async () => {
        try {
            const res = await axiosInstance.get('/api/imeis/alertas');
            setAlertas(res.data);
        } catch (error) {
            console.error('Error al cargar alertas', error);
        }
    };

    const handleCantidadChange = (e) => {
        const val = parseInt(e.target.value) || 1;
        const limitVal = Math.max(1, Math.min(100, val));
        setCantidad(limitVal);

        setImeisInputs(prev => {
            const next = [...prev];
            if (limitVal > prev.length) {
                while (next.length < limitVal) {
                    next.push('');
                }
            } else if (limitVal < prev.length) {
                next.splice(limitVal);
            }
            return next;
        });
    };

    const handleImeiInputChange = (index, value) => {
        const cleanVal = value.replace(/\D/g, '').slice(0, 15);
        setImeisInputs(prev => {
            const next = [...prev];
            next[index] = cleanVal;
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productoId) {
            toast.error('Debe seleccionar un producto');
            return;
        }

        // Validate each IMEI is exactly 15 digits
        const invalidIndex = imeisInputs.findIndex(imei => imei.length !== 15);
        if (invalidIndex !== -1) {
            toast.error(`El IMEI #${invalidIndex + 1} debe tener exactamente 15 dígitos numéricos`);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                productoId: parseInt(productoId),
                imeis: imeisInputs
            };

            await axiosInstance.post('/api/imeis/multiple', payload);
            toast.success('IMEIs registrados correctamente');

            // Reset form
            setCantidad(1);
            setImeisInputs(['']);
            setProductoId('');

            fetchImeis();
            fetchAlertas();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al registrar IMEIs');
        } finally {
            setLoading(false);
        }
    };

    const filteredImeis = imeis.filter(i => filter === 'TODOS' ? true : i.estado === filter);

    return (
        <div className="page-container imei-page">
            <h2>Gestión de IMEI</h2>

            <div className="imei-grid">
                <div className="imei-left-column">
                    <div className="imei-form-section card">
                        <h3>Registrar Nuevos IMEIs</h3>
                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label>Producto Asociado *</label>
                                <select
                                    value={productoId}
                                    onChange={(e) => setProductoId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un producto...</option>
                                    {productos.map(p => (
                                        <option key={p.id} value={p.id}>{p.marca} {p.modelo}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Cantidad de IMEIs a registrar *</label>
                                <input
                                    type="number"
                                    value={cantidad}
                                    onChange={handleCantidadChange}
                                    min="1"
                                    max="100"
                                    required
                                />
                            </div>

                            <div className="imeis-inputs-scroll-container">
                                {imeisInputs.map((imeiVal, idx) => (
                                    <div className="form-group dynamic-imei-group" key={idx}>
                                        <label>Código IMEI #{idx + 1} *</label>
                                        <input
                                            type="text"
                                            value={imeiVal}
                                            onChange={(e) => handleImeiInputChange(idx, e.target.value)}
                                            placeholder={`Ej: 35123456789012${idx}`}
                                            required
                                        />
                                        <small className={imeiVal.length === 15 ? 'valid' : ''}>
                                            {imeiVal.length}/15 caracteres
                                        </small>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="btn-primary w-100 btn-submit-imeis" disabled={loading}>
                                {loading ? 'Registrando...' : 'Registrar IMEIs'}
                            </button>
                        </form>
                    </div>

                    <div className="imei-alerts-section card">
                        <h3>Alertas de IMEIs Pendientes</h3>
                        {alertas.length === 0 ? (
                            <p className="no-alerts-text">✅ No hay unidades pendientes de registrar IMEI</p>
                        ) : (
                            <div className="alerts-list">
                                {alertas.map(al => (
                                    <div key={al.productoId} className="alert-item animate-alert">
                                        <div className="alert-icon">⚠️</div>
                                        <div className="alert-content">
                                            <p className="alert-title">Pendiente: <strong>{al.pendientes}</strong> IMEIs</p>
                                            <p className="alert-desc">{al.marca} {al.modelo}</p>
                                            <small className="alert-details">Comprado: {al.comprado} | Registrado: {al.registrado}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="imei-list-section card">
                    <div className="list-header">
                        <h3>IMEIs Registrados</h3>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="TODOS">Todos</option>
                            <option value="DISPONIBLE">Disponibles</option>
                            <option value="VENDIDO">Vendidos</option>
                        </select>
                    </div>

                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>IMEI</th>
                                    <th>Producto</th>
                                    <th>Fecha Registro</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredImeis.map(imei => (
                                    <tr key={imei.id}>
                                        <td className="imei-code">{imei.imei}</td>
                                        <td>{imei.producto?.marca} {imei.producto?.modelo}</td>
                                        <td>{new Date(imei.fechaRegistro).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${imei.estado === 'DISPONIBLE' ? 'green' : 'red'}`}>
                                                {imei.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredImeis.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center">No hay IMEIs registrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionImei;
