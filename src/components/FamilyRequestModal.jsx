import { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const RELATIONS = ['Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Child', 'Guardian', 'Other'];

export default function FamilyRequestModal({ onClose }) {
  const { currentUser, userData } = useAuth();
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !relation) return setError('Please fill all fields');
    if (email.toLowerCase() === currentUser.email.toLowerCase()) {
      return setError('You cannot add yourself as a family member.');
    }
    
    setError('');
    setLoading(true);

    try {
      // 1. Find the target user by email
      const q = query(collection(db, 'users'), where('email', '==', email.trim().toLowerCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setLoading(false);
        return setError('No ArogyaVault user found with this email/phone.');
      }

      const targetUser = snap.docs[0];
      const targetUid = targetUser.id;

      // 2. Check if a request already exists
      const existingReqs = await getDocs(query(collection(db, 'familyRequests'), 
        where('fromUid', '==', currentUser.uid),
        where('toUid', '==', targetUid),
        where('status', '==', 'pending')
      ));

      if (!existingReqs.empty) {
        setLoading(false);
        return setError('A pending request already exists for this user.');
      }

      // 3. Create the request
      await addDoc(collection(db, 'familyRequests'), {
        fromUid: currentUser.uid,
        fromName: userData?.name || currentUser.displayName || 'Citizen',
        fromEmail: currentUser.email,
        toUid: targetUid,
        toName: targetUser.data().name || 'Citizen',
        toEmail: email.trim().toLowerCase(),
        relation: relation,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      onClose(true); // true indicates success
    } catch (err) {
      setError('Error sending request: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>➕ Add Family Member</h3>
        <p>Send a secure relationship request to an existing ArogyaVault user.</p>

        {error && <div className="alert alert-error" style={{ padding: '8px', marginTop: '12px', marginBottom: '12px' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">ArogyaVault ID (Registered Email)</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="e.g. user@example.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Relation Type</label>
            <select 
              className="form-input" 
              value={relation}
              onChange={e => setRelation(e.target.value)}
              required
            >
              <option value="" disabled>Select relation...</option>
              {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="modal-actions" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => onClose(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
