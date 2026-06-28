import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './GestionProveedores.css';

const GestionProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [formData, setFormData] = useState({
        empresa: '',
        ruc: '',
        proveedorContacto: '',
        telefono: '',
        correo: '',
        direccion: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProveedores();
    }, []);

    const fetchProveedores = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/proveedores');
            setProveedores(res.data);
        } catch (error) {
            toast.error('Error al cargar proveedores');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'ruc') {
            // Solo dígitos, máximo 11 caracteres
            const val = value.replace(/\D/g, '').slice(0, 11);
            setFormData({ ...formData, [name]: val });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEdit = (proveedor) => {
        setEditingId(proveedor.id);
        setFormData({
            empresa: proveedor.empresa || '',
            ruc: proveedor.ruc || '',
            proveedorContacto: proveedor.proveedorContacto || '',
            telefono: proveedor.telefono || '',
            correo: proveedor.correo || '',
            direccion: proveedor.direccion || ''
        });
        toast.info(`Editando proveedor: ${proveedor.empresa}`);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            empresa: '',
            ruc: '',
            proveedorContacto: '',
            telefono: '',
            correo: '',
            direccion: ''
        });
    };

    const handleDelete = async (proveedor) => {
        if (!window.confirm(`¿Está seguro de eliminar al proveedor "${proveedor.empresa}"?`)) {
            return;
        }

        try {
            await api.delete(`/api/proveedores/${proveedor.id}`);
            toast.success('Proveedor eliminado correctamente');
            if (editingId === proveedor.id) {
                handleCancelEdit();
            }
            fetchProveedores();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al eliminar proveedor. Verifique que no tenga ingresos asociados.');
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.empresa.trim()) {
            toast.error('El nombre de la empresa es obligatorio');
            return;
        }

        if (formData.ruc.length !== 11) {
            toast.error('El RUC debe tener exactamente 11 dígitos numéricos');
            return;
        }

        setSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/api/proveedores/${editingId}`, formData);
                toast.success('Proveedor actualizado correctamente');
                handleCancelEdit();
            } else {
                await api.post('/api/proveedores', formData);
                toast.success('Proveedor registrado correctamente');
                setFormData({
                    empresa: '',
                    ruc: '',
                    proveedorContacto: '',
                    telefono: '',
                    correo: '',
                    direccion: ''
                });
            }
            fetchProveedores();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar proveedor');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredProveedores = proveedores.filter(p => {
        const s = search.toLowerCase();
        return (
            p.empresa.toLowerCase().includes(s) ||
            p.ruc.includes(s) ||
            (p.proveedorContacto && p.proveedorContacto.toLowerCase().includes(s))
        );
    });

    return (
        <div className="page-container proveedores-page">
            <div className="proveedores-header">
                <div>
                    <h2>Gestión de Proveedores</h2>
                    <p className="page-subtitle">Administra los proveedores registrados para las compras e ingresos de stock</p>
                </div>
            </div>

            <div className="proveedores-grid">
                {/* Formulario */}
                <div className="proveedores-form-section card">
                    <h3>{editingId ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}</h3>
                    <form onSubmit={handleSubmit} className="form-layout">
                        <div className="form-group">
                            <label>RUC (11 dígitos) *</label>
                            <input
                                type="text"
                                name="ruc"
                                value={formData.ruc}
                                onChange={handleInputChange}
                                placeholder="Ej: 20123456789"
                                required
                            />
                            <small className={formData.ruc.length === 11 ? 'valid' : ''}>
                                {formData.ruc.length}/11 dígitos
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Nombre de la Empresa *</label>
                            <input
                                type="text"
                                name="empresa"
                                value={formData.empresa}
                                onChange={handleInputChange}
                                placeholder="Ej: Distribuidora Móvil S.A."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Nombre de Contacto</label>
                            <input
                                type="text"
                                name="proveedorContacto"
                                value={formData.proveedorContacto}
                                onChange={handleInputChange}
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>

                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                placeholder="Ej: +51 987654321"
                            />
                        </div>

                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleInputChange}
                                placeholder="Ej: contacto@empresa.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Dirección</label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                placeholder="Ej: Av. Las Flores 123, Lima"
                            />
                        </div>

                        <div className="form-actions-row">
                            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                                {submitting ? 'Guardando...' : (editingId ? 'Actualizar' : 'Registrar')}
                            </button>
                            {editingId && (
                                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Tabla de Listado */}
                <div className="proveedores-list-section card">
                    <div className="list-header-row">
                        <h3>Proveedores Registrados</h3>
                        <div className="search-box-small">
                            <input
                                type="text"
                                placeholder="Buscar por empresa, RUC..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="search-input-small"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="table-loading">
                            <div className="spinner-small"></div>
                            <p>Cargando proveedores...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>RUC</th>
                                        <th>Empresa</th>
                                        <th>Contacto</th>
                                        <th>Teléfono</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProveedores.map((p) => (
                                        <tr key={p.id}>
                                            <td className="ruc-code">{p.ruc}</td>
                                            <td className="empresa-name">{p.empresa}</td>
                                            <td>{p.proveedorContacto || <span className="text-muted">-</span>}</td>
                                            <td>{p.telefono || <span className="text-muted">-</span>}</td>
                                            <td>
                                                <div className="action-buttons-cell">
                                                    <button
                                                        className="btn-icon btn-edit"
                                                        title="Editar"
                                                        onClick={() => handleEdit(p)}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="btn-icon btn-delete"
                                                        title="Eliminar"
                                                        onClick={() => handleDelete(p)}
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
                                    {filteredProveedores.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center">No hay proveedores registrados</td>
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

export default GestionProveedores;
