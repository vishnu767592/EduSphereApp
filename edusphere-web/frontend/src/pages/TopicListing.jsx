import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Search, CheckCircle2, Circle, HelpCircle } from 'lucide-react';
import Loader from '../components/Loader';

const TopicListing = () => {
  const { subjectName } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedSubject = decodeURIComponent(subjectName);

  // Replicating getTopicsForSubject from Android
  const getTopicsForSubject = (subject) => {
    switch (subject) {
      case 'Quantum Physics':
        return [
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
          { name: 'Quantum Computing Basics', difficulty: 'Advanced' }
        ];
      case 'Human Anatomy':
        return [
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
          { name: 'Cell Biology', difficulty: 'Beginner' }
        ];
      case 'Organic Chemistry':
        return [
          { name: 'Hydrocarbons', difficulty: 'Beginner' },
          { name: 'Functional Groups', difficulty: 'Beginner' },
          { name: 'Isomerism', difficulty: 'Intermediate' },
          { name: 'Reaction Mechanisms', difficulty: 'Advanced' },
          { name: 'Alcohols and Ethers', difficulty: 'Intermediate' },
          { name: 'Aldehydes and Ketones', difficulty: 'Intermediate' },
          { name: 'Carboxylic Acids', difficulty: 'Intermediate' },
          { name: 'Amines', difficulty: 'Advanced' },
          { name: 'Polymers', difficulty: 'Beginner' },
          { name: 'Stereochemistry', difficulty: 'Advanced' }
        ];
      case 'Ancient History':
        return [
          { name: 'Mesopotamia', difficulty: 'Beginner' },
          { name: 'Ancient Egypt', difficulty: 'Beginner' },
          { name: 'Ancient Greece', difficulty: 'Beginner' },
          { name: 'Roman Empire', difficulty: 'Intermediate' },
          { name: 'Ancient China', difficulty: 'Beginner' },
          { name: 'Indus Valley Civilization', difficulty: 'Beginner' },
          { name: 'Persian Empire', difficulty: 'Intermediate' },
          { name: 'Ancient Americas', difficulty: 'Intermediate' }
        ];
      case 'Calculus III':
        return [
          { name: 'Vectors and 3D Space', difficulty: 'Beginner' },
          { name: 'Partial Derivatives', difficulty: 'Intermediate' },
          { name: 'Multiple Integrals', difficulty: 'Intermediate' },
          { name: 'Line Integrals', difficulty: 'Advanced' },
          { name: 'Surface Integrals', difficulty: 'Advanced' },
          { name: "Green's Theorem", difficulty: 'Advanced' },
          { name: "Stokes' Theorem", difficulty: 'Advanced' },
          { name: 'Divergence Theorem', difficulty: 'Advanced' },
          { name: 'Taylor Series', difficulty: 'Advanced' },
          { name: 'Gradient, Divergence, Curl', difficulty: 'Intermediate' },
          { name: 'Lagrange Multipliers', difficulty: 'Advanced' },
          { name: 'Parametric Surfaces', difficulty: 'Intermediate' },
          { name: 'Coordinate Systems', difficulty: 'Beginner' },
          { name: 'Vector Fields', difficulty: 'Intermediate' }
        ];
      case 'Astrophysics':
        return [
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
          { name: 'Exoplanets', difficulty: 'Beginner' }
        ];
      case 'Marine Biology':
        return [
          { name: 'Ocean Ecosystems', difficulty: 'Beginner' },
          { name: 'Marine Mammals', difficulty: 'Beginner' },
          { name: 'Coral Reefs', difficulty: 'Beginner' },
          { name: 'Deep Sea Life', difficulty: 'Intermediate' },
          { name: 'Marine Plants', difficulty: 'Beginner' },
          { name: 'Ocean Chemistry', difficulty: 'Intermediate' },
          { name: 'Fish Biology', difficulty: 'Beginner' },
          { name: 'Marine Conservation', difficulty: 'Intermediate' },
          { name: 'Oceanography', difficulty: 'Advanced' }
        ];
      case 'Computer Science':
        return [
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
          { name: 'DevOps Basics', difficulty: 'Intermediate' }
        ];
      case 'Artificial Intelligence':
        return [
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
          { name: 'Model Evaluation', difficulty: 'Intermediate' }
        ];
      case 'Psychology 101':
        return [
          { name: 'Introduction to Psychology', difficulty: 'Beginner' },
          { name: 'Biological Bases of Behavior', difficulty: 'Intermediate' },
          { name: 'Sensation and Perception', difficulty: 'Beginner' },
          { name: 'States of Consciousness', difficulty: 'Beginner' },
          { name: 'Learning and Conditioning', difficulty: 'Intermediate' },
          { name: 'Memory', difficulty: 'Intermediate' },
          { name: 'Cognition and Language', difficulty: 'Intermediate' },
          { name: 'Motivation and Emotion', difficulty: 'Beginner' },
          { name: 'Developmental Psychology', difficulty: 'Intermediate' },
          { name: 'Personality Theories', difficulty: 'Advanced' }
        ];
      default:
        return [
          { name: 'Introduction', difficulty: 'Beginner' },
          { name: 'Core Concepts', difficulty: 'Beginner' },
          { name: 'Intermediate Topics', difficulty: 'Intermediate' },
          { name: 'Advanced Topics', difficulty: 'Advanced' },
          { name: 'Summary and Review', difficulty: 'Beginner' }
        ];
    }
  };

  const topics = getTopicsForSubject(decodedSubject);

  useEffect(() => {
    const fetchCompletions = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/progress/completions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Filter completions for this specific subject
          const completedNames = data
            .filter(item => item.subject_name === decodedSubject)
            .map(item => item.topic_name);
          setCompletedTopics(completedNames);
        }
      } catch (err) {
        console.error('Failed to fetch topic completions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletions();
  }, [token, decodedSubject]);

  const filteredTopics = topics.filter(top =>
    top.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader message="Loading subject topics..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-slide-up">
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={() => navigate('/learning')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            SUBJECTS
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px' }}>{decodedSubject}</h2>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
        <Search size={16} style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }} />
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '48px' }}
        />
      </div>

      {/* Topic List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTopics.map(top => {
          const isCompleted = completedTopics.includes(top.name);
          const diffClass = top.difficulty.toLowerCase();

          return (
            <div
              key={top.name}
              className="glass-panel glass-panel-interactive"
              onClick={() => navigate(`/learning/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(top.name)}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Checkmark icon */}
                {isCompleted ? (
                  <CheckCircle2 size={22} style={{ color: 'var(--difficulty-beginner)', flexShrink: 0 }} />
                ) : (
                  <Circle size={22} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                )}
                <div>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {top.name}
                  </h4>
                </div>
              </div>

              {/* Difficulty tag */}
              <span className={`badge-difficulty ${diffClass}`}>
                {top.difficulty}
              </span>
            </div>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No topics matches your search terms.
        </div>
      )}
    </div>
  );
};

export default TopicListing;
