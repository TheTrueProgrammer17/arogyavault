import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, getDoc, setDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

// Document type icons
const typeIcons = {
  'Prescription': '💊',
  'Lab Report': '🔬',
  'Scan Report': '🩻',
  'Discharge Summary': '🏥',
  'Medical Certificate': '📋',
  'Insurance Document': '🛡️',
  'Other': '📄',
};

export default function DoctorDashboard() {
  const { currentUser, userData } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('hub');

  // Verification Hub State
  const [verificationKey, setVerificationKey] = useState(location.state?.verificationKey || '');
  const [keyError, setKeyError] = useState('');
  const [keyLoading, setKeyLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  
  // Specific document state
  const [currentKeyData, setCurrentKeyData] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [targetDocument, setTargetDocument] = useState(null);
  const [documentIndex, setDocumentIndex] = useState(null);
  
  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [optionalNote, setOptionalNote] = useState('');

  // History state
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (location.state?.verificationKey && !accessGranted) {
      validateKey(location.state.verificationKey);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const q = query(
        collection(db, 'verificationKeys'),
        where('verifiedByDoctorId', '==', currentUser.uid),
        orderBy('actionTimestamp', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      const history = [];
      snap.forEach(doc => {
        history.push({ id: doc.id, ...doc.data() });
      });
      setRecentVerifications(history);
    } catch (err) {
      console.error('Error loading history:', err);
    }
    setHistoryLoading(false);
  }

  async function handleKeySubmit(e) {
    if (e) e.preventDefault();
    await validateKey(verificationKey);
  }

  async function validateKey(keyToValidate) {
    if (!keyToValidate) return;
    setKeyError('');
    setKeyLoading(true);
    setVerifySuccess(false);

    try {
      const q = query(
        collection(db, 'verificationKeys'),
        where('key', '==', keyToValidate.trim().toUpperCase())
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setKeyError('Invalid verification key. Please check and try again.');
        setKeyLoading(false);
        return;
      }

      const keyDoc = snap.docs[0];
      const keyData = { id: keyDoc.id, ...keyDoc.data() };

      if (keyData.status === 'used') {
        setKeyError('This verification key has already been used.');
        setKeyLoading(false);
        return;
      }
      if (keyData.status === 'rejected') {
        setKeyError('This verification key has been marked as rejected.');
        setKeyLoading(false);
        return;
      }

      // Check expiry
      if (new Date(keyData.expiresAt) <= new Date()) {
        await setDoc(doc(db, 'verificationKeys', keyDoc.id), { status: 'expired' }, { merge: true });
        setKeyError('This verification key has expired.');
        setKeyLoading(false);
        return;
      }

      // Load patient & specific document
      const patientSnap = await getDoc(doc(db, 'users', keyData.patientId));
      if (!patientSnap.exists()) {
        setKeyError('Patient record not found.');
        setKeyLoading(false);
        return;
      }

      const pData = patientSnap.data();
      const docIdx = keyData.documentIndex;
      
      if (pData.documents && pData.documents[docIdx]) {
        setPatientId(keyData.patientId);
        setPatientName(pData.name || 'Patient');
        setDocumentIndex(docIdx);
        setTargetDocument(pData.documents[docIdx]);
        setCurrentKeyData(keyData);
        setAccessGranted(true);
      } else {
        setKeyError('The linked document could not be found in the patient record.');
      }
    } catch (err) {
      setKeyError('System error validating key: ' + err.message);
    }
    setKeyLoading(false);
  }

  async function handleAction(action) {
    if (!patientId || documentIndex === null || !currentKeyData) return;
    setActionLoading(true);

    try {
      // 1. Update Patient Document
      const patientRef = doc(db, 'users', patientId);
      const patientSnap = await getDoc(patientRef);
      const pData = patientSnap.data();
      const updatedDocs = [...pData.documents];
      
      const docToUpdate = updatedDocs[documentIndex];
      
      if (action === 'verify') {
        docToUpdate.verificationStatus = 'verified';
        docToUpdate.verifiedByDoctor = userData?.name || currentUser.displayName || 'Doctor';
        docToUpdate.verifiedByHospital = userData?.hospitalName || 'Unknown Hospital';
        docToUpdate.verificationTimestamp = new Date().toISOString();
      } else if (action === 'reject') {
        docToUpdate.verificationStatus = 'rejected';
        docToUpdate.rejectionNote = optionalNote;
      }
      
      updatedDocs[documentIndex] = docToUpdate;
      await setDoc(patientRef, { documents: updatedDocs }, { merge: true });

      // 2. Update Key Status
      const keyRef = doc(db, 'verificationKeys', currentKeyData.id);
      await setDoc(keyRef, { 
        status: action === 'verify' ? 'used' : 'rejected',
        actionTimestamp: new Date().toISOString(),
        verifiedByDoctorId: currentUser.uid,
        verifiedByDoctorName: userData?.name || currentUser.displayName || 'Doctor',
        doctorNote: optionalNote
      }, { merge: true });

      if (action === 'verify') {
        setVerifySuccess(true);
      } else {
        handleDisconnect();
        setActiveTab('history');
      }
    } catch (err) {
      alert('Error updating document: ' + err.message);
    }
    setActionLoading(false);
  }

  function handleDisconnect() {
    setAccessGranted(false);
    setPatientId(null);
    setPatientName('');
    setTargetDocument(null);
    setDocumentIndex(null);
    setCurrentKeyData(null);
    setVerificationKey('');
    setKeyError('');
    setVerifySuccess(false);
    setOptionalNote('');
  }

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <button 
          onClick={() => setActiveTab('hub')}
          style={{ 
            background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 600, 
            color: activeTab === 'hub' ? '#16a34a' : '#64748b', cursor: 'pointer',
            borderBottom: activeTab === 'hub' ? '3px solid #16a34a' : 'none', paddingBottom: '4px'
          }}
        >
          🔑 Verification Hub
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          style={{ 
            background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 600, 
            color: activeTab === 'history' ? '#16a34a' : '#64748b', cursor: 'pointer',
            borderBottom: activeTab === 'history' ? '3px solid #16a34a' : 'none', paddingBottom: '4px'
          }}
        >
          📋 Recent Activity
        </button>
      </div>

      {activeTab === 'hub' && (
        <>
          {!accessGranted ? (
            /* Key Entry Card */
            <div className="doctor-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔐</div>
                <h2 style={{ color: '#166534', fontSize: '1.5rem', marginBottom: '8px' }}>Document Verification</h2>
                <p style={{ color: '#475569' }}>Enter the temporary access key provided by the patient.</p>
              </div>

              {keyError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: 500 }}>
                  ⚠️ {keyError}
                </div>
              )}

              <form onSubmit={handleKeySubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b' }}>Access Key</label>
                  <input
                    type="text"
                    value={verificationKey}
                    onChange={(e) => setVerificationKey(e.target.value)}
                    placeholder="AV-XXXX-XXXX"
                    style={{ 
                      width: '100%', padding: '16px', borderRadius: '8px', border: '2px solid #cbd5e1', 
                      fontSize: '1.2rem', fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase',
                      textAlign: 'center', outline: 'none'
                    }}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={keyLoading}
                  style={{ 
                    width: '100%', padding: '14px', borderRadius: '8px', border: 'none', 
                    background: '#16a34a', color: 'white', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
                    opacity: keyLoading ? 0.7 : 1
                  }}
                >
                  {keyLoading ? 'Verifying Key...' : 'Retrieve Document'}
                </button>
              </form>
            </div>
          ) : (
            /* Single Document Verification Panel */
            <div className={`doctor-card ${verifySuccess ? 'verify-success-anim' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h2 style={{ color: '#166534', fontSize: '1.4rem' }}>Patient Document</h2>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Linked to key: {currentKeyData.key}</div>
                </div>
                {!verifySuccess && (
                  <button onClick={handleDisconnect} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
                    Close
                  </button>
                )}
              </div>

              {verifySuccess ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '4rem', color: '#22c55e', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ fontSize: '1.5rem', color: '#166534', marginBottom: '8px' }}>Document Verified Successfully</h3>
                  <p style={{ color: '#475569', marginBottom: '24px' }}>The patient's record has been updated with your verification seal.</p>
                  <button 
                    onClick={handleDisconnect}
                    style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Verify Another Document
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                  {/* Document Details */}
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                        {typeIcons[targetDocument.documentType] || '📄'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{targetDocument.documentTitle}</div>
                        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', background: '#e2e8f0', color: '#475569', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
                          {targetDocument.documentType}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Patient Name</div>
                            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem' }}>{patientName}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Treatment Date</div>
                            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem' }}>{targetDocument.treatmentDate ? new Date(targetDocument.treatmentDate).toLocaleDateString() : 'N/A'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Claimed Hospital</div>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{targetDocument.hospitalName || 'N/A'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Claimed Doctor</div>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{targetDocument.doctorName || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Area */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b' }}>Optional Note</label>
                    <textarea 
                      value={optionalNote}
                      onChange={(e) => setOptionalNote(e.target.value)}
                      placeholder="Add a clinical note or reason for rejection..."
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '80px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                    
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button 
                        onClick={() => handleAction('verify')}
                        disabled={actionLoading}
                        style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        ✓ Verify Document
                      </button>
                      <button 
                        onClick={() => handleAction('reject')}
                        disabled={actionLoading}
                        style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '2px solid #ef4444', background: 'white', color: '#ef4444', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        ✕ Reject Document
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'history' && (
        <div className="doctor-card">
          <h2 style={{ color: '#166534', fontSize: '1.4rem', marginBottom: '20px' }}>Recent Verification Activity</h2>
          
          {historyLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading history...</div>
          ) : recentVerifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
              <div style={{ color: '#64748b', fontWeight: 500 }}>No verification history found.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentVerifications.map((item, idx) => (
                <div key={idx} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem' }}>{item.documentTitle}</div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                      <span>Type: {item.documentType}</span>
                      <span>Key: {item.key}</span>
                      <span>{new Date(item.actionTimestamp).toLocaleString()}</span>
                    </div>
                    {item.doctorNote && (
                      <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#475569', background: '#f1f5f9', padding: '8px', borderRadius: '4px' }}>
                        Note: {item.doctorNote}
                      </div>
                    )}
                  </div>
                  <div>
                    {item.status === 'used' ? (
                      <span style={{ padding: '6px 12px', borderRadius: '999px', background: '#dcfce7', color: '#166534', fontWeight: 600, fontSize: '0.85rem' }}>
                        ✓ Verified
                      </span>
                    ) : item.status === 'rejected' ? (
                      <span style={{ padding: '6px 12px', borderRadius: '999px', background: '#fee2e2', color: '#991b1b', fontWeight: 600, fontSize: '0.85rem' }}>
                        ✕ Rejected
                      </span>
                    ) : (
                      <span style={{ padding: '6px 12px', borderRadius: '999px', background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.85rem' }}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
