import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationKey, setVerificationKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/doctor-dashboard', { state: { verificationKey } });
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="card auth-card fade-in">
        <div className="card-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏥</div>
          <h2 style={{ color: 'var(--success)' }}>Provider Login</h2>
          <p>Sign in to your authorized medical account</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} id="doctor-login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Registered Email</label>
            <input id="login-email" className="form-input" type="email" placeholder="doctor@hospital.gov.in"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input id="login-password" className="form-input" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="login-key">Patient Verification Key (Optional)</label>
            <input id="login-key" className="form-input" type="text" placeholder="MV-VER-XXXX-XXXX"
              value={verificationKey} onChange={(e) => setVerificationKey(e.target.value)}
              style={{ fontFamily: "'Courier New', monospace", letterSpacing: '1px', textTransform: 'uppercase' }} />
          </div>

          <div className="captcha-box">
            <span style={{ fontFamily: 'monospace', letterSpacing: '2px', fontWeight: 'bold', fontSize: '1.2rem', background: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}>
              8V4Q2
            </span>
            <input type="text" className="form-input" style={{ width: '120px' }} placeholder="Enter Captcha" required />
          </div>

          <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In Securely'}
          </button>
        </form>

        <div className="auth-divider">Not authorized? <Link to="/register-doctor">Request provider access</Link></div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/login" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Return to Citizen Login</Link>
        </div>
      </div>
    </div>
  );
}
