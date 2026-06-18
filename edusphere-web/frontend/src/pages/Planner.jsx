import React, { useState } from 'react';
import { Calendar, Clock, Book, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const Planner = () => {
  const [subject, setSubject] = useState('Physics');
  const [hours, setHours] = useState('');
  const [plans, setPlans] = useState([
    { id: '1', subject: 'Calculus', hours: 6, topic: 'Integration & Limits' },
    { id: '2', subject: 'Organic Chemistry', hours: 4, topic: 'Hydrocarbons' }
  ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreatePlan = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Required field validation
    if (!hours) {
      setError('Study hours per week is required');
      return;
    }

    const numericHours = parseInt(hours, 10);

    // 2. Invalid input validation
    if (isNaN(numericHours)) {
      setError('Hours must be a valid number');
      return;
    }

    // 3. Boundary value testing: Hours range [1, 40]
    if (numericHours < 1) {
      setError('Study hours cannot be less than 1 hour');
      return;
    }
    if (numericHours > 40) {
      setError('Study hours cannot exceed 40 hours per week');
      return;
    }

    // Add new plan
    const newPlan = {
      id: Date.now().toString(),
      subject,
      hours: numericHours,
      topic: `Custom Syllabus Module for ${subject}`
    };

    setPlans(prev => [...prev, newPlan]);
    setSuccess(`Successfully added study plan for ${subject}`);
    setHours('');
  };

  const handleDeletePlan = (id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    setSuccess('Study plan removed');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-slide-up" id="planner-container">
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>📅 Study Planner</h2>
        <p style={{ color: 'var(--text-muted)' }}>Generate weekly customized study modules and track your allocated learning hours.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {/* Form panel */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '20px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '20px' }}>
            Add Weekly Goal
          </h3>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid rgba(255, 77, 77, 0.2)',
              padding: '12px 16px',
              borderRadius: '8px',
              color: '#FF4D4D',
              fontSize: '14px',
              marginBottom: '20px'
            }} id="planner-error">
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '12px 16px',
              borderRadius: '8px',
              color: '#10B981',
              fontSize: '14px',
              marginBottom: '20px'
            }} id="planner-success">
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} id="planner-form">
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                SELECT SUBJECT
              </label>
              <select
                id="planner-subject-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
                style={{ width: '100%', background: 'rgba(20, 16, 38, 0.95)', color: 'var(--text-main)' }}
              >
                <option value="Physics">Physics</option>
                <option value="Calculus">Calculus</option>
                <option value="Organic Chemistry">Organic Chemistry</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Astrophysics">Astrophysics</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                HOURS PER WEEK (Limit: 1 - 40)
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  id="planner-hours-input"
                  placeholder="e.g. 10"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              id="planner-submit-btn"
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
                height: '44px'
              }}
            >
              <Plus size={16} />
              <span>Create Goal</span>
            </button>
          </form>
        </div>

        {/* Current Plans Grid */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            Allocated Schedule
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} id="planner-list">
            {plans.map(plan => (
              <div 
                key={plan.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '16px',
                  borderRadius: '12px'
                }}
                className="planner-item-card"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Book size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{plan.subject}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{plan.topic}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: 'rgba(0, 245, 212, 0.15)',
                    color: 'var(--secondary)'
                  }}>
                    {plan.hours} hrs/wk
                  </span>
                  
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 77, 77, 0.7)',
                      cursor: 'pointer'
                    }}
                    className="delete-plan-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {plans.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }} id="planner-empty-state">
                <Calendar size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p>No study plans generated yet. Use the form to start planning your week!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
