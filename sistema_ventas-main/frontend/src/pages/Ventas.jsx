import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Ventas.css';

const Ventas = () => {
    const { user } = useAuth();
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [metodoPago, setMetodoPago] = useState('CONTADO');
    const [descuento, setDescuento] = useState(0);
    const [interes, setInteres] = useState(0);
    const [cuotas, setCuotas] = useState(3);
    const [loading, setLoading] = useState(false);

    // Client data state
    const [clienteNombre, setClienteNombre] = useState('');
    const [clienteDocumento, setClienteDocumento] = useState('');
    const [clienteTelefono, setClienteTelefono] = useState('');

    // Available IMEIs state
    const [imeisDisponiblesMap, setImeisDisponiblesMap] = useState({});

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const res = await axiosInstance.get('/api/productos');
            setProductos(res.data.filter(p => p.stock > 0)); // Solo mostrar con stock
        } catch (error) {
            toast.error('Error al cargar productos');
        }
    };

    const fetchImeisDisponibles = async (productoId) => {
        try {
            const res = await axiosInstance.get(`/api/imeis/producto/${productoId}/disponibles`);
            setImeisDisponiblesMap(prev => ({ ...prev, [productoId]: res.data }));
        } catch (error) {
            console.error('Error al cargar IMEIs disponibles', error);
        }
    };

    const addToCart = (producto) => {
        const exist = carrito.find(item => item.productoId === producto.id);
        if (exist) {
            if (exist.cantidad >= producto.stock) {
                toast.error('No hay suficiente stock');
                return;
            }
            setCarrito(carrito.map(item => {
                if (item.productoId === producto.id) {
                    const newQty = item.cantidad + 1;
                    const nextImeis = [...item.selectedImeis];
                    while (nextImeis.length < newQty) nextImeis.push('');
                    return { ...item, cantidad: newQty, selectedImeis: nextImeis };
                }
                return item;
            }));
        } else {
            // Fetch available IMEIs if not loaded yet
            if (!imeisDisponiblesMap[producto.id]) {
                fetchImeisDisponibles(producto.id);
            }
            setCarrito([...carrito, { 
                productoId: producto.id, 
                modelo: producto.modelo, 
                marca: producto.marca,
                precio: producto.precio,
                cantidad: 1,
                maxStock: producto.stock,
                selectedImeis: ['']
            }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCarrito(carrito.map(item => {
            if (item.productoId === id) {
                const newQty = item.cantidad + delta;
                if (newQty > 0 && newQty <= item.maxStock) {
                    let nextImeis = [...item.selectedImeis];
                    if (delta > 0) {
                        while (nextImeis.length < newQty) nextImeis.push('');
                    } else {
                        nextImeis = nextImeis.slice(0, newQty);
                    }
                    return { ...item, cantidad: newQty, selectedImeis: nextImeis };
                }
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCarrito(carrito.filter(item => item.productoId !== id));
    };

    const handleImeiSelectChange = (productoId, index, value) => {
        setCarrito(carrito.map(item => {
            if (item.productoId === productoId) {
                const nextImeis = [...item.selectedImeis];
                nextImeis[index] = value;
                return { ...item, selectedImeis: nextImeis };
            }
            return item;
        }));
    };

    const calcularSubtotal = () => {
        return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    };

    const calcularTotal = () => {
        const sub = calcularSubtotal();
        if (metodoPago === 'CONTADO') {
            return sub * (1 - (descuento / 100));
        } else {
            return sub * (1 + (interes / 100));
        }
    };

    const handleConfirmarVenta = async () => {
        if (carrito.length === 0) return toast.error('El carrito está vacío');
        
        // Client validations
        if (!clienteNombre.trim() || !clienteDocumento.trim() || !clienteTelefono.trim()) {
            return toast.error('Debe completar todos los datos del cliente');
        }
        if (clienteDocumento.length !== 8 && clienteDocumento.length !== 11) {
            return toast.error('El DNI debe tener 8 dígitos o el RUC debe tener 11 dígitos');
        }
        if (clienteTelefono.length !== 9) {
            return toast.error('El teléfono debe tener exactamente 9 dígitos');
        }

        // IMEI validations
        for (const item of carrito) {
            const availableList = imeisDisponiblesMap[item.productoId] || [];
            const availableImeiStrings = availableList.map(i => i.imei);
            
            for (let i = 0; i < item.selectedImeis.length; i++) {
                const imei = item.selectedImeis[i];
                if (!imei) {
                    return toast.error(`Debe seleccionar o escribir el IMEI #${i + 1} para ${item.modelo}`);
                }
                if (!availableImeiStrings.includes(imei)) {
                    return toast.error(`El IMEI "${imei}" no es válido o no está disponible para ${item.modelo}`);
                }
            }

            // Check duplicate selection within the same product
            const uniqueSelected = new Set(item.selectedImeis);
            if (uniqueSelected.size !== item.selectedImeis.length) {
                return toast.error(`No puede seleccionar el mismo IMEI más de una vez para ${item.modelo}`);
            }
        }

        setLoading(true);
        try {
            const request = {
                vendedorId: user?.id || (user?.usuario && user?.usuario.id) || 2, // Support nested user id
                metodoPago: metodoPago,
                descuentoPorcentaje: metodoPago === 'CONTADO' ? parseFloat(descuento) : 0,
                interesPorcentaje: metodoPago === 'CUOTAS' ? parseFloat(interes) : 0,
                numeroCuotas: metodoPago === 'CUOTAS' ? parseInt(cuotas) : 0,
                clienteNombre: clienteNombre.trim(),
                clienteDocumento: clienteDocumento.trim(),
                clienteTelefono: clienteTelefono.trim(),
                items: carrito.map(item => ({
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    imeis: item.selectedImeis
                }))
            };

            await axiosInstance.post('/api/ventas', request);
            toast.success('Venta registrada exitosamente');
            setCarrito([]);
            setDescuento(0);
            setInteres(0);
            setClienteNombre('');
            setClienteDocumento('');
            setClienteTelefono('');
            fetchProductos();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al registrar la venta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container ventas-page">
            <div className="ventas-grid">
                <div className="productos-section card">
                    <h2>Módulo de Ventas - Productos Disponibles</h2>
                    <div className="productos-list">
                        {productos.map(p => (
                            <div key={p.id} className="producto-card">
                                <div className="producto-img">
                                    {p.fotoUrl ? 
                                        <img src={`http://localhost:8080/api/productos/${p.id}/foto`} alt={p.modelo} /> :
                                        <div className="img-placeholder">Sin Foto</div>
                                    }
                                </div>
                                <div className="producto-info">
                                    <h3>{p.modelo} <span className="marca-badge">{p.marca}</span></h3>
                                    <div className="precio-stock">
                                        <span className="precio">${p.precio}</span>
                                        <span className={`stock-text ${p.stock < 5 ? 'low' : ''}`}>Stock: {p.stock}</span>
                                    </div>
                                    <button className="btn-primary" onClick={() => addToCart(p)}>+ Agregar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="carrito-section card">
                    <h2><span role="img" aria-label="cart">🛒</span> Carrito de Compras</h2>
                    
                    {carrito.length === 0 ? (
                        <div className="empty-cart">Carrito vacío</div>
                    ) : (
                        <>
                            <div className="carrito-items">
                                {carrito.map(item => (
                                    <div key={item.productoId} className="cart-item-container">
                                        <div className="cart-item">
                                            <div className="item-details">
                                                <h4>{item.modelo}</h4>
                                                <span>${item.precio}</span>
                                            </div>
                                            <div className="item-actions">
                                                <button onClick={() => updateQuantity(item.productoId, -1)}>-</button>
                                                <span>{item.cantidad}</span>
                                                <button onClick={() => updateQuantity(item.productoId, 1)}>+</button>
                                                <button className="remove-btn" onClick={() => removeFromCart(item.productoId)}>✖</button>
                                            </div>
                                        </div>
                                        <div className="cart-item-imeis">
                                            {Array.from({ length: item.cantidad }).map((_, idx) => {
                                                const availableList = imeisDisponiblesMap[item.productoId] || [];
                                                const selectedInOtherInputs = item.selectedImeis.filter((val, i) => i !== idx && val !== '');
                                                const filteredAvailableList = availableList.filter(imeiObj => !selectedInOtherInputs.includes(imeiObj.imei));

                                                return (
                                                    <div key={idx} className="imei-input-row">
                                                        <label>IMEI #{idx + 1} *</label>
                                                        <input
                                                            type="text"
                                                            list={`imeis-list-${item.productoId}-${idx}`}
                                                            value={item.selectedImeis[idx] || ''}
                                                            onChange={(e) => handleImeiSelectChange(item.productoId, idx, e.target.value)}
                                                            placeholder="Buscar/Escribir IMEI..."
                                                            required
                                                        />
                                                        <datalist id={`imeis-list-${item.productoId}-${idx}`}>
                                                            {filteredAvailableList.map(imeiObj => (
                                                                <option key={imeiObj.id} value={imeiObj.imei} />
                                                            ))}
                                                        </datalist>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cliente-form-section">
                                <h3>Datos del Cliente</h3>
                                <div className="form-group">
                                    <label>Nombre Completo *</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Juan Pérez"
                                        value={clienteNombre}
                                        onChange={(e) => setClienteNombre(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-row-2col">
                                    <div className="form-group">
                                        <label>DNI / RUC *</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: 12345678"
                                            value={clienteDocumento}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 11) {
                                                    setClienteDocumento(val);
                                                }
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Teléfono *</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: 987654321"
                                            value={clienteTelefono}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 9) {
                                                    setClienteTelefono(val);
                                                }
                                            }}
                                            maxLength={9}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="pago-section">
                        <h3>Método de Pago</h3>
                        <div className="radio-group">
                            <label>
                                <input type="radio" name="pago" checked={metodoPago === 'CONTADO'} onChange={() => setMetodoPago('CONTADO')} /> Contado
                            </label>
                            <label>
                                <input type="radio" name="pago" checked={metodoPago === 'CUOTAS'} onChange={() => setMetodoPago('CUOTAS')} /> Cuotas
                            </label>
                        </div>

                        {metodoPago === 'CONTADO' ? (
                            <div className="form-group">
                                <label>Descuento (%)</label>
                                <input type="number" min="0" max="100" value={descuento} onChange={(e) => setDescuento(e.target.value)} />
                            </div>
                        ) : (
                            <div className="cuotas-config">
                                <div className="form-group">
                                    <label>Interés (%)</label>
                                    <input type="number" min="0" value={interes} onChange={(e) => setInteres(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Nº Cuotas</label>
                                    <select value={cuotas} onChange={(e) => setCuotas(e.target.value)}>
                                        <option value="3">3 cuotas</option>
                                        <option value="6">6 cuotas</option>
                                        <option value="9">9 cuotas</option>
                                        <option value="12">12 cuotas</option>
                                        <option value="24">24 cuotas</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="resumen-section">
                        <div className="resumen-row">
                            <span>Subtotal:</span>
                            <span>${calcularSubtotal().toFixed(2)}</span>
                        </div>
                        {metodoPago === 'CONTADO' && descuento > 0 && (
                            <div className="resumen-row discount">
                                <span>Descuento ({descuento}%):</span>
                                <span>-${(calcularSubtotal() * (descuento/100)).toFixed(2)}</span>
                            </div>
                        )}
                        {metodoPago === 'CUOTAS' && interes > 0 && (
                            <div className="resumen-row interest">
                                <span>Interés ({interes}%):</span>
                                <span>+${(calcularSubtotal() * (interes/100)).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="resumen-row total">
                            <span>Total Final:</span>
                            <span>${calcularTotal().toFixed(2)}</span>
                        </div>
                        {metodoPago === 'CUOTAS' && (
                            <div className="resumen-row cuota-monto">
                                <span>Monto por cuota:</span>
                                <span>${(calcularTotal() / cuotas).toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="cart-buttons">
                        <button className="btn-danger" onClick={() => setCarrito([])} disabled={carrito.length === 0}>Vaciar Carrito</button>
                        <button className="btn-success" onClick={handleConfirmarVenta} disabled={carrito.length === 0 || loading}>
                            {loading ? 'Procesando...' : 'Confirmar Venta'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ventas;
