import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, CheckCircle, Trophy, BarChart3, Calendar, Award } from 'lucide-react';
import Loader from '../components/Loader';

const Progress = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const [summRes, weekRes, certRes] = await Promise.all([
          fetch('/api/progress/summary', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/progress/weekly', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/progress/certificates', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const summary = summRes.ok ? await summRes.json() : {};
        const weekly = weekRes.ok ? await weekRes.json() : [];
        const certs = certRes.ok ? await certRes.json() : [];
        setData({ summary, weekly, certs });
      } catch (e) {
        setData({ summary: {}, weekly: [], certs: [] });
      }
      setLoading(false);
    };
    if (token) fetch_();
  }, [token]);

  if (loading) return <Loader message="Loading progress data..." />;

  const { summary = {}, weekly = [], certs = [] } = data;

  const statCards = [
    { label: 'Day Streak', value: `${summary.streak || 0} 🔥`, icon: Flame, color: '#FF5722' },
    { label: 'Topics Mastered', value: summary.totalCompleted || 0, icon: CheckCircle, color: '#4CAF50' },
    { label: 'Quizzes Taken', value: summary.totalQuizzes || 0, icon: BarChart3, color: 'var(--primary)' },
    { label: 'Quiz Average', value: `${summary.avgScore || 0}%`, icon: Trophy, color: '#FFD166' },
    { label: 'Current Level', value: summary.level || 'Starter', icon: Award, color: 'var(--secondary)' },
  ];

  const maxDays = weekly.length > 0 ? Math.max(...weekly.map(d => d.topicsCompleted || 0), 1) : 1;

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Progress Analytics</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track your learning journey and achievements.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
              <Icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="glass-panel" style={{ marginBottom: '24px', padding: '28px' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--primary)" /> Weekly Activity
        </h3>
        {weekly.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No weekly data yet. Start learning!</p>
        ) : (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '180px' }}>
            {weekly.map((day, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>{day.topicsCompleted || 0}</div>
                <div style={{
                  width: '100%', borderRadius: '8px 8px 0 0',
                  background: 'var(--primary-gradient)',
                  height: `${Math.max(((day.topicsCompleted || 0) / maxDays) * 140, 4)}px`,
                  transition: 'height 0.5s ease',
                  opacity: day.topicsCompleted > 0 ? 1 : 0.2
                }} />
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{day.dayLabel || day.date || `Day ${i + 1}`}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="#FFD166" /> Certificates
        </h3>
        {certs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
            <p>Complete subjects to earn certificates!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {certs.map(cert => (
              <div key={cert.id} style={{
                padding: '20px', borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(255,209,65,0.08) 0%, rgba(255,152,0,0.08) 100%)',
                border: '1px solid rgba(255,209,65,0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{cert.subjectName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Issued {new Date(cert.issuedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
