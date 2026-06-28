import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false, roles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRol = user?.rol || (user?.usuario && user?.usuario.rol);
  const isAdmin = userRol === 'ADMIN' || userRol === 'ADMINISTRADOR' || userRol === 'Administrador';

  const requiresAdmin = adminOnly || (roles && roles.includes('ADMINISTRADOR'));

  if (requiresAdmin && !isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)',
        marginTop: '64px',
        color: '#666'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚫</div>
        <h2 style={{ color: '#f44336', marginBottom: '8px' }}>Acceso denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
