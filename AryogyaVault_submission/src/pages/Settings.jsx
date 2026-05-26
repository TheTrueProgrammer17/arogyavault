import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { currentUser, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  useEffect(() => {
    // Left empty since dark mode is removed
  }, []);

  return (
    <div className="container fade-in">
      <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '24px' }}>Account Settings</h1>
      
      <div className="grid-2" style={{ gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* Settings Sidebar */}
        <div className="card" style={{ padding: '16px 0', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button 
              className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
            >
              👤 Profile Information
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
            >
              🎨 Appearance
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
            >
              🔒 Privacy & Security
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'emergency' ? 'active' : ''}`}
              onClick={() => setActiveTab('emergency')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
            >
              🚨 Emergency Preferences
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="card">
          {activeTab === 'profile' && (
            <div>
              <div className="card-header">
                <h2>Profile Information</h2>
                <p>Update your basic account details.</p>
              </div>
              <form>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" defaultValue={currentUser?.displayName || ''} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" defaultValue={currentUser?.email || ''} disabled />
                  <small style={{ color: 'var(--text-muted)' }}>Email cannot be changed directly for security reasons.</small>
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input type="tel" className="form-input" placeholder="+91" />
                </div>
                <button type="button" className="btn btn-primary mt-4">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <div className="card-header">
                <h2>Appearance</h2>
                <p>Customize your viewing experience.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Standard Theme</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ArogyaVault uses a standard government-approved light theme for maximum accessibility and readability.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <div className="card-header">
                <h2>Privacy & Security</h2>
                <p>Manage your password and active sessions.</p>
              </div>
              <form>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" />
                </div>
                <button type="button" className="btn btn-primary mt-4">Update Password</button>
              </form>
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--danger)', marginBottom: '16px' }}>Danger Zone</h3>
                <button type="button" className="btn btn-danger">Deactivate Account</button>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div>
              <div className="card-header">
                <h2>Emergency Preferences</h2>
                <p>Configure how your data is handled during emergencies.</p>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <input type="checkbox" id="organ-donor" style={{ width: '20px', height: '20px' }} />
                <div>
                  <label htmlFor="organ-donor" style={{ fontWeight: 'bold', display: 'block' }}>Registered Organ Donor</label>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Display organ donor status on your emergency QR card.</span>
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <input type="checkbox" id="auto-alert" defaultChecked style={{ width: '20px', height: '20px' }} />
                <div>
                  <label htmlFor="auto-alert" style={{ fontWeight: 'bold', display: 'block' }}>Auto-Alert Emergency Contacts</label>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Send automatic SMS to emergency contacts when QR is scanned.</span>
                </div>
              </div>
              <button type="button" className="btn btn-primary mt-4">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
