import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DoctorRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hospital, setHospital] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signupDoctor } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');
    setLoading(true);
    try {
      await signupDoctor(email, password, `Dr. ${name}`, hospital);
      navigate('/dashboard');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'An account with this email already exists.' : err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="card auth-card fade-in" style={{ maxWidth: '500px' }}>
        <div className="card-header">
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏥</div>
          <h2 style={{ color: 'var(--success)' }}>Provider Registration</h2>
          <p>Register your facility with ArogyaVault</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <div className="notice-banner" style={{ marginBottom: '20px', borderRadius: '4px', textAlign: 'left' }}>
          Note: Provider accounts are subject to manual verification. Your license and facility credentials will be reviewed.
        </div>

        <form onSubmit={handleSubmit} id="doctor-register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="doc-name">Full Name (As per Medical Council)</label>
            <input id="doc-name" className="form-input" type="text" placeholder="John Doe"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="doc-email">Official Email</label>
            <input id="doc-email" className="form-input" type="email" placeholder="doctor@hospital.gov.in"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="doc-hospital">Hospital / Clinic Name</label>
            <input id="doc-hospital" className="form-input" type="text" placeholder="City General Hospital"
              value={hospital} onChange={(e) => setHospital(e.target.value)} required />
          </div>
          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="doc-password">Password</label>
              <input id="doc-password" className="form-input" type="password" placeholder="Min 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="doc-confirm">Confirm Password</label>
              <input id="doc-confirm" className="form-input" type="password" placeholder="Re-enter password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>

        <div className="auth-divider">Already registered? <Link to="/doctor-login">Sign in</Link></div>
      </div>
    </div>
  );
}
