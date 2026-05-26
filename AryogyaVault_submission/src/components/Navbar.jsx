import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar({ onMenuClick }) {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  }

  // Hide navbar on emergency page
  if (location.pathname.startsWith('/emergency/')) return null;

  const isDoctor = userData?.role === 'doctor';

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="hamburger" onClick={onMenuClick}>
          ☰
        </button>
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">🏥</div>
          ArogyaVault
        </Link>
      </div>
      
      {!currentUser && (
        <div className="navbar-menu-links">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#about" className="nav-link">About</a>
          <a href="#features" className="nav-link">Services</a>
          <Link to="/register" className="nav-link">Create Profile</Link>
        </div>
      )}

      <div className="navbar-links">
        <button className="btn btn-ghost" onClick={toggleTheme} title="Toggle Theme" style={{ padding: '6px', fontSize: '1.2rem' }}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        {currentUser ? (
          <div className="navbar-user">
            {isDoctor && (
              <span className="tag">🩺 Provider</span>
            )}
            <span>Hi, {currentUser.displayName || 'Citizen'}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
