import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './IngresoEquipos.css';

const IngresoEquipos = () => {
    const [ingresos, setIngresos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    
    const [formData, setFormData] = useState({
        proveedorId: '',
        productoId: '',
        cantidad: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchIngresos();
        fetchProveedores();
        fetchProductos();
    }, []);

    const fetchIngresos = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/ingresos-equipos');
            setIngresos(res.data);
        } catch (error) {
            toast.error('Error al cargar historial de ingresos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProveedores = async () => {
        try {
            const res = await api.get('/api/proveedores');
            setProveedores(res.data);
        } catch (error) {
            console.error('Error al cargar proveedores', error);
        }
    };

    const fetchProductos = async () => {
        try {
            const res = await api.get('/api/productos');
            setProductos(res.data);
        } catch (error) {
            console.error('Error al cargar productos', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.proveedorId) {
            toast.error('Debe seleccionar un proveedor');
            return;
        }

        if (!formData.productoId) {
            toast.error('Debe seleccionar un celular/producto');
            return;
        }

        const qty = parseInt(formData.cantidad);
        if (isNaN(qty) || qty <= 0) {
            toast.error('La cantidad debe ser un número entero mayor a cero');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                cantidad: qty,
                producto: { id: parseInt(formData.productoId) },
                proveedor: { id: parseInt(formData.proveedorId) }
            };

            await api.post('/api/ingresos-equipos', payload);
            toast.success('Ingreso de equipos registrado y stock incrementado');
            
            // Reset form
            setFormData({
                proveedorId: '',
                productoId: '',
                cantidad: ''
            });

            // Refresh data
            fetchIngresos();
            fetchProductos(); // Refresh stock in the selector
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al registrar el ingreso');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (ingreso) => {
        const confirmMsg = `¿Está seguro de anular este ingreso?\nSe restarán ${ingreso.cantidad} unidades del stock del producto "${ingreso.producto?.marca} ${ingreso.producto?.modelo}".`;
        
        if (!window.confirm(confirmMsg)) {
            return;
        }

        try {
            await api.delete(`/api/ingresos-equipos/${ingreso.id}`);
            toast.success('Ingreso anulado y stock revertido');
            fetchIngresos();
            fetchProductos(); // Refresh stock in selector
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al anular ingreso');
            console.error(error);
        }
    };

    const filteredIngresos = ingresos.filter(i => {
        const s = filter.toLowerCase();
        const provName = i.proveedor?.empresa?.toLowerCase() || '';
        const prodModel = `${i.producto?.marca} ${i.producto?.modelo}`.toLowerCase();
        return provName.includes(s) || prodModel.includes(s);
    });

    const formatFecha = (fechaStr) => {
        if (!fechaStr) return '-';
        try {
            const date = new Date(fechaStr);
            return date.toLocaleString('es-MX', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return fechaStr;
        }
    };

    return (
        <div className="page-container ingresos-page">
            <div className="ingresos-header">
                <div>
                    <h2>Ingreso de Equipos (Compras)</h2>
                    <p className="page-subtitle">Registra la entrada de nuevos celulares al inventario asociados a un proveedor</p>
                </div>
            </div>

            <div className="ingresos-grid">
                {/* Formulario */}
                <div className="ingresos-form-section card">
                    <h3>Registrar Entrada</h3>
                    <form onSubmit={handleSubmit} className="form-layout">
                        
                        <div className="form-group">
                            <label>Proveedor *</label>
                            <select
                                name="proveedorId"
                                value={formData.proveedorId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un proveedor...</option>
                                {proveedores.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.empresa} (RUC: {p.ruc})
                                    </option>
                                ))}
                            </select>
                            {proveedores.length === 0 && (
                                <small className="warning-text">
                                    ⚠️ No hay proveedores registrados. Regístralos en la pantalla de Proveedores.
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Celular / Producto *</label>
                            <select
                                name="productoId"
                                value={formData.productoId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un celular...</option>
                                {productos.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.marca} {p.modelo} (Stock actual: {p.stock})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Cantidad a Ingresar *</label>
                            <input
                                type="number"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleInputChange}
                                placeholder="Ej: 10"
                                min="1"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-100"
                            disabled={submitting || proveedores.length === 0}
                        >
                            {submitting ? 'Registrando...' : 'Registrar Ingreso'}
                        </button>
                    </form>
                </div>

                {/* Historial */}
                <div className="ingresos-list-section card">
                    <div className="list-header-row">
                        <h3>Historial de Ingresos</h3>
                        <div className="search-box-small">
                            <input
                                type="text"
                                placeholder="Buscar por proveedor o modelo..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="search-input-small"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="table-loading">
                            <div className="spinner-small"></div>
                            <p>Cargando historial...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Fecha / Hora</th>
                                        <th>Proveedor</th>
                                        <th>Producto/Celular</th>
                                        <th>Cantidad</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIngresos.map((ingreso) => (
                                        <tr key={ingreso.id}>
                                            <td className="date-cell">{formatFecha(ingreso.fechaIngreso)}</td>
                                            <td className="empresa-name">{ingreso.proveedor?.empresa || <span className="text-muted">Desconocido</span>}</td>
                                            <td>{ingreso.producto ? `${ingreso.producto.marca} ${ingreso.producto.modelo}` : <span className="text-muted">Desconocido</span>}</td>
                                            <td className="qty-cell">
                                                <span className="badge green">+{ingreso.cantidad}</span>
                                            </td>
                                            <td>
                                                <div className="action-buttons-cell">
                                                    <button
                                                        className="btn-icon btn-delete"
                                                        title="Anular ingreso (restar stock)"
                                                        onClick={() => handleDelete(ingreso)}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredIngresos.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center">No hay registros de ingresos</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IngresoEquipos;
