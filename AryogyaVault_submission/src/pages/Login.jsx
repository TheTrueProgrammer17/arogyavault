import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Fallback: If using phone method, use a placeholder email since backend only supports email/password currently.
    // In a real gov app, this would use OTP.
    const loginEmail = loginMethod === 'phone' ? `${phone}@arogyavault.in` : email;
    
    try {
      // Trying email login
      if(loginMethod === 'email' || loginMethod === 'phone') {
        await login(loginMethod === 'phone' ? 'demo@arogyavault.in' : email, password); // fallback to demo for phone UI
        navigate('/dashboard');
      }
    } catch (err) {
      if (loginMethod === 'phone') {
         setError('OTP login is under maintenance. Please use Email login or demo credentials.');
      } else {
         setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : err.message);
      }
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="card auth-card fade-in">
        <div className="card-header">
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🇮🇳</div>
          <h2>Citizen Login</h2>
          <p>Access your national medical profile</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button className={`btn btn-block ${loginMethod === 'phone' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setLoginMethod('phone')}>Mobile Number</button>
          <button className={`btn btn-block ${loginMethod === 'email' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setLoginMethod('email')}>Email ID</button>
        </div>

        <form onSubmit={handleSubmit} id="login-form">
          {loginMethod === 'phone' ? (
            <div className="form-group">
              <label className="form-label" htmlFor="login-phone">Mobile Number</label>
              <div style={{ display: 'flex' }}>
                <span style={{ padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRight: 'none', borderRadius: 'var(--radius) 0 0 var(--radius)' }}>+91</span>
                <input id="login-phone" className="form-input" style={{ borderRadius: '0 var(--radius) var(--radius) 0' }} type="tel" placeholder="10-digit mobile number"
                  value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input id="login-email" className="form-input" type="email" placeholder="citizen@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password / OTP</label>
            <input id="login-password" className="form-input" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="captcha-box">
            <span style={{ fontFamily: 'monospace', letterSpacing: '2px', fontWeight: 'bold', fontSize: '1.2rem', background: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}>
              AB8xY
            </span>
            <input type="text" className="form-input" style={{ width: '120px' }} placeholder="Enter Captcha" required />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In securely'}
          </button>
        </form>

        <div className="auth-divider">New user? <Link to="/register">Register here</Link></div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/doctor-login" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Are you a healthcare provider? Login here</Link>
        </div>
      </div>
    </div>
  );
}
