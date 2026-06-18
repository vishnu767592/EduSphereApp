import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  Bookmark, 
  Calendar, 
  BarChart3, 
  Trophy,
  ArrowRight,
  Flame,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    streak: 0,
    totalCompleted: 0,
    totalQuizzes: 0,
    avgScore: 0,
    level: 'Starter 👋'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/progress/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

  // Cards layout for dashboard pathways
  const features = [
    {
      title: 'Learning Portal',
      description: 'Explore 20 subjects and start dynamic lessons with difficulty filters.',
      icon: <BookOpen size={24} />,
      color: 'var(--primary)',
      path: '/learning'
    },
    {
      title: 'AI Tutor Chat',
      description: 'Interact with EduSphere AI Tutor to clear concepts and ask doubts.',
      icon: <MessageSquare size={24} />,
      color: 'var(--secondary)',
      path: '/ai-tutor'
    },
    {
      title: 'Hologram Viewer',
      description: 'Project interactive 3D looping hologram animations.',
      icon: <Sparkles size={24} />,
      color: 'var(--accent)',
      path: '/hologram'
    },
    {
      title: 'AI Study Planner',
      description: 'Generate customized week-by-week study timetables.',
      icon: <Calendar size={24} />,
      color: '#00F5D4',
      path: '/planner'
    },
    {
      title: 'Progress Analytics',
      description: 'Review weekly logs, score summaries, and unlock certificates.',
      icon: <BarChart3 size={24} />,
      color: '#FF5722',
      path: '/progress'
    },
    {
      title: 'Bookmarks & Saved',
      description: 'Access bookmarked lessons and review saved information.',
      icon: <Bookmark size={24} />,
      color: '#FFD166',
      path: '/bookmarks'
    },
    {
      title: 'Leaderboard',
      description: 'Compare scores and streaks with other students worldwide.',
      icon: <Trophy size={24} />,
      color: '#10B981',
      path: '/leaderboard'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-slide-up">
      {/* Welcome & Overview Header */}
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          Hello, {user?.name}!
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back to EduSphere. Here is an overview of your active learning statistics.
        </p>
      </div>

      {/* Stats Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {/* Streak */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(255, 87, 34, 0.12)',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF5722'
          }}>
            <Flame size={24} fill="#FF5722" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>STREAK</span>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>{stats.streak} Days</span>
          </div>
        </div>

        {/* Completed Topics */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(76, 175, 80, 0.12)',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4CAF50'
          }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>TOPICS MASTERED</span>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>{stats.totalCompleted} Topics</span>
          </div>
        </div>

        {/* Avg Quiz Score */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(124, 106, 247, 0.12)',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>QUIZ AVERAGE</span>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>{stats.avgScore}%</span>
          </div>
        </div>

        {/* Current Level */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(0, 245, 212, 0.12)',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)'
          }}>
            <Trophy size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>LEARNER LEVEL</span>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>{stats.level}</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Entry Banner */}
      {user?.role === 'admin' && (
        <div className="glass-panel" style={{
          border: '1px solid rgba(0, 245, 212, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(20,16,38,0.7) 0%, rgba(0, 245, 212, 0.05) 100%)'
        }}>
          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '4px', color: 'var(--secondary)' }}>Admin Panel Access</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>You have access to moderation tools, usage reports, and registration listings.</p>
          </div>
          <button 
            onClick={() => navigate('/admin')} 
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)' }}
          >
            Go to Admin Panel
          </button>
        </div>
      )}

      {/* Pathways Hub */}
      <div>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Explore Learning Tools</h3>
        <div className="dashboard-grid">
          {features.map(feat => (
            <div 
              key={feat.title} 
              className="glass-panel glass-panel-interactive"
              onClick={() => navigate(feat.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '220px'
              }}
            >
              <div>
                <div style={{
                  color: feat.color,
                  marginBottom: '16px'
                }}>
                  {feat.icon}
                </div>
                <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>{feat.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.4 }}>
                  {feat.description}
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '13px', 
                color: 'var(--primary)',
                fontWeight: 600,
                alignSelf: 'flex-end'
              }}>
                <span>Launch</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
