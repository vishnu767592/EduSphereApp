import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Brain, Zap, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TOPICS = {
  'Quantum Physics': [
    { name: 'Wave-Particle Duality', difficulty: 'Beginner' },
    { name: "Schrödinger's Equation", difficulty: 'Intermediate' },
    { name: 'Quantum Entanglement', difficulty: 'Advanced' },
    { name: 'Heisenberg Uncertainty Principle', difficulty: 'Intermediate' },
    { name: 'Quantum Tunneling', difficulty: 'Advanced' },
    { name: 'Superposition', difficulty: 'Beginner' },
    { name: 'Quantum Numbers', difficulty: 'Beginner' },
    { name: 'Spin and Angular Momentum', difficulty: 'Intermediate' },
    { name: 'Quantum Field Theory', difficulty: 'Advanced' },
    { name: 'Photoelectric Effect', difficulty: 'Beginner' },
    { name: 'Bohr Model', difficulty: 'Beginner' },
    { name: 'Quantum Computing Basics', difficulty: 'Advanced' },
  ],
  'Human Anatomy': [
    { name: 'Skeletal System', difficulty: 'Beginner' },
    { name: 'Muscular System', difficulty: 'Beginner' },
    { name: 'Nervous System', difficulty: 'Intermediate' },
    { name: 'Cardiovascular System', difficulty: 'Intermediate' },
    { name: 'Respiratory System', difficulty: 'Beginner' },
    { name: 'Digestive System', difficulty: 'Beginner' },
    { name: 'Endocrine System', difficulty: 'Intermediate' },
    { name: 'Immune System', difficulty: 'Intermediate' },
    { name: 'Reproductive System', difficulty: 'Intermediate' },
    { name: 'Lymphatic System', difficulty: 'Advanced' },
    { name: 'Integumentary System', difficulty: 'Beginner' },
    { name: 'Urinary System', difficulty: 'Beginner' },
    { name: 'Sensory Organs', difficulty: 'Intermediate' },
    { name: 'Brain Structure', difficulty: 'Advanced' },
    { name: 'Cell Biology', difficulty: 'Beginner' },
  ],
  'Computer Science': [
    { name: 'Data Structures', difficulty: 'Beginner' },
    { name: 'Algorithms', difficulty: 'Intermediate' },
    { name: 'Operating Systems', difficulty: 'Intermediate' },
    { name: 'Computer Networks', difficulty: 'Intermediate' },
    { name: 'Database Management', difficulty: 'Intermediate' },
    { name: 'Software Engineering', difficulty: 'Beginner' },
    { name: 'Object Oriented Programming', difficulty: 'Beginner' },
    { name: 'Compiler Design', difficulty: 'Advanced' },
    { name: 'Cybersecurity Basics', difficulty: 'Beginner' },
    { name: 'Cloud Computing', difficulty: 'Intermediate' },
    { name: 'Web Development', difficulty: 'Beginner' },
    { name: 'Mobile Development', difficulty: 'Intermediate' },
    { name: 'Version Control with Git', difficulty: 'Beginner' },
    { name: 'Big Data', difficulty: 'Advanced' },
    { name: 'Blockchain Basics', difficulty: 'Advanced' },
    { name: 'API Development', difficulty: 'Intermediate' },
    { name: 'Design Patterns', difficulty: 'Advanced' },
    { name: 'Testing and QA', difficulty: 'Intermediate' },
    { name: 'Agile Methodology', difficulty: 'Beginner' },
    { name: 'DevOps Basics', difficulty: 'Intermediate' },
  ],
  'Artificial Intelligence': [
    { name: 'Introduction to AI', difficulty: 'Beginner' },
    { name: 'Machine Learning Basics', difficulty: 'Beginner' },
    { name: 'Neural Networks', difficulty: 'Intermediate' },
    { name: 'Deep Learning', difficulty: 'Advanced' },
    { name: 'Natural Language Processing', difficulty: 'Advanced' },
    { name: 'Computer Vision', difficulty: 'Advanced' },
    { name: 'Reinforcement Learning', difficulty: 'Advanced' },
    { name: 'Decision Trees', difficulty: 'Intermediate' },
    { name: 'Support Vector Machines', difficulty: 'Intermediate' },
    { name: 'AI Ethics', difficulty: 'Beginner' },
    { name: 'Generative AI', difficulty: 'Advanced' },
    { name: 'AI in Healthcare', difficulty: 'Intermediate' },
    { name: 'Robotics and AI', difficulty: 'Advanced' },
    { name: 'Expert Systems', difficulty: 'Intermediate' },
    { name: 'Future of AI', difficulty: 'Beginner' },
    { name: 'AI Tools Overview', difficulty: 'Beginner' },
    { name: 'Data Preprocessing', difficulty: 'Intermediate' },
    { name: 'Model Evaluation', difficulty: 'Intermediate' },
  ],
  'Astrophysics': [
    { name: 'The Big Bang', difficulty: 'Beginner' },
    { name: 'Star Formation', difficulty: 'Beginner' },
    { name: 'Black Holes', difficulty: 'Intermediate' },
    { name: 'Dark Matter', difficulty: 'Advanced' },
    { name: 'Dark Energy', difficulty: 'Advanced' },
    { name: 'Galaxies', difficulty: 'Beginner' },
    { name: 'Neutron Stars', difficulty: 'Intermediate' },
    { name: 'Cosmic Microwave Background', difficulty: 'Advanced' },
    { name: 'Gravitational Waves', difficulty: 'Advanced' },
    { name: 'Stellar Evolution', difficulty: 'Intermediate' },
    { name: 'Exoplanets', difficulty: 'Beginner' },
  ],
};

