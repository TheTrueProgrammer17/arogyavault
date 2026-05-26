import { Link } from 'react-router-dom';

export default function Footer() {
  const currentDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>ArogyaVault</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              National Health Emergency Platform. Ensuring secure, instant access to critical medical information during emergencies.
            </p>
          </div>
          <div className="footer-col">
            <h3>Emergency Support</h3>
            <div className="footer-links" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              <a href="tel:112">National Emergency: 112</a>
              <a href="tel:108">Ambulance: 108</a>
            </div>
            <p style={{ marginTop: '16px', fontSize: '0.85rem' }}>ArogyaVault has been integrated with SadakSuraksha Grid.</p>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <a href="#about">About ArogyaVault</a>
              <a href="#features">Citizen Services</a>
              <Link to="/register">Create Profile</Link>
            </div>
          </div>
          <div className="footer-col">
            <h3>Legal & Policies</h3>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Accessibility Statement</a>
              <a href="#">Help & Support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>This is a mock application for demonstration purposes.</p>
          <p>Page last updated on: {currentDate}</p>
        </div>
      </div>
    </footer>
  );
}
