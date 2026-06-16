import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Edit3, Save, Lock } from 'lucide-react';

const Profile = () => {
  const { user, token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [changingPw, setChangingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  const saveProfile = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Profile updated successfully!' });
        setEditing(false);
      } else {
        const d = await res.json();
        setMsg({ type: 'error', text: d.message || 'Update failed.' });
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Network error.' });
    }
    setSaving(false);
  };

  const changePassword = async () => {
    setChangingPw(true);
    setPwMsg(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }),
      });
      if (res.ok) {
        setPwMsg({ type: 'success', text: 'Password changed successfully!' });
        setOldPw(''); setNewPw('');
      } else {
        const d = await res.json();
        setPwMsg({ type: 'error', text: d.message || 'Failed to change password.' });
      }
    } catch (e) {
      setPwMsg({ type: 'error', text: 'Network error.' });
    }
    setChangingPw(false);
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>My Profile</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your account information.</p>
      </div>

      {/* Avatar + Name */}
      <div className="glass-panel" style={{ marginBottom: '20px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800 }}>{user?.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user?.role === 'admin' ? '🛡 Admin' : '📚 Learner'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
              <User size={14} /> Display Name
            </label>
            {editing ? (
              <input className="input-field" value={name} onChange={e => setName(e.target.value)} />
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', border: 'var(--border-card)' }}>
                {user?.name}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
              <Mail size={14} /> Email Address
            </label>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', border: 'var(--border-card)', color: 'var(--text-muted)' }}>
              {user?.email}
            </div>
          </div>

          {msg && <p className={msg.type === 'success' ? 'success-msg' : 'error-msg'}>{msg.text}</p>}

          <div style={{ display: 'flex', gap: '12px' }}>
            {editing ? (
              <>
                <button onClick={saveProfile} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditing(false); setName(user?.name || ''); setMsg(null); }} className="btn-secondary">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h4 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} /> Change Password
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Current Password</label>
            <input className="input-field" type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="••••••••" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>New Password</label>
            <input className="input-field" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Minimum 6 characters" />
          </div>
          {pwMsg && <p className={pwMsg.type === 'success' ? 'success-msg' : 'error-msg'}>{pwMsg.text}</p>}
          <button onClick={changePassword} disabled={!oldPw || !newPw || changingPw} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
            <Lock size={16} /> {changingPw ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
