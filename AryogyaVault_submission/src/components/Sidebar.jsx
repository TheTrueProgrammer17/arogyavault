import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout, userData } = useAuth();
  const navigate = useNavigate();

  const patientLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Medical Profile', icon: '👤' },
    { path: '/family', label: 'Family Dashboard', icon: '👨‍👩‍👧‍👦' },
    { path: '/documents', label: 'Documents', icon: '📄' },
    { path: '/qr', label: 'Emergency QR', icon: '📱' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const links = patientLinks;

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => { if (window.innerWidth <= 768) onClose(); }}
          >
            <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
        <button 
          className="sidebar-link" 
          onClick={handleLogout} 
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
