import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

const SUBJECTS = [
  { name: 'Quantum Physics', topics: 12, icon: '⚛️', color: '#7C6AF7', category: 'Science' },
  { name: 'Human Anatomy', topics: 15, icon: '🫀', color: '#F15BB5', category: 'Biology' },
  { name: 'Organic Chemistry', topics: 10, icon: '🧪', color: '#00F5D4', category: 'Chemistry' },
  { name: 'Ancient History', topics: 8, icon: '🏛️', color: '#FF9800', category: 'History' },
  { name: 'Calculus III', topics: 14, icon: '📐', color: '#4CAF50', category: 'Mathematics' },
  { name: 'Astrophysics', topics: 11, icon: '🌌', color: '#9B5DE5', category: 'Science' },
  { name: 'Marine Biology', topics: 9, icon: '🐋', color: '#06B6D4', category: 'Biology' },
  { name: 'World Geography', topics: 13, icon: '🌍', color: '#22C55E', category: 'Geography' },
  { name: 'Computer Science', topics: 20, icon: '💻', color: '#3B82F6', category: 'Technology' },
  { name: 'Microbiology', topics: 7, icon: '🦠', color: '#EF4444', category: 'Biology' },
  { name: 'Psychology 101', topics: 10, icon: '🧠', color: '#A855F7', category: 'Social Science' },
  { name: 'Environmental Science', topics: 12, icon: '🌿', color: '#10B981', category: 'Science' },
  { name: 'Economics', topics: 15, icon: '📊', color: '#F59E0B', category: 'Social Science' },
  { name: 'Artificial Intelligence', topics: 18, icon: '🤖', color: '#6366F1', category: 'Technology' },
  { name: 'Genetics', topics: 9, icon: '🧬', color: '#EC4899', category: 'Biology' },
  { name: 'Sociology', topics: 11, icon: '👥', color: '#14B8A6', category: 'Social Science' },
  { name: 'Political Science', topics: 8, icon: '🗳️', color: '#F97316', category: 'Social Science' },
  { name: 'Philosophy', topics: 10, icon: '🤔', color: '#8B5CF6', category: 'Humanities' },
  { name: 'Marketing', topics: 14, icon: '📢', color: '#FBBF24', category: 'Business' },
  { name: 'Cyber Security', topics: 16, icon: '🔐', color: '#34D399', category: 'Technology' },
];

const CATEGORIES = ['All', ...new Set(SUBJECTS.map(s => s.category))];

const SubjectLearning = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = SUBJECTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || s.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Learning Portal</h2>
        <p style={{ color: 'var(--text-muted)' }}>Explore {SUBJECTS.length} subjects with AI-powered lessons and quizzes.</p>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input-field"
            style={{ paddingLeft: '40px' }}
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '10px 16px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                background: category === cat ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                color: category === cat ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Grid */}
      <div className="dashboard-grid">
        {filtered.map(subject => (
          <div
            key={subject.name}
            className="glass-panel glass-panel-interactive"
            onClick={() => navigate(`/learning/${encodeURIComponent(subject.name)}`)}
            style={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                fontSize: '36px',
                background: `${subject.color}18`,
                width: '60px', height: '60px',
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {subject.icon}
              </div>
              <span style={{
                background: `${subject.color}20`, color: subject.color,
                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600
              }}>
                {subject.category}
              </span>
            </div>
            <h4 style={{ fontSize: '17px', marginBottom: '8px' }}>{subject.name}</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                <BookOpen size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {subject.topics} Topics
              </span>
              <ChevronRight size={18} style={{ color: subject.color }} />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p>No subjects match your search.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectLearning;
