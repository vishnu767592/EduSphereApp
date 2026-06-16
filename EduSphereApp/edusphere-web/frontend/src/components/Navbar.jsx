import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Bell, User, Menu } from 'lucide-react';

const breadcrumbMap = {
  '/dashboard': 'Dashboard',
  '/learning': 'Learning Portal',
  '/ai-tutor': 'AI Tutor',
  '/notes': 'My Notes',
  '/progress': 'Progress Analytics',
  '/bookmarks': 'Bookmarks',
  '/leaderboard': 'Leaderboard',
  '/planner': 'Study Planner',
  '/profile': 'My Profile',
  '/settings': 'Settings',
  '/admin': 'Admin Panel',
};

const Navbar = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const segments = location.pathname.split('/').filter(Boolean);
  const currentPage = breadcrumbMap[location.pathname] ||
    (segments.length > 0 ? segments[segments.length - 1].replace(/-/g, ' ') : 'EduSphere');

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10, 8, 19, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: 'var(--border-card)',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onMenuToggle}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'none' }}
          className="menu-btn"
        >
          <Menu size={22} />
        </button>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>EduSphere / </span>
          <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>{currentPage}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'var(--border-card)', borderRadius: '10px',
            padding: '8px', cursor: 'pointer', color: 'var(--text-main)',
            display: 'flex', alignItems: 'center',
            transition: 'background 0.2s',
          }}
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications placeholder */}
        <button
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'var(--border-card)', borderRadius: '10px',
            padding: '8px', cursor: 'pointer', color: 'var(--text-main)',
            display: 'flex', alignItems: 'center', position: 'relative',
          }}
          title="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--accent)'
          }} />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          style={{
            background: 'var(--primary-gradient)',
            border: 'none', borderRadius: '10px',
            padding: '6px 14px', cursor: 'pointer',
            color: '#fff', fontWeight: 600, fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <User size={16} />
          {user?.name?.split(' ')[0]}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
