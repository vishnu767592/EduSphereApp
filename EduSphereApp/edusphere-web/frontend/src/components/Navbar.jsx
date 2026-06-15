import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Flame, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStreak = async () => {
      if (!token || (user && user.role === 'admin')) return;
      try {
        const response = await fetch('/api/progress/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStreak(data.streak || 0);
        }
      } catch (e) {
        console.error('Failed to load streak in navbar:', e);
      }
    };
    fetchStreak();
  }, [token, user]);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 28px',
      background: 'var(--bg-sidebar)',
      borderBottom: 'var(--border-card)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '70px'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <span style={{ fontSize: '24px' }}>🎓</span>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 800,
          background: 'var(--primary-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-title)'
        }}>EduSphere</h1>
      </div>

      {/* Action Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Streak Counter */}
        {user && user.role !== 'admin' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 87, 34, 0.12)',
            padding: '6px 12px',
            borderRadius: '20px',
            color: '#FF5722',
            fontSize: '14px',
            fontWeight: 700,
            border: '1px solid rgba(255, 87, 34, 0.2)'
          }}>
            <Flame size={16} fill="#FF5722" />
            <span>{streak} Days</span>
          </div>
        )}

        {/* Theme Toggler */}
        <button 
          onClick={toggleTheme}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer',
            transition: 'background var(--transition-fast)'
          }}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Details */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              lineHeight: 1.2
            }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user.role}
              </span>
            </div>
            <div 
              onClick={() => navigate('/profile')}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Logout */}
        <button 
          onClick={() => {
            logout();
            navigate('/login');
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 500,
            padding: '6px 10px',
            transition: 'color var(--transition-fast)'
          }}
          title="Sign Out"
        >
          <LogOut size={16} />
          <span className="hide-mobile">Logout</span>
        </button>
      </div>
      
      <style>{`
        @media (max-width: 576px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
