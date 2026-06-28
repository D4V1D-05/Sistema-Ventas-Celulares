import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import './Reportes.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Reportes = () => {
    const today = new Date();
    const [mes, setMes] = useState(today.getMonth() + 1);
    const [anio, setAnio] = useState(today.getFullYear());
    
    const [resumen, setResumen] = useState(null);
    const [ventasDiaData, setVentasDiaData] = useState([]);
    const [ventasMetodoData, setVentasMetodoData] = useState([]);
    const [topProductosData, setTopProductosData] = useState([]);

    useEffect(() => {
        fetchReportes();
    }, [mes, anio]);

    const fetchReportes = async () => {
        try {
            const [resResumen, resDia, resMetodo, resTop] = await Promise.all([
                axiosInstance.get(`/api/reportes/resumen?mes=${mes}&anio=${anio}`),
                axiosInstance.get(`/api/reportes/ventas-por-dia?mes=${mes}&anio=${anio}`),
                axiosInstance.get(`/api/reportes/ventas-por-metodo?mes=${mes}&anio=${anio}`),
                axiosInstance.get(`/api/reportes/productos-mas-vendidos?mes=${mes}&anio=${anio}`)
            ]);

            setResumen(resResumen.data);
            setVentasDiaData(resDia.data);
            setVentasMetodoData(resMetodo.data);
            setTopProductosData(resTop.data);
        } catch (error) {
            toast.error('Error al cargar los reportes');
        }
    };

    const barChartDia = {
        labels: ventasDiaData.map(v => v.dia),
        datasets: [
            {
                label: 'Ventas ($)',
                data: ventasDiaData.map(v => v.total),
                backgroundColor: '#2196F3',
            }
        ]
    };

    const pieChartMetodo = {
        labels: ventasMetodoData.map(v => v.metodoPago),
        datasets: [
            {
                data: ventasMetodoData.map(v => v.total),
                backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#9C27B0'],
            }
        ]
    };

    const barChartTop = {
        labels: topProductosData.map(p => p.modelo),
        datasets: [
            {
                label: 'Cantidad Vendida',
                data: topProductosData.map(p => p.cantidadVendida),
                backgroundColor: '#1976D2',
            }
        ]
    };

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return (
        <div className="page-container reportes-page">
            <div className="reportes-header">
                <h2>Reportes y Análisis</h2>
                <div className="date-filters">
                    <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
                        {meses.map((m, index) => (
                            <option key={index + 1} value={index + 1}>{m}</option>
                        ))}
                    </select>
                    <input 
                        type="number" 
                        value={anio} 
                        onChange={(e) => setAnio(Number(e.target.value))}
                        min="2020" max="2100"
                    />
                </div>
            </div>

            <div className="summary-cards">
                <div className="summary-card card">
                    <div className="icon">📅</div>
                    <div className="info">
                        <p>Mes Actual</p>
                        <h3>{meses[mes-1]} {anio}</h3>
                    </div>
                </div>
                <div className="summary-card card">
                    <div className="icon">💰</div>
                    <div className="info">
                        <p>Total Ventas</p>
                        <h3>${resumen?.totalVentas?.toFixed(2) || '0.00'}</h3>
                    </div>
                </div>
                <div className="summary-card card">
                    <div className="icon">🛍️</div>
                    <div className="info">
                        <p>Transacciones</p>
                        <h3>{resumen?.cantidadTransacciones || 0}</h3>
                    </div>
                </div>
                <div className="summary-card card">
                    <div className="icon">📈</div>
                    <div className="info">
                        <p>Promedio por Venta</p>
                        <h3>${resumen?.promedioPorVenta?.toFixed(2) || '0.00'}</h3>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-container card">
                    <h3>Ventas por Día del Mes</h3>
                    <div className="chart-wrapper">
                        <Bar data={barChartDia} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="chart-container card">
                    <h3>Ventas por Método de Pago</h3>
                    <div className="chart-wrapper pie-wrapper">
                        <Pie data={pieChartMetodo} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            <div className="bottom-chart card">
                <h3>Productos Más Vendidos</h3>
                <div className="chart-wrapper">
                    <Bar data={barChartTop} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

export default Reportes;
