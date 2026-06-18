import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3, LineChart, Flame, CheckCircle, GraduationCap, Trophy, Award, Calendar, ChevronRight } from 'lucide-react';
import Loader from '../components/Loader';

const ProgressDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [summary, setSummary] = useState({
    streak: 0,
    totalCompleted: 0,
    totalQuizzes: 0,
    avgScore: 0,
    level: 'Starter 👋'
  });
  const [subjectProgress, setSubjectProgress] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper mapping subject name to total topics in curriculum
  const totalTopicsMap = {
    'Quantum Physics': 12,
    'Human Anatomy': 15,
    'Organic Chemistry': 10,
    'Ancient History': 8,
    'Calculus III': 14,
    'Astrophysics': 11,
    'Marine Biology': 9,
    'World Geography': 13,
    'Computer Science': 20,
    'Microbiology': 7,
    'Psychology 101': 10,
    'Environmental Science': 12,
    'Economics': 15,
    'Artificial Intelligence': 18,
    'Genetics': 9,
    'Sociology': 11,
    'Political Science': 8,
    'Philosophy': 10,
    'Marketing': 14,
    'Cyber Security': 16
  };

  useEffect(() => {
    const loadProgressData = async () => {
      if (!token) return;
      try {
        // 1. Fetch summary stats
        const summaryRes = await fetch('/api/progress/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const summaryData = await summaryRes.json();
        setSummary(summaryData);

        // 2. Fetch subject completions
        const subjectsRes = await fetch('/api/progress/subjects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const subjectsData = await subjectsRes.json();
        setSubjectProgress(subjectsData);

        // 3. Fetch certificates earned
        const certRes = await fetch('/api/quiz/certificates', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const certData = await certRes.json();
        setCertificates(certData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProgressData();
  }, [token]);

  if (loading) {
    return <Loader message="Analyzing your study achievements..." />;
  }

  // Calculate overall completion progress (approx 20 subjects * 10 topics average = 200 total topics)
  const overallCompletions = summary.totalCompleted || 0;
  const overallTarget = 100; // Benchmark target
  const overallPercent = Math.min(Math.round((overallCompletions * 100) / overallTarget), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-slide-up">
      
      {/* Title Header */}
      <div>
        <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '6px' }}>Progress Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>Analyze your subject mastery levels, weekly activity, and unlock certificates.</p>
      </div>

      {/* Analytics Jump Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }} className="stats-jump-grid">
        <div 
          className="glass-panel glass-panel-interactive"
          onClick={() => navigate('/progress/weekly')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <h4 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
              <span>Weekly Activity Logs</span>
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>View daily study hours and completions for the past 7 days.</p>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
        </div>

        <div 
          className="glass-panel glass-panel-interactive"
          onClick={() => navigate('/progress/performance')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <h4 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <LineChart size={18} style={{ color: 'var(--secondary)' }} />
              <span>Quiz Performance Analysis</span>
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Explore circular scores, average quiz marks, and weak points.</p>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Main progress stats and list grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 2fr',
        gap: '32px',
        alignItems: 'start'
      }} className="progress-details-grid">
        
        {/* Left Side: Summary metrics & certificates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Level & Streak Stats panel */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '18px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              Mastery summary
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Level */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Current Level</span>
                <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--secondary)' }}>{summary.level}</span>
              </div>
              
              {/* Streak */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Learning Streak</span>
                <span style={{ fontWeight: 700, fontSize: '16px', color: '#FF5722', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={16} fill="#FF5722" />
                  <span>{summary.streak} Days</span>
                </span>
              </div>

              {/* Total Completed */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Topics Mastered</span>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>{overallCompletions} Topics</span>
              </div>
            </div>

            {/* Overall progress slider */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Milestone Target ({overallTarget} topics)</span>
                <span>{overallPercent}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${overallPercent}%`,
                  height: '100%',
                  background: 'var(--primary-gradient)',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
          </div>

          {/* Earned Certificates List */}
          <div className="glass-panel">
            <h4 style={{ fontSize: '18px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '16px' }}>
              🏆 Unlocked Certificates
            </h4>
            {certificates.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
                Master all lessons in any subject to unlock official printable certificates!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {certificates.map(cert => (
                  <div 
                    key={cert.id}
                    style={{
                      background: 'rgba(124, 106, 247, 0.08)',
                      border: '1px solid rgba(124, 106, 247, 0.15)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: 600 }}>{cert.subject_name}</h5>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Code: {cert.certificate_code}</span>
                    </div>
                    <Award size={22} style={{ color: '#00F5D4' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Subject Wise progress bars */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h4 style={{ fontSize: '20px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '24px' }}>
            Subject Mastery Levels
          </h4>
          
          {Object.keys(subjectProgress).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              📚 Start learning lessons to visualize your subject breakdowns.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.entries(subjectProgress).map(([subject, count]) => {
                const total = totalTopicsMap[subject] || 10;
                const percentage = Math.min(Math.round((count * 100) / total), 100);

                return (
                  <div key={subject}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                      <span style={{ fontWeight: 600 }}>{subject}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count}/{total} Topics ({percentage}%)</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: percentage === 100 ? 'linear-gradient(90deg, #4CAF50, #00F5D4)' : 'var(--primary-gradient)',
                        borderRadius: '3px'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-jump-grid {
            grid-template-columns: 1fr;
          }
          .progress-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressDashboard;
