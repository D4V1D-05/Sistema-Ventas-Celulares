import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';
import Historial from './pages/Historial';
import Reportes from './pages/Reportes';
import EscanerQR from './pages/EscanerQR';
import GestionImei from './pages/GestionImei';
import GestionProveedores from './pages/GestionProveedores';
import IngresoEquipos from './pages/IngresoEquipos';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><Navbar /><Navigate to="/ventas" replace /></ProtectedRoute>} />
            
            <Route path="/inventario" element={
              <ProtectedRoute>
                <Navbar />
                <Inventario />
              </ProtectedRoute>
            } />
            
            <Route path="/ventas" element={
              <ProtectedRoute>
                <Navbar />
                <Ventas />
              </ProtectedRoute>
            } />
            
            <Route path="/historial" element={
              <ProtectedRoute>
                <Navbar />
                <Historial />
              </ProtectedRoute>
            } />
            
            <Route path="/reportes" element={
              <ProtectedRoute>
                <Navbar />
                <Reportes />
              </ProtectedRoute>
            } />
            
            <Route path="/escaner-qr" element={
              <ProtectedRoute>
                <Navbar />
                <EscanerQR />
              </ProtectedRoute>
            } />
            
            <Route path="/imei" element={
              <ProtectedRoute roles={['ADMINISTRADOR']}>
                <Navbar />
                <GestionImei />
              </ProtectedRoute>
            } />

            <Route path="/proveedores" element={
              <ProtectedRoute roles={['ADMINISTRADOR']}>
                <Navbar />
                <GestionProveedores />
              </ProtectedRoute>
            } />

            <Route path="/ingreso-equipos" element={
              <ProtectedRoute roles={['ADMINISTRADOR']}>
                <Navbar />
                <IngresoEquipos />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
