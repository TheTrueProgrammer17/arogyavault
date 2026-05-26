import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DoctorLayout() {
  const { logout, userData, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: '/doctor-dashboard', label: 'Verify Documents', icon: '✅' },
  ];

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="doctor-layout">
      {/* Sidebar */}
      <aside className="doctor-sidebar">
        <div className="doctor-sidebar-header">
          <span style={{ fontSize: '1.5rem' }}>🩺</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.5px' }}>PROVIDER PORTAL</div>
            <div style={{ fontSize: '0.8rem', color: '#86efac' }}>ArogyaVault</div>
          </div>
        </div>
        
        <div style={{ flex: 1, padding: '16px 0' }}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`doctor-sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ padding: '16px 0', borderTop: '1px solid #166534' }}>
          <button 
            className="doctor-sidebar-link" 
            onClick={handleLogout} 
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>🚪</span>
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="doctor-main">
        <div className="doctor-topbar">
          <div style={{ fontWeight: 600, color: '#1e293b' }}>
            {userData?.hospitalName || 'Medical Facility'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: '#dcfce7', color: '#16a34a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1.1rem'
            }}>
              {userData?.name ? userData.name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>
                {userData?.name || currentUser?.displayName || 'Doctor'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Registration ID: {userData?.registrationId || 'Verified'}</div>
            </div>
          </div>
        </div>
        
        <div className="doctor-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
