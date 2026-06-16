import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, GraduationCap, Flame, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }} className="animate-fade-in">
      {/* Background Glowing Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(124, 106, 247, 0.15) 0%, rgba(0,0,0,0) 70%)',
        zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(0, 245, 212, 0.12) 0%, rgba(0,0,0,0) 70%)',
        zIndex: -1
      }}></div>

      {/* Main Header / Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '60px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(124, 106, 247, 0.1)',
          border: '1px solid rgba(124, 106, 247, 0.2)',
          padding: '8px 16px',
          borderRadius: '30px',
          color: 'var(--primary)',
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          <Sparkles size={14} />
          <span>Step into the Future of Education</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(38px, 6vw, 64px)',
          fontWeight: 800,
          lineHeight: 1.1,
          fontFamily: 'var(--font-title)',
          marginBottom: '20px'
        }}>
          Welcome to <span style={{
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>EduSphere</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: 'var(--text-muted)',
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          Master complex science, math, and humanities subjects through interactive AI tutors, curated 3D holographic models, and automated study progress tracking.
        </p>

        {/* Call to Actions */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/signup')} 
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}
          >
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="btn-secondary"
            style={{ fontSize: '16px' }}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Features Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        maxWidth: '1100px',
        width: '100%'
      }}>
        {/* Card 1 */}
        <div className="glass-panel">
          <div style={{
            background: 'rgba(124, 106, 247, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '16px'
          }}>
            <MessageSquare size={24} />
          </div>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Personal AI Tutor</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Ask questions, request summaries, and get immediate conceptual explanations tailored to your level.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-panel">
          <div style={{
            background: 'rgba(0, 245, 212, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)',
            marginBottom: '16px'
          }}>
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Hologram Viewer</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Project educational visuals using standard DIY holographic projectors directly from your web screen.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-panel">
          <div style={{
            background: 'rgba(241, 91, 181, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
            marginBottom: '16px'
          }}>
            <GraduationCap size={24} />
          </div>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Custom Quizzes</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Test your knowledge with timer-based multiple-choice quizzes and review performance analytics.
          </p>
        </div>

        {/* Card 4 */}
        <div className="glass-panel">
          <div style={{
            background: 'rgba(255, 87, 34, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF5722',
            marginBottom: '16px'
          }}>
            <Flame size={24} />
          </div>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Learning Streaks</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Maintain streaks, collect credentials, unlock master certificates, and climb the leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
