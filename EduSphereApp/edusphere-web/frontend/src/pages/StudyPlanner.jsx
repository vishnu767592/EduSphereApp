import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Sparkles, Download } from 'lucide-react';
import Loader from '../components/Loader';

const StudyPlanner = () => {
  const { token } = useAuth();
  const [subject, setSubject] = useState('');
  const [goal, setGoal] = useState('');
  const [weeks, setWeeks] = useState(4);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    setPlan(null);
    try {
      const res = await apiFetch('/api/ai/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject, goal, weeks, hoursPerDay }),
      });
      const data = await res.json();
      setPlan(data.content || `# ${subject} Study Plan\n\n- **Week 1**: Foundational Concepts\n- **Week 2**: Advanced Topics & Practice\n- **Week 3**: Review & Quizzes`);
    } catch (e) {
      setPlan('Error generating study plan. Check your connection and try again.');
    }
    setLoading(false);
  };

  const downloadPlan = () => {
    if (!plan) return;
    const blob = new Blob([`EduSphere Study Planner\n${subject}\n\n${plan}`], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${subject.replace(/\s+/g, '_')}_study_plan.txt`;
    a.click();
  };

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={28} color="var(--secondary)" /> AI Study Planner
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Generate a personalized week-by-week study timetable.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
        {/* Form */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 700, marginBottom: '20px' }}>Configure Your Plan</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Subject / Topic *</label>
              <input className="input-field" placeholder="e.g. Quantum Physics, Data Science" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Learning Goal</label>
              <input className="input-field" placeholder="e.g. Master the fundamentals, Exam prep" value={goal} onChange={e => setGoal(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                Duration: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{weeks} weeks</span>
              </label>
              <input type="range" min={1} max={12} value={weeks} onChange={e => setWeeks(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>1 week</span><span>12 weeks</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                Hours/day: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{hoursPerDay}h</span>
              </label>
              <input type="range" min={1} max={8} value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
            </div>
            <button
              onClick={generatePlan}
              disabled={!subject.trim() || loading}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
            >
              <Sparkles size={16} />
              {loading ? 'Generating...' : 'Generate Study Plan'}
            </button>
          </div>
        </div>

        {/* Output */}
        <div>
          {loading ? (
            <Loader message="AI is building your personalized study plan..." />
          ) : plan ? (
            <div className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ fontWeight: 700, fontSize: '16px' }}>📅 Your Study Plan: {subject}</h4>
                <button onClick={downloadPlan} style={{ background: 'rgba(0,245,212,0.1)', border: '1px solid rgba(0,245,212,0.2)', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <Download size={15} /> Download
                </button>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: '14px', color: 'var(--text-main)' }}>
                {plan}
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📅</div>
              <h4 style={{ marginBottom: '8px' }}>Ready to Plan!</h4>
              <p style={{ fontSize: '14px' }}>Fill in the form and click Generate to create your personalized plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
