import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { Users, BarChart3, Trophy, Trash2, ShieldCheck } from 'lucide-react';
import Loader from '../components/Loader';

const AdminPanel = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          apiFetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          apiFetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats(await statsRes.json());
        setUsers(await usersRes.json());
      } catch (e) { /* silent */ }
      setLoading(false);
    };
    if (token) load();
  }, [token]);

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await apiFetch(`/api/admin/user/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUsers(u => u.filter(user => user.id !== id));
    } catch (e) { /* silent */ }
    setDeleting(null);
  };

  if (loading) return <Loader message="Loading admin dashboard..." />;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'var(--primary)' },
    { label: 'Topic Completions', value: stats?.totalCompletions || 0, icon: BarChart3, color: '#4CAF50' },
    { label: 'Quizzes Taken', value: stats?.totalQuizzes || 0, icon: Trophy, color: '#FFD166' },
    { label: 'Avg Quiz Score', value: `${stats?.avgScore || 0}%`, icon: ShieldCheck, color: 'var(--secondary)' },
  ];

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={28} color="var(--secondary)" /> Admin Panel
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Platform management and analytics.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '20px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
              <Icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: 'var(--border-card)' }}>
          <h4 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} /> Registered Users ({users.length})
          </h4>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: 'var(--border-card)', background: 'rgba(255,255,255,0.02)' }}>
                {['Name', 'Email', 'Role', 'Streak', 'Topics', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No users registered.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} style={{ borderBottom: 'var(--border-card)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '13px', flexShrink: 0 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: u.role === 'admin' ? 'rgba(0,245,212,0.12)' : 'rgba(124,106,247,0.12)',
                      color: u.role === 'admin' ? 'var(--secondary)' : 'var(--primary)',
                      padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 600 }}>{u.streak || 0} 🔥</td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 600, color: '#4CAF50' }}>{u.total_completed || 0}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(u.id, u.name)}
                        disabled={deleting === u.id}
                        style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#F44336', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                      >
                        <Trash2 size={13} />
                        {deleting === u.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
