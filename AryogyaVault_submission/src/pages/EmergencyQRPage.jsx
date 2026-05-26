import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function EmergencyQRPage() {
  const { currentUser } = useAuth();
  const [msg, setMsg] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [currentUser]);

  const qrUrl = currentUser ? `${window.location.origin}/emergency/${currentUser.uid}` : '';

  function flash(m) { setMsg(m); setTimeout(() => setMsg(''), 3000); }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>Emergency QR</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Your emergency access code for first responders</p>
      </div>

      {msg && <div className="alert alert-success">✓ {msg}</div>}

      <div className="grid-2">
        <div className="card fade-in">
          <div className="card-header" style={{ textAlign: 'center' }}>
            <h2>Printable Health Card</h2>
            <p>Keep this card in your wallet or as your phone lock-screen.</p>
          </div>
          
          <div style={{ background: '#fff', border: '2px solid var(--primary)', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ background: 'var(--primary)', color: 'white', margin: '-24px -24px 24px -24px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>🇮🇳</span>
                <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>AROGYAVAULT</span>
              </div>
              <span className="tag" style={{ background: 'var(--danger)', color: 'white', border: 'none' }}>EMERGENCY</span>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ background: 'white', padding: '8px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <QRCodeSVG value={qrUrl} size={140} level="H" includeMargin={true} fgColor="#0b1f5f" bgColor="#FFFFFF" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase' }}>{userData?.name || currentUser?.displayName || 'Citizen'}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Blood Group</div>
                    <div style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '1.2rem' }}>{userData?.medicalInfo?.bloodGroup || userData?.bloodGroup || 'Not set'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>DOB / Gender</div>
                    <div style={{ fontWeight: 'bold' }}>Not Set</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Critical Allergies</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--danger)' }}>
                    {(userData?.medicalInfo?.allergies || userData?.allergies || []).join(', ') || 'None reported'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Scan QR code for complete medical history and emergency contacts. Issued by National Health Authority.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn btn-primary" onClick={handlePrint}>
              🖨️ Print Wallet Card
            </button>
            <button className="btn btn-secondary" onClick={() => { navigator.clipboard.writeText(qrUrl); flash('Link copied to clipboard!'); }}>
              📋 Copy Link
            </button>
            <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              🔗 Preview Page
            </a>
          </div>
        </div>

        <div className="card fade-in">
          <div className="card-header">
            <h2>Card Instructions</h2>
          </div>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <li><strong>Print on Cardstock:</strong> For best results, print this card on heavy paper and laminate it.</li>
            <li><strong>Keep Accessible:</strong> Store it in your wallet behind your driver's license or ID card.</li>
            <li><strong>Lock Screen:</strong> Take a screenshot of the QR code and set it as your phone's lock screen wallpaper.</li>
            <li><strong>Vehicle Dashboard:</strong> Keep a copy in your vehicle's glove compartment or pasted on the dashboard.</li>
          </ul>
          <div className="notice-banner" style={{ marginTop: '24px', textAlign: 'left', borderRadius: '4px' }}>
            <strong>Note:</strong> Anyone who scans this QR code will have read-only access to your critical medical information and emergency contacts.
          </div>
        </div>
      </div>
    </div>
  );
}
