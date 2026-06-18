import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Compass, MapPin, Calendar, Edit3, Camera, Image, Map, Sliders, Eye, HelpCircle, Shield, Award } from 'lucide-react';

const SubjectLearning = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [completions, setCompletions] = useState({});

  const subjects = [
    { name: 'Quantum Physics', desc: 'Wave-particle duality, Schrödinger, and entanglement.', icon: <Compass size={22} />, total: 12 },
    { name: 'Human Anatomy', desc: 'Explore skeletal, muscular, and nervous systems.', icon: <MapPin size={22} />, total: 15 },
    { name: 'Organic Chemistry', desc: 'Hydrocarbons, isomers, and reaction mechanisms.', icon: <Calendar size={22} />, total: 10 },
    { name: 'Ancient History', desc: 'Mesopotamia, Egypt, Greece, and Rome.', icon: <Calendar size={22} />, total: 8 },
    { name: 'Calculus III', desc: 'Vectors, derivatives, and multiple integration.', icon: <Edit3 size={22} />, total: 14 },
    { name: 'Astrophysics', desc: 'Big bang, stars, black holes, and dark energy.', icon: <Camera size={22} />, total: 11 },
    { name: 'Marine Biology', desc: 'Ocean ecosystems, deep sea creatures, and reefs.', icon: <Image size={22} />, total: 9 },
    { name: 'World Geography', desc: 'Terrain structures, atmospheres, and map layouts.', icon: <Map size={22} />, total: 13 },
    { name: 'Computer Science', desc: 'Data structures, networking, compiler, and OS.', icon: <Sliders size={22} />, total: 20 },
    { name: 'Microbiology', desc: 'Bacteria structure, virus mutations, and cultures.', icon: <Eye size={22} />, total: 7 },
    { name: 'Psychology 101', desc: 'Consciousness, behaviorism, and memory storage.', icon: <HelpCircle size={22} />, total: 10 },
    { name: 'Environmental Science', desc: 'Carbon cycles, climate change, and sustainability.', icon: <Compass size={22} />, total: 12 },
    { name: 'Economics', desc: 'Micro and macro models, market supply, and demand.', icon: <Sliders size={22} />, total: 15 },
    { name: 'Artificial Intelligence', desc: 'Machine learning, neural nets, NLP, and vision.', icon: <Compass size={22} />, total: 18 },
    { name: 'Genetics', desc: 'DNA sequences, gene mutation, and inheritability.', icon: <Eye size={22} />, total: 9 },
    { name: 'Sociology', desc: 'Structural behaviors, group culture, and deviations.', icon: <Calendar size={22} />, total: 11 },
    { name: 'Political Science', desc: 'State theories, diplomacy, and global treaties.', icon: <MapPin size={22} />, total: 8 },
    { name: 'Philosophy', desc: 'Epistemology, ethical choices, and logical axioms.', icon: <HelpCircle size={22} />, total: 10 },
    { name: 'Marketing', desc: 'Market psychology, ads, and brand value index.', icon: <Sliders size={22} />, total: 14 },
    { name: 'Cyber Security', desc: 'Encryption models, firewalls, and buffer overflows.', icon: <Shield size={22} />, total: 16 }
  ];

  useEffect(() => {
    const fetchCompletions = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/progress/subjects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCompletions(data);
        }
      } catch (err) {
        console.error('Failed to load completions:', err);
      }
    };
    fetchCompletions();
  }, [token]);

  const filteredSubjects = subjects.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-slide-up">
      {/* Header and Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '6px' }}>Curriculum subjects</h2>
          <p style={{ color: 'var(--text-muted)' }}>Choose a subject to begin exploring interactive lessons.</p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '48px' }}
          />
        </div>
      </div>

      {/* Grid of subjects */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {filteredSubjects.map(sub => {
          const completedCount = completions[sub.name] || 0;
          const percentage = Math.round((completedCount * 100) / sub.total);
          const isFinished = completedCount >= sub.total;

          return (
            <div
              key={sub.name}
              className="glass-panel glass-panel-interactive"
              onClick={() => navigate(`/learning/${encodeURIComponent(sub.name)}`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '200px'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    background: 'rgba(124, 106, 247, 0.12)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    {sub.icon}
                  </div>
                  {isFinished && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(76, 175, 80, 0.12)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      color: 'var(--difficulty-beginner)',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      <Award size={12} />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>{sub.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.4, marginBottom: '16px' }}>
                  {sub.desc}
                </p>
              </div>

              {/* Progress Footer */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  marginBottom: '6px'
                }}>
                  <span>{completedCount} / {sub.total} Topics</span>
                  <span>{percentage}%</span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(percentage, 100)}%`,
                    height: '100%',
                    background: isFinished ? 'linear-gradient(90deg, #4CAF50, #00F5D4)' : 'var(--primary-gradient)',
                    borderRadius: '3px',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          No subjects matches your search terms.
        </div>
      )}
    </div>
  );
};

export default SubjectLearning;
