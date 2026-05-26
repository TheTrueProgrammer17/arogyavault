import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, userData } = useAuth();
  const [stats, setStats] = useState({ documents: 0, family: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If a doctor logs in and tries to access patient dashboard, redirect them
    if (userData && userData.role === 'doctor') {
      navigate('/doctor-dashboard');
      return;
    }

    async function fetchStats() {
      try {
        if (!currentUser) return;
        
        const docsQuery = query(collection(db, 'documents'), where('userId', '==', currentUser.uid));
        const docsSnap = await getDocs(docsQuery);
        
        const familyQuery = query(collection(db, 'familyMembers'), where('userId', '==', currentUser.uid));
        const familySnap = await getDocs(familyQuery);
        
        setStats({
          documents: docsSnap.size,
          family: familySnap.size
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [currentUser, userData, navigate]);

  if (loading) return <div className="loading-page"><div className="spinner"></div><p>Loading Dashboard...</p></div>;

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '2rem' }}>Citizen Dashboard</h1>
        <Link to="/qr" className="btn btn-primary">📱 Emergency QR</Link>
      </div>

      <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--bg-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            👤
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Welcome, {currentUser?.displayName || 'Citizen'}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Aadhaar verified • ABHA Linked</p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px' }}>{stats.documents}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Verified Documents</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '8px' }}>{stats.family}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Linked Family Members</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary)', textTransform: 'uppercase' }}>Quick Actions</h2>
      <div className="grid-2" style={{ gap: '16px' }}>
        <Link to="/profile" className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '2rem' }}>🏥</div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Update Medical Profile</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add allergies, conditions, and vitals</p>
          </div>
        </Link>
        <Link to="/documents" className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '2rem' }}>📄</div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Upload Health Records</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Store prescriptions and lab reports</p>
          </div>
        </Link>
        <Link to="/family" className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '2rem' }}>👨‍👩‍👧‍👦</div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Manage Family</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Link dependents to your account</p>
          </div>
        </Link>
        <Link to="/settings" className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '2rem' }}>⚙️</div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Account Settings</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Privacy, security, and preferences</p>
          </div>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2>Recent Activity Log</h2>
        </div>
        <div className="empty-state">
          No recent activity to display.
        </div>
      </div>
    </div>
  );
}
