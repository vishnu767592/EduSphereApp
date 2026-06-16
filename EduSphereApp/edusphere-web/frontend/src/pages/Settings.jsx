import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Globe, Shield, Info } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  const sections = [
    {
      title: 'Appearance',
      icon: Sun,
      items: [
        {
          label: 'Theme',
          description: 'Switch between dark and light mode.',
          control: (
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: theme === 'dark' ? 'rgba(124,106,247,0.12)' : 'rgba(255,210,65,0.12)',
                border: theme === 'dark' ? '1px solid rgba(124,106,247,0.3)' : '1px solid rgba(255,210,65,0.3)',
                borderRadius: '10px', padding: '8px 16px', cursor: 'pointer',
                color: theme === 'dark' ? 'var(--primary)' : '#F59E0B',
                fontWeight: 600, fontSize: '14px'
              }}
            >
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Study Reminders', description: 'Daily reminders to maintain your streak.' },
        { label: 'Achievement Alerts', description: 'Notify when you earn a certificate or badge.' },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Data Usage', description: 'Your learning data is only used to personalize your experience.' },
        { label: 'AI Interactions', description: 'Chat history is not stored permanently. Sessions are temporary.' },
      ]
    },
    {
      title: 'About',
      icon: Info,
      items: [
        { label: 'EduSphere Version', description: '1.0.0 — Production Release' },
        { label: 'Backend', description: 'Spring Boot + MySQL + Groq Llama-3.1' },
        { label: 'Frontend', description: 'React 18 + Vite + Custom Design System' },
      ]
    }
  ];

  return (
    <div className="animate-slide-up" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your preferences and account settings.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sections.map(({ title, icon: Icon, items }) => (
          <div key={title} className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
              <Icon size={18} /> {title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < items.length - 1 ? '16px' : '0', borderBottom: i < items.length - 1 ? 'var(--border-card)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.description}</div>
                  </div>
                  {item.control}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
