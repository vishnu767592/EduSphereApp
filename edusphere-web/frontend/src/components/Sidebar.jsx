import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  Bookmark, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  UserSquare2 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Learning Portal', path: '/learning', icon: <BookOpen size={18} /> },
    { name: 'AI Tutor Chat', path: '/ai-tutor', icon: <MessageSquare size={18} /> },
    { name: 'Hologram Viewer', path: '/hologram', icon: <Sparkles size={18} /> },
    { name: 'Bookmarks', path: '/bookmarks', icon: <Bookmark size={18} /> },
    { name: 'AI Study Planner', path: '/planner', icon: <Calendar size={18} /> },
    { name: 'Progress Dashboard', path: '/progress', icon: <BarChart3 size={18} /> },
    { name: 'User Profile', path: '/profile', icon: <UserSquare2 size={18} /> },
  ];

  // If admin, append admin controls
  if (user && user.role === 'admin') {
    navigationItems.push({
      name: 'Admin Panel',
      path: '/admin',
      icon: <ShieldCheck size={18} style={{ color: '#00F5D4' }} />
    });
  }

  return (
    <aside style={{
      width: '240px',
      background: 'var(--bg-sidebar)',
      borderRight: 'var(--border-card)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      gap: '8px',
      minHeight: 'calc(100vh - 70px)',
      position: 'sticky',
      top: '70px',
      flexShrink: 0
    }} className="app-sidebar">
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        paddingLeft: '12px',
        marginBottom: '12px'
      }}>
        NAVIGATION
      </div>

      {navigationItems.map(item => (
        <NavLink
          key={item.name}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
            background: isActive ? 'rgba(124, 106, 247, 0.12)' : 'transparent',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
            transition: 'background var(--transition-fast), color var(--transition-fast)'
          })}
          className="sidebar-link"
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}

      <style>{`
        .sidebar-link:hover {
          background: rgba(124, 106, 247, 0.05);
          color: var(--text-main);
        }
        
        @media (max-width: 768px) {
          .app-sidebar {
            width: 70px;
            padding: 20px 8px;
            align-items: center;
          }
          .app-sidebar span {
            display: none;
          }
          .app-sidebar div {
            display: none !important;
          }
          .sidebar-link {
            padding: 12px;
            justify-content: center;
            border-left: none !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
