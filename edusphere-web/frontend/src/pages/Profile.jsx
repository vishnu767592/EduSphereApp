import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

const Profile = () => {
  const { user, token } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Required field validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }

    // 2. Boundary value testing: Password length limit
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword.length > 30) {
      setError('New password cannot exceed 30 characters');
      return;
    }

    // 3. Confirm password validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-slide-up" id="profile-page-container">
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>User Profile</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal details and account security settings.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px'
      }}>
        {/* User Details Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            Account Information
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '28px',
              fontWeight: 700,
              boxShadow: 'var(--shadow-glow)'
            }} id="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 style={{ fontSize: '22px', fontWeight: 600 }} id="profile-name">{user?.name}</h4>
              <span style={{
                display: 'inline-block',
                marginTop: '4px',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                background: 'rgba(124, 106, 247, 0.15)',
                color: 'var(--primary)',
                textTransform: 'capitalize'
              }} id="profile-role">
                {user?.role} Learner
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>FULL NAME</span>
                <span style={{ fontSize: '14px' }} id="profile-detail-name">{user?.name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>EMAIL ADDRESS</span>
                <span style={{ fontSize: '14px' }} id="profile-detail-email">{user?.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>ACCOUNT ROLE</span>
                <span style={{ fontSize: '14px' }}>{user?.role === 'admin' ? 'Administrator' : 'Standard Student'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '20px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '20px' }}>
            Change Password
          </h3>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid rgba(255, 77, 77, 0.2)',
              padding: '12px 16px',
              borderRadius: '8px',
              color: '#FF4D4D',
              fontSize: '14px',
              marginBottom: '20px'
            }} id="password-error">
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '12px 16px',
              borderRadius: '8px',
              color: '#10B981',
              fontSize: '14px',
              marginBottom: '20px'
            }} id="password-success">
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} id="change-password-form">
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                CURRENT PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  id="current-password-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                NEW PASSWORD (min 6 chars)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  id="new-password-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                CONFIRM NEW PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  id="confirm-password-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              id="update-password-btn"
              className="btn-primary"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '10px',
                height: '44px'
              }}
            >
              {loading ? 'Updating Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