const getDifficultyColor = (d) => {
  if (d === 'Beginner') return '#4CAF50';
  if (d === 'Intermediate') return '#FF9800';
  return '#F44336';
};

const TopicListing = () => {
  const { subjectName } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [completedTopics, setCompletedTopics] = useState([]);
  const decodedSubject = decodeURIComponent(subjectName);

  const topics = TOPICS[decodedSubject] || [
    { name: 'Introduction', difficulty: 'Beginner' },
    { name: 'Core Concepts', difficulty: 'Beginner' },
    { name: 'Intermediate Topics', difficulty: 'Intermediate' },
    { name: 'Advanced Topics', difficulty: 'Advanced' },
    { name: 'Case Studies', difficulty: 'Intermediate' },
    { name: 'Practice Problems', difficulty: 'Beginner' },
    { name: 'Summary and Review', difficulty: 'Beginner' },
  ];

  useEffect(() => {
    const fetchCompleted = async () => {
      if (!token) return;
      try {
        const res = await apiFetch('/api/progress/completions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCompletedTopics(data.map(c => typeof c === 'string' ? c : c.topicName));
          }
        }
      } catch (e) { /* silent */ }
    };
    fetchCompleted();
  }, [token]);

  const completedCount = topics.filter(t => completedTopics.includes(t.name)).length;

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button
          onClick={() => navigate('/learning')}
          style={{ background: 'rgba(255,255,255,0.06)', border: 'var(--border-card)', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>{decodedSubject}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {completedCount} / {topics.length} topics completed
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '99px', height: '6px', marginBottom: '28px' }}>
        <div style={{
          background: 'var(--primary-gradient)',
          height: '100%', borderRadius: '99px',
          width: `${topics.length > 0 ? (completedCount / topics.length) * 100 : 0}%`,
          transition: 'width 0.5s ease'
        }} />
      </div>

      {/* Topics list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {topics.map((topic, idx) => {
          const isCompleted = completedTopics.includes(topic.name);
          const diffColor = getDifficultyColor(topic.difficulty);
          return (
            <div
              key={topic.name}
              className="glass-panel glass-panel-interactive"
              onClick={() => navigate(`/learning/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(topic.name)}`)}
              style={{
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '16px',
                borderLeft: isCompleted ? '4px solid #4CAF50' : '4px solid transparent',
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: isCompleted ? 'rgba(76,175,80,0.15)' : 'rgba(124,106,247,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {isCompleted
                  ? <CheckCircle size={20} color="#4CAF50" />
                  : <BookOpen size={20} color="var(--primary)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{topic.name}</div>
                <span className="badge-difficulty" style={{
                  background: `${diffColor}18`, color: diffColor,
                  padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600
                }}>
                  {topic.difficulty}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/quiz/${encodeURIComponent(topic.name)}`); }}
                  style={{
                    background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)',
                    borderRadius: '8px', padding: '8px 14px', cursor: 'pointer',
                    color: 'var(--primary)', fontSize: '13px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <Brain size={14} /> Quiz
                </button>
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/learning/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(topic.name)}`); }}
                  style={{
                    background: 'var(--primary-gradient)', border: 'none',
                    borderRadius: '8px', padding: '8px 14px', cursor: 'pointer',
                    color: '#fff', fontSize: '13px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <Zap size={14} /> Learn
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicListing;
