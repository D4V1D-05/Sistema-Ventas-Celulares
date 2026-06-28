import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('vendedor');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    const userRol = user?.rol || (user?.usuario && user?.usuario.rol);
    const isAdmin = userRol === 'ADMIN' || userRol === 'ADMINISTRADOR' || userRol === 'Administrador';
    navigate(isAdmin ? '/inventario' : '/ventas', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    const rolValue = rol === 'admin' ? 'ADMINISTRADOR' : 'VENDEDOR';
    const result = await login(username.trim(), password, rolValue);

    if (result.success) {
      navigate(rol === 'admin' ? '/inventario' : '/ventas');
    } else {
      setError(typeof result.message === 'string' ? result.message : 'Credenciales inválidas');
    }
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>

        <h1 className="login-title">Sistema de Ventas</h1>
        <p className="login-subtitle">Gestión de celulares</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <span className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <span className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              autoComplete="current-password"
            />
          </div>

          <div className="role-selector">
            <label className="role-label">Tipo de usuario:</label>
            <div className="role-options">
              <label className={`role-option ${rol === 'vendedor' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="rol"
                  value="vendedor"
                  checked={rol === 'vendedor'}
                  onChange={(e) => setRol(e.target.value)}
                />
                <span className="role-radio-custom"></span>
                Vendedor
              </label>
              <label className={`role-option ${rol === 'admin' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="rol"
                  value="admin"
                  checked={rol === 'admin'}
                  onChange={(e) => setRol(e.target.value)}
                />
                <span className="role-radio-custom"></span>
                Administrador
              </label>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-loading">
                <span className="btn-spinner"></span>
                Ingresando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
