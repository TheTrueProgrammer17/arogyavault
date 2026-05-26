import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main>
      {/* Notice Banner */}
      <div className="notice-banner">
        <span>📢 Official Notice: ArogyaVault v2.0 is now live for all citizens. <a href="#">Read the guidelines</a>.</span>
      </div>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div style={{ display: 'inline-block', marginBottom: '16px' }}>
            <span className="verification-badge verified" style={{ fontSize: '1rem', padding: '6px 16px' }}>
              🇮🇳 National Health Authority Initiative
            </span>
          </div>
          <h1>Secure Emergency Medical Access<br />Anywhere, Anytime</h1>
          <p>
            ArogyaVault securely stores your critical emergency medical information, allowing faster treatment and unified health records access during accidents and emergencies.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Create Citizen Profile</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Citizen Login</Link>
          </div>
        </div>
      </section>

      {/* Primary Feature Cards */}
      <section id="features" className="container" style={{ paddingTop: '60px', paddingBottom: '20px' }}>
        <h2 className="section-title">Citizen Services</h2>
        <div className="features" style={{ paddingTop: '20px' }}>
          <div className="card feature-card">
            <div className="feature-icon">📱</div>
            <h3>Emergency QR System</h3>
            <p>Generate a unique lock-screen QR code for instant responder access to critical triage data.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">👤</div>
            <h3>Central Medical Profile</h3>
            <p>Maintain your vital health records, blood group, allergies, and emergency contacts in one secure vault.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">👨‍👩‍👧‍👦</div>
            <h3>Family Dashboard</h3>
            <p>Link and manage structured emergency health records for your entire family and dependents.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">📄</div>
            <h3>Verified Documents</h3>
            <p>Safely store and share verified medical documents, prescriptions, and reports with healthcare providers.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">📞</div>
            <h3>Emergency Contacts</h3>
            <p>Automated SMS and call alerts to your registered emergency contacts during an active emergency.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Hospital Access System</h3>
            <p>Secure, time-limited verification keys for doctors to access your comprehensive medical history.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="steps-section">
        <div className="container">
          <h2 className="section-title">How ArogyaVault Works</h2>
          <div className="steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Register securely using your phone number.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Add Medical Info</h3>
              <p>Input vitals, allergies, and conditions.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Verify Documents</h3>
              <p>Upload and get medical records verified by doctors.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Generate QR</h3>
              <p>Download your unique emergency access QR card.</p>
            </div>
            <div className="step-card">
              <div className="step-number">5</div>
              <h3>Emergency Access</h3>
              <p>Responders scan your QR for instant life-saving data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">4.2M+</div>
              <div className="stat-label">Registered Citizens</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">12M+</div>
              <div className="stat-label">Verified Records</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15k+</div>
              <div className="stat-label">Connected Hospitals</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">8.5k+</div>
              <div className="stat-label">Emergency Access Requests</div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 className="section-title">About ArogyaVault</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
          ArogyaVault is a digital health repository designed to bridge the gap between citizens and emergency responders. Built on secure, encrypted architecture, it ensures that your critical medical history speaks for you when you cannot. 
        </p>
        <div style={{ marginTop: '40px' }}>
          <Link to="/doctor-login" className="btn btn-secondary">👨‍⚕️ Healthcare Provider Portal</Link>
        </div>
      </section>
    </main>
  );
}
