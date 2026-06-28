import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import './Inventario.css';


const defaultBrands = ['Samsung', 'Apple', 'Xiaomi', 'Huawei', 'Motorola', 'OPPO', 'Realme'];

function Inventario() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [filterMarca, setFilterMarca] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    modelo: '',
    marca: 'Samsung',
    precio: '',
    procesador: '',
    ram: '',
    almacenamiento: '',
    bateria: '',
    camaraPrincipal: '',
    camaraFrontal: '',
    pantalla: '',
    red: '5G'
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrProduct, setQrProduct] = useState(null);

  const openQrModal = (product) => {
    setQrProduct(product);
    setShowQrModal(true);
  };

  const closeQrModal = () => {
    setShowQrModal(false);
    setQrProduct(null);
  };

  const downloadQrCode = () => {
    if (!qrProduct) return;
    const canvas = document.getElementById("qr-canvas-download");
    if (!canvas) {
      toast.error("No se pudo generar el archivo del código QR");
      return;
    }
    try {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      const modelName = qrProduct.modelo.replace(/[^a-zA-Z0-9]/g, "_");
      downloadLink.download = `QR_${modelName}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("Código QR descargado exitosamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al descargar el código QR");
    }
  };



  const uniqueBrands = Array.from(new Set(productos.map((p) => p.marca).filter(Boolean)));
  const selectBrandsOptions = Array.from(new Set([...defaultBrands, ...uniqueBrands])).sort();
  const filterBrands = Array.from(new Set(productos.map((p) => p.marca).filter(Boolean))).sort();

  const userRol = user?.rol || (user?.usuario && user?.usuario.rol);
  const isAdmin = userRol === 'ADMIN' || userRol === 'ADMINISTRADOR' || userRol === 'Administrador';

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    let filtered = productos;
    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.modelo && p.modelo.toLowerCase().includes(s)) ||
          (p.marca && p.marca.toLowerCase().includes(s)) ||
          (p.procesador && p.procesador.toLowerCase().includes(s))
      );
    }
    if (filterMarca !== 'Todas') {
      filtered = filtered.filter((p) => p.marca === filterMarca);
    }
    setFilteredProductos(filtered);
  }, [search, filterMarca, productos]);

  useEffect(() => {
    const unique = Array.from(new Set(productos.map((p) => p.marca).filter(Boolean)));
    if (filterMarca !== 'Todas' && !unique.includes(filterMarca)) {
      setFilterMarca('Todas');
    }
  }, [productos, filterMarca]);

  useEffect(() => {
    if (filteredProductos.length > 0) {
      if (!selectedProducto || !filteredProductos.some((p) => p.id === selectedProducto.id)) {
        setSelectedProducto(filteredProductos[0]);
      }
    } else {
      setSelectedProducto(null);
    }
  }, [filteredProductos, selectedProducto]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/productos');
      setProductos(res.data);
    } catch (err) {
      toast.error('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    if (!isAdmin) return;
    setEditingProduct(null);
    setFormData({
      modelo: '',
      marca: 'Samsung',
      precio: '',
      procesador: '',
      ram: '',
      almacenamiento: '',
      bateria: '',
      camaraPrincipal: '',
      camaraFrontal: '',
      pantalla: '',
      red: '5G'
    });
    setNuevaMarca('');
    setFotoFile(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    if (!isAdmin) return;
    setEditingProduct(product);
    setFormData({
      modelo: product.modelo || '',
      marca: product.marca || 'Samsung',
      precio: product.precio || '',
      procesador: product.procesador || '',
      ram: product.ram || '',
      almacenamiento: product.almacenamiento || '',
      bateria: product.bateria || '',
      camaraPrincipal: product.camaraPrincipal || '',
      camaraFrontal: product.camaraFrontal || '',
      pantalla: product.pantalla || '',
      red: product.red || '5G'
    });
    setNuevaMarca('');
    setFotoFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.modelo.trim() || !formData.precio) {
      toast.error('Modelo y precio son requeridos');
      return;
    }

    const brandToSave = formData.marca === 'Otro' ? nuevaMarca.trim() : formData.marca;
    if (!brandToSave) {
      toast.error('Debe seleccionar o escribir una marca');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        modelo: formData.modelo.trim(),
        marca: brandToSave,
        precio: parseFloat(formData.precio),
        procesador: formData.procesador.trim() || null,
        ram: formData.ram.trim() || null,
        almacenamiento: formData.almacenamiento.trim() || null,
        bateria: formData.bateria.trim() || null,
        camaraPrincipal: formData.camaraPrincipal.trim() || null,
        camaraFrontal: formData.camaraFrontal.trim() || null,
        pantalla: formData.pantalla.trim() || null,
        red: formData.red
      };

      let productId;
      if (editingProduct) {
        await api.put(`/api/productos/${editingProduct.id}`, payload);
        productId = editingProduct.id;
        toast.success('Modelo de celular actualizado');
      } else {
        const res = await api.post('/api/productos', payload);
        productId = res.data.id || res.data;
        toast.success('Modelo base registrado');
      }

      if (fotoFile && productId) {
        const fd = new FormData();
        fd.append('file', fotoFile);
        try {
          await api.post(`/api/productos/${productId}/foto`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (err) {
          console.error(err);
          toast.error('Modelo guardado, pero error al subir foto');
        }
      }

      closeModal();
      fetchProductos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar modelo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!isAdmin) return;
    if (!window.confirm(`¿Eliminar "${product.modelo}" del catálogo?`)) return;
    try {
      await api.delete(`/api/productos/${product.id}`);
      toast.success('Modelo eliminado del catálogo');
      fetchProductos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const getStockClass = (stock) => {
    if (stock === 0) return 'stock-red';
    if (stock < 5) return 'stock-yellow';
    return 'stock-green';
  };

  const getProductImage = (product) => {
    return `http://localhost:8080/api/productos/${product.id}/foto`;
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect fill="#f0f0f0" width="60" height="60" rx="8"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="24" fill="#ccc">📱</text></svg>`);
  };

  return (
    <div className="inventario-page">
      <div className="inventario-header">
        <div>
          <h1 className="inventario-title">Dashboard del Inventario</h1>
          <p className="inventario-subtitle">Catálogo de Modelos y Especificaciones de Celulares</p>
        </div>
        {isAdmin && (
          <button className="btn-new-model" onClick={openCreateModal}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Modelo Base
          </button>
        )}
      </div>

      <div className="inventario-filters">
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por modelo, marca o especificación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={filterMarca}
          onChange={(e) => setFilterMarca(e.target.value)}
          className="filter-select"
        >
          <option value="Todas">Todas las marcas</option>
          {filterBrands.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando catálogo...</p>
        </div>
      ) : filteredProductos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No hay modelos registrados</h3>
          <p>{search || filterMarca !== 'Todas' ? 'No se encontraron resultados con los filtros aplicados' : 'Registra tu primer modelo base'}</p>
        </div>
      ) : (
        <div className="inventario-content-split">
          <div className={`inventario-table-wrapper ${isPanelOpen && selectedProducto ? 'split-active' : ''}`}>
            <table className="inventario-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Modelo</th>
                  <th>Marca</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  {isAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((p) => {
                  const isSelected = selectedProducto?.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setSelectedProducto(p);
                        setIsPanelOpen(true);
                      }}
                      className={`row-clickable ${isSelected ? 'row-selected' : ''}`}
                    >
                      <td>
                        <img
                          src={getProductImage(p)}
                          alt={p.modelo}
                          className="foto-thumbnail"
                          onError={handleImageError}
                        />
                      </td>
                      <td className="td-modelo">{p.modelo}</td>
                      <td>{p.marca}</td>
                      <td>
                        <span className={`stock-badge ${getStockClass(p.stock)}`}>{p.stock} unds</span>
                      </td>
                      <td className="td-precio">${Number(p.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                      {isAdmin && (
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="action-buttons">
                            <button className="btn-icon btn-edit" title="Editar" onClick={() => openEditModal(p)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button className="btn-icon btn-qr" title="Generar QR" onClick={() => openQrModal(p)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7"/>
                                <rect x="14" y="3" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/>
                                <rect x="3" y="14" width="7" height="7"/>
                              </svg>
                            </button>
                            <button className="btn-icon btn-delete" title="Eliminar" onClick={() => handleDelete(p)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>

                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {isPanelOpen && selectedProducto && (
            <div className="hw-side-panel">
              <div className="panel-header">
                <span className="panel-badge">FICHA DE HARDWARE</span>
                <button className="panel-close-btn" onClick={() => setIsPanelOpen(false)}>Cerrar X</button>
              </div>
              
              <div className="panel-body">
                <h2 className="panel-title">{selectedProducto.modelo}</h2>
                <p className="panel-subtitle">{selectedProducto.marca} • Gen {selectedProducto.red || 'N/A'}</p>
                
                <div className="panel-image-container">
                  <img
                    src={getProductImage(selectedProducto)}
                    alt={selectedProducto.modelo}
                    className="panel-image"
                    onError={handleImageError}
                  />
                </div>

                <div className="panel-specs-grid">
                  <div className="spec-card">
                    <div className="spec-icon">🧠</div>
                    <div className="spec-details">
                      <span className="spec-label">Procesador</span>
                      <span className="spec-value">{selectedProducto.procesador || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="spec-card">
                    <div className="spec-icon">💾</div>
                    <div className="spec-details">
                      <span className="spec-label">RAM / Disco</span>
                      <span className="spec-value">
                        {selectedProducto.ram || 'N/A'} / {selectedProducto.almacenamiento || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="spec-card">
                    <div className="spec-icon">🔋</div>
                    <div className="spec-details">
                      <span className="spec-label">Batería</span>
                      <span className="spec-value">{selectedProducto.bateria || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="spec-card">
                    <div className="spec-icon">📱</div>
                    <div className="spec-details">
                      <span className="spec-label">Pantalla</span>
                      <span className="spec-value">{selectedProducto.pantalla || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="panel-camera-box">
                  <h4 className="camera-box-title">Módulo de Cámaras Integrado</h4>
                  <div className="camera-specs-row">
                    <div className="camera-spec">
                      <span className="camera-label">Principal:</span>
                      <span className="camera-value">{selectedProducto.camaraPrincipal || 'N/A'}</span>
                    </div>
                    <div className="camera-spec">
                      <span className="camera-label">Frontal:</span>
                      <span className="camera-value">{selectedProducto.camaraFrontal || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="panel-footer">
                  <span className="price-label">Valor comercial sugerido:</span>
                  <span className="price-value">
                    ${Number(selectedProducto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && isAdmin && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Modelo Celular Base' : 'Nuevo Modelo Celular Base'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              
              <div className="image-upload-wrapper">
                <div className="image-upload-area">
                  <svg className="upload-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5c6bc0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>{fotoFile ? `Archivo seleccionado: ${fotoFile.name}` : 'Subir Imagen desde PC'}</span>
                  <input type="file" accept="image/*" onChange={(e) => setFotoFile(e.target.files[0])} className="file-input-hidden" />
                </div>
              </div>

              <div className="form-grid-3col">
                <div className="form-group">
                  <label>Modelo *</label>
                  <input type="text" name="modelo" value={formData.modelo} onChange={handleFormChange} placeholder="Ej: Galaxy S24 Ultra" required />
                </div>
                <div className="form-group">
                  <label>Marca *</label>
                  <select name="marca" value={formData.marca} onChange={handleFormChange}>
                    {selectBrandsOptions.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    <option value="Otro">Otro (Registrar nueva marca)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Precio ($) *</label>
                  <input type="number" name="precio" value={formData.precio} onChange={handleFormChange} placeholder="0.00" step="0.01" min="0" required />
                </div>
              </div>

              {formData.marca === 'Otro' && (
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Nombre de la Nueva Marca *</label>
                  <input
                    type="text"
                    value={nuevaMarca}
                    onChange={(e) => setNuevaMarca(e.target.value)}
                    placeholder="Escriba la nueva marca (ej. OnePlus, Google, Infinix...)"
                    required
                  />
                </div>
              )}

              <h3 className="specs-section-title">Ficha de Especificaciones de Hardware</h3>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Procesador (CPU)</label>
                  <input type="text" name="procesador" value={formData.procesador} onChange={handleFormChange} placeholder="Ej: Snapdragon 8 Gen 3" />
                </div>
                <div className="form-group">
                  <label>Memoria RAM</label>
                  <input type="text" name="ram" value={formData.ram} onChange={handleFormChange} placeholder="Ej: 8 GB / 12 GB" />
                </div>
                <div className="form-group">
                  <label>Almacenamiento Interno</label>
                  <input type="text" name="almacenamiento" value={formData.almacenamiento} onChange={handleFormChange} placeholder="Ej: 256 GB / 512 GB" />
                </div>
                <div className="form-group">
                  <label>Batería (mAh)</label>
                  <input type="text" name="bateria" value={formData.bateria} onChange={handleFormChange} placeholder="Ej: 5000 mAh" />
                </div>
                <div className="form-group">
                  <label>Cámara Principal</label>
                  <input type="text" name="camaraPrincipal" value={formData.camaraPrincipal} onChange={handleFormChange} placeholder="Ej: 48 MP + 12 MP" />
                </div>
                <div className="form-group">
                  <label>Cámara Frontal</label>
                  <input type="text" name="camaraFrontal" value={formData.camaraFrontal} onChange={handleFormChange} placeholder="Ej: 12 MP, f/1.9" />
                </div>
                <div className="form-group">
                  <label>Tamaño de Pantalla</label>
                  <input type="text" name="pantalla" value={formData.pantalla} onChange={handleFormChange} placeholder="Ej: 6.7 pulgadas" />
                </div>
                <div className="form-group">
                  <label>Generación de Red</label>
                  <select name="red" value={formData.red} onChange={handleFormChange}>
                    <option value="5G">5G</option>
                    <option value="4G">4G</option>
                    <option value="3G">3G</option>
                    <option value="2G">2G</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-custom">
                <button type="submit" className="btn-primary-custom" disabled={submitting}>
                  {submitting ? 'Guardando...' : (editingProduct ? 'Guardar Cambios' : 'Agregar Modelo Base')}
                </button>
                <button type="button" className="btn-secondary-custom" onClick={closeModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQrModal && qrProduct && (
        <div className="modal-overlay" onClick={closeQrModal}>
          <div className="modal-content modal-qr-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Código QR de Modelo</h2>
              <button className="modal-close" onClick={closeQrModal}>&times;</button>
            </div>
            <div className="qr-modal-body">
              <div className="qr-code-box">
                <QRCodeCanvas 
                  id="qr-canvas-download"
                  value={`MODELO_ID:${qrProduct.id}`} 
                  size={220}
                  level={"H"}
                  includeMargin={true}
                />
              </div>
              <p className="qr-modal-instruction">
                Escanee este código QR para acceder directamente a la ficha técnica y stock disponible en tiempo real de este dispositivo.
              </p>
              <div className="qr-modal-meta">
                <div><strong>Modelo:</strong> {qrProduct.modelo}</div>
                <div><strong>Marca:</strong> {qrProduct.marca}</div>
                <div><strong>Precio Sugerido:</strong> ${Number(qrProduct.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                <div><strong>Stock Actual:</strong> {qrProduct.stock} unds</div>
              </div>
              <div className="modal-actions-custom" style={{ flexDirection: 'column', gap: '8px', width: '100%', marginTop: '10px' }}>
                <button type="button" className="btn-primary-custom" onClick={downloadQrCode} style={{ width: '100%' }}>
                  Descargar Código QR
                </button>
                <button type="button" className="btn-secondary-custom" onClick={closeQrModal} style={{ width: '100%' }}>
                  Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventario;
