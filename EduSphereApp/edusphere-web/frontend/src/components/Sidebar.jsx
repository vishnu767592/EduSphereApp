import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, MessageSquare, StickyNote,
  BarChart3, Bookmark, Trophy, Calendar, User, Settings,
  ShieldCheck, LogOut, X
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Learning Portal', icon: BookOpen, path: '/learning' },
  { label: 'AI Tutor', icon: MessageSquare, path: '/ai-tutor' },
  { label: 'My Notes', icon: StickyNote, path: '/notes' },
  { label: 'Progress', icon: BarChart3, path: '/progress' },
  { label: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
  { label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  { label: 'Study Planner', icon: Calendar, path: '/planner' },
];

const bottomItems = [
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeLinkStyle = {
    background: 'linear-gradient(90deg, rgba(124,106,247,0.18) 0%, rgba(124,106,247,0.04) 100%)',
    borderLeft: '3px solid var(--primary)',
    color: 'var(--primary)',
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'none'
          }}
          className="sidebar-overlay"
        />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100vh',
        width: '260px', background: 'var(--bg-sidebar)',
        borderRight: 'var(--border-card)', display: 'flex',
        flexDirection: 'column', zIndex: 100,
        transition: 'transform 0.3s ease',
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: 'var(--border-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🎓</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-title)', letterSpacing: '-0.03em' }}>
                EduSphere
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI Learning Platform</div>
            </div>
          </div>
        </div>

        {/* User mini card */}
        <div style={{ padding: '16px 20px', borderBottom: 'var(--border-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--primary-gradient)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '14px', color: '#fff'
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.role === 'admin' ? '🛡 Admin' : '📚 Learner'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 20px', margin: '2px 8px', borderRadius: '10px',
                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                color: 'var(--text-muted)',
                transition: 'all 0.2s ease',
                ...(isActive ? activeLinkStyle : {}),
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {/* Admin link */}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 20px', margin: '2px 8px', borderRadius: '10px',
                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                color: isActive ? 'var(--secondary)' : 'var(--text-muted)',
                borderLeft: isActive ? '3px solid var(--secondary)' : '3px solid transparent',
              })}
            >
              <ShieldCheck size={18} />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Bottom nav */}
        <div style={{ borderTop: 'var(--border-card)', padding: '8px 0 16px' }}>
          {bottomItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 20px', margin: '2px 8px', borderRadius: '10px',
                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 20px', margin: '2px 8px', borderRadius: '10px',
              width: 'calc(100% - 16px)', border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: '14px', fontWeight: 500,
              color: '#FF5A5A', transition: 'background 0.2s'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
