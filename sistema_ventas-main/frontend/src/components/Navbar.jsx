import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const userRol = user.rol || (user.usuario && user.usuario.rol);
  const isAdmin = userRol === 'ADMIN' || userRol === 'ADMINISTRADOR' || userRol === 'Administrador';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = isAdmin
    ? [
      { to: '/inventario', label: 'Inventario' },
      { to: '/ventas', label: 'Ventas' },
      { to: '/historial', label: 'Historial' },
      { to: '/reportes', label: 'Reportes' },
      { to: '/proveedores', label: 'Proveedores' },
      { to: '/ingreso-equipos', label: 'Ingreso Equipos' },
      { to: '/imei', label: 'IMEI' },
      { to: '/escaner-qr', label: 'Escáner QR' },
    ]
    : [
      { to: '/inventario', label: 'Inventario' },
      { to: '/ventas', label: 'Ventas' },
      { to: '/historial', label: 'Historial' },
      { to: '/reportes', label: 'Reportes' },
      { to: '/escaner-qr', label: 'Escáner QR' },
    ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/ventas" className="navbar-brand">
          <span className="navbar-brand-icon">📱</span>
          Sistema de Ventas
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-user">
          <span className="navbar-username">{(user.usuario && (user.usuario.nombreCompleto || user.usuario.username)) || user.username || user.nombre || 'Usuario'}</span>
          <span className={`navbar-role-badge ${isAdmin ? 'admin' : 'vendedor'}`}>
            {isAdmin ? 'Admin' : 'Vendedor'}
          </span>
          <button className="navbar-logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
