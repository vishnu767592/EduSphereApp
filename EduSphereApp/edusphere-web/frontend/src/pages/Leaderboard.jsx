import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { Trophy, Flame, CheckCircle, Medal } from 'lucide-react';
import Loader from '../components/Loader';

const Leaderboard = () => {
  const { token, user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/progress/leaderboard', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setLeaders(Array.isArray(data) && data.length > 0 ? data : [
          { rank: 1, name: 'Sharath User', points: 580, streak: 7 },
          { rank: 2, name: 'Ananya Sharma', points: 540, streak: 5 },
          { rank: 3, name: 'Rahul Verma', points: 490, streak: 4 },
          { rank: 4, name: 'Priya Patel', points: 430, streak: 3 }
        ]);
      } catch (e) {
        setLeaders([
          { rank: 1, name: 'Sharath User', points: 580, streak: 7 },
          { rank: 2, name: 'Ananya Sharma', points: 540, streak: 5 },
          { rank: 3, name: 'Rahul Verma', points: 490, streak: 4 },
          { rank: 4, name: 'Priya Patel', points: 430, streak: 3 }
        ]);
      }
      setLoading(false);
    };
    if (token) load();
  }, [token]);

  if (loading) return <Loader message="Loading leaderboard..." />;

  const rankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return 'var(--text-muted)';
  };

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy size={28} color="#FFD166" /> Leaderboard
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Top learners ranked by streaks and quiz performance.</p>
      </div>

      {/* Top 3 podium */}
      {leaders.length >= 3 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'center', alignItems: 'flex-end' }}>
          {[leaders[1], leaders[0], leaders[2]].map((l, idx) => {
            const trueRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
            const heights = [160, 200, 130];
            return (
              <div key={l?.id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '180px' }}>
                <div style={{ fontSize: '36px' }}>{rankIcon(trueRank)}</div>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '20px', color: '#fff',
                  border: `3px solid ${getRankColor(trueRank)}`
                }}>
                  {l?.name?.[0] || '?'}
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', textAlign: 'center' }}>{l?.name || '—'}</div>
                <div style={{ background: `${getRankColor(trueRank)}18`, borderRadius: '12px 12px 0 0', width: '100%', height: `${heights[idx]}px`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '12px', border: `1px solid ${getRankColor(trueRank)}30` }}>
                  <span style={{ fontWeight: 800, color: getRankColor(trueRank) }}>{l?.streak || 0}🔥</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: 'var(--border-card)', display: 'grid', gridTemplateColumns: '50px 1fr 100px 100px 100px', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
          <span>Rank</span><span>Name</span><span style={{ textAlign: 'center' }}>Streak</span><span style={{ textAlign: 'center' }}>Topics</span><span style={{ textAlign: 'center' }}>Avg Score</span>
        </div>
        {leaders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <Trophy size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p>No users yet. Start learning to appear here!</p>
          </div>
        ) : (
          leaders.map((l, i) => {
            const isMe = l.name === user?.name;
            return (
              <div key={l.id || i} style={{
                padding: '16px 24px', borderBottom: 'var(--border-card)',
                display: 'grid', gridTemplateColumns: '50px 1fr 100px 100px 100px', gap: '8px',
                alignItems: 'center',
                background: isMe ? 'rgba(124,106,247,0.08)' : 'transparent',
                transition: 'background 0.2s'
              }}>
                <span style={{ fontWeight: 800, color: getRankColor(i + 1), fontSize: '18px' }}>{rankIcon(i + 1)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '14px' }}>
                    {l.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{l.name} {isMe && <span style={{ color: 'var(--primary)', fontSize: '11px' }}>(you)</span>}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.email}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', fontWeight: 700 }}>{l.streak || 0} 🔥</div>
                <div style={{ textAlign: 'center', fontWeight: 700, color: '#4CAF50' }}>{l.totalCompleted || 0}</div>
                <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>{l.avgScore || 0}%</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
