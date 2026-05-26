import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agreed) return setError('You must agree to the Terms of Service.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');
    setLoading(true);
    
    // Fallback: If email is empty, generate a dummy one for Firebase Auth
    const signupEmail = email || `${phone}@arogyavault.in`;

    try {
      await signup(signupEmail, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'An account with this email/phone already exists.' : err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="card auth-card fade-in" style={{ maxWidth: '600px' }}>
        <div className="card-header">
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🇮🇳</div>
          <h2>Citizen Registration</h2>
          <p>Create your national medical profile</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} id="register-form">
          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name *</label>
              <input id="reg-name" className="form-input" type="text" placeholder="As per Aadhaar"
                value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Mobile Number *</label>
              <div style={{ display: 'flex' }}>
                <span style={{ padding: '10px 14px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRight: 'none', borderRadius: 'var(--radius) 0 0 var(--radius)' }}>+91</span>
                <input id="reg-phone" className="form-input" style={{ borderRadius: '0 var(--radius) var(--radius) 0' }} type="tel" placeholder="10-digit number"
                  value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-gender">Gender *</label>
              <select id="reg-gender" className="form-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Transgender / Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-dob">Date of Birth *</label>
              <input id="reg-dob" className="form-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address (Optional)</label>
            <input id="reg-email" className="form-input" type="email" placeholder="Required for password recovery"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Create Password *</label>
              <input id="reg-password" className="form-input" type="password" placeholder="Min 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password *</label>
              <input id="reg-confirm" className="form-input" type="password" placeholder="Re-enter password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '8px' }}>
            <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: '4px' }} />
            <label htmlFor="terms" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I consent to the secure storage of my medical information.
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '16px' }}>
            {loading ? 'Registering...' : 'Register as Citizen'}
          </button>
        </form>

        <div className="auth-divider">Already registered? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
