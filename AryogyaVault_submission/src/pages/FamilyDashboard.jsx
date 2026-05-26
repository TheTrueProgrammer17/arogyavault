import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import FamilyRequestModal from '../components/FamilyRequestModal';

export default function FamilyDashboard() {
  const { currentUser } = useAuth();
  
  // State for different sections
  const [linkedMembers, setLinkedMembers] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState('');

  function flash(m) { setMsg(m); setTimeout(() => setMsg(''), 3000); }

  useEffect(() => {
    if (!currentUser) return;

    // 1. Listen to Linked Members (stored in families subcollection)
    const unsubLinked = onSnapshot(collection(db, 'families', currentUser.uid, 'members'), (snap) => {
      const members = [];
      snap.forEach(d => members.push({ id: d.id, ...d.data() }));
      setLinkedMembers(members);
    });

    // 2. Listen to Received Requests
    const qReceived = query(collection(db, 'familyRequests'), 
      where('toUid', '==', currentUser.uid),
      where('status', '==', 'pending')
    );
    const unsubReceived = onSnapshot(qReceived, (snap) => {
      const reqs = [];
      snap.forEach(d => reqs.push({ id: d.id, ...d.data() }));
      setPendingReceived(reqs);
    });

    // 3. Listen to Sent Requests
    const qSent = query(collection(db, 'familyRequests'), 
      where('fromUid', '==', currentUser.uid),
      where('status', '==', 'pending')
    );
    const unsubSent = onSnapshot(qSent, (snap) => {
      const reqs = [];
      snap.forEach(d => reqs.push({ id: d.id, ...d.data() }));
      setPendingSent(reqs);
    });

    return () => {
      unsubLinked();
      unsubReceived();
      unsubSent();
    };
  }, [currentUser]);

  // Actions
  async function handleAcceptRequest(req) {
    try {
      // 1. Add to current user's linked members
      await setDoc(doc(db, 'families', currentUser.uid, 'members', req.fromUid), {
        linkedUid: req.fromUid,
        name: req.fromName,
        relation: req.relation + " (Reverse)", // Simplification
        status: 'linked',
        addedAt: new Date().toISOString()
      });

      // 2. Add to sender's linked members
      await setDoc(doc(db, 'families', req.fromUid, 'members', currentUser.uid), {
        linkedUid: currentUser.uid,
        name: req.toName,
        relation: req.relation,
        status: 'linked',
        addedAt: new Date().toISOString()
      });

      // 3. Delete the request
      await deleteDoc(doc(db, 'familyRequests', req.id));
      flash(`Accepted family request from ${req.fromName}!`);
    } catch (err) {
      console.error(err);
      flash('Error accepting request.');
    }
  }

  async function handleRejectRequest(reqId) {
    if (!confirm('Reject this request?')) return;
    try {
      await deleteDoc(doc(db, 'familyRequests', reqId));
      flash('Request rejected.');
    } catch (err) {
      flash('Error rejecting request.');
    }
  }

  async function handleCancelRequest(reqId) {
    try {
      await deleteDoc(doc(db, 'familyRequests', reqId));
      flash('Request cancelled.');
    } catch (err) {
      flash('Error cancelling request.');
    }
  }

  async function handleRemoveMember(member) {
    if (!confirm(`Remove ${member.name} from your family linked accounts?`)) return;
    try {
      // Delete from own subcollection
      await deleteDoc(doc(db, 'families', currentUser.uid, 'members', member.id));
      // Try to delete reciprocal link (this would ideally be done via backend function for security, but doing it here for the mockup)
      if (member.linkedUid) {
        await deleteDoc(doc(db, 'families', member.linkedUid, 'members', currentUser.uid));
      }
      flash(`Removed ${member.name} from linked accounts.`);
    } catch (err) {
      flash('Error removing member.');
    }
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>Family Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage linked family accounts and emergency access</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Family Member
        </button>
      </div>

      {msg && <div className="alert alert-success">✓ {msg}</div>}

      <div className="grid-2" style={{ gap: '24px' }}>
        {/* LEFT COLUMN: Linked Accounts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-header" style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Linked Accounts ({linkedMembers.length})</h2>
            </div>
            
            {linkedMembers.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 16px' }}>
                <div className="icon">👨‍👩‍👧‍👦</div>
                <p>No family accounts linked.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {linkedMembers.map((m) => (
                  <div key={m.id} className="contact-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          <span className="tag" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>{m.relation}</span>
                          <span style={{ marginLeft: '8px', color: 'var(--success)', fontWeight: 600 }}>✓ Emergency Access Granted</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleRemoveMember(m)}>Remove</button>
                      <a href={`/emergency/${m.linkedUid}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ marginLeft: '8px' }}>View Profile</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Requests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Pending Received */}
          <div className="card" style={{ borderTop: '4px solid var(--warning)' }}>
            <div className="card-header" style={{ marginBottom: '16px', borderBottom: 'none' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--warning)' }}>Received Requests ({pendingReceived.length})</h2>
            </div>
            
            {pendingReceived.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '16px' }}>No pending requests.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pendingReceived.map(req => (
                  <div key={req.id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.fromName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Wants to add you as their {req.relation}.</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAcceptRequest(req)}>Accept</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleRejectRequest(req.id)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Sent */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '16px', borderBottom: 'none' }}>
              <h2 style={{ fontSize: '1.2rem' }}>Sent Requests ({pendingSent.length})</h2>
            </div>
            
            {pendingSent.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '16px' }}>No sent requests.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pendingSent.map(req => (
                  <div key={req.id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{req.toName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status: <span style={{ color: 'var(--warning)', fontWeight: 600 }}>Pending</span></div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleCancelRequest(req.id)}>Cancel</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <FamilyRequestModal 
          onClose={(success) => {
            setShowModal(false);
            if (success) flash('Relationship request sent successfully!');
          }} 
        />
      )}
    </div>
  );
}
