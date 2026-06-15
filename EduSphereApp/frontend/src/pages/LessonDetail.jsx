import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Bookmark, FileText, Video, PlayCircle, HelpCircle } from 'lucide-react';
import Loader from '../components/Loader';

const LessonDetail = () => {
  const { subjectName, topicName } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const decodedSubject = decodeURIComponent(subjectName);
  const decodedTopic = decodeURIComponent(topicName);

  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  // Helper to retrieve difficulty based on subject lists
  const getDifficulty = (topic) => {
    // Quick difficulty dictionary matching the static lists
    const advanced = ['Quantum Entanglement', 'Quantum Tunneling', 'Quantum Field Theory', 'Quantum Computing Basics', 'Lymphatic System', 'Brain Structure', 'Reaction Mechanisms', 'Amines', 'Stereochemistry', 'Line Integrals', 'Surface Integrals', "Green's Theorem", "Stokes' Theorem", 'Divergence Theorem', 'Taylor Series', 'Lagrange Multipliers', 'Dark Matter', 'Dark Energy', 'Cosmic Microwave Background', 'Gravitational Waves', 'Oceanography', 'Compiler Design', 'Big Data', 'Blockchain Basics', 'Design Patterns', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Generative AI', 'Robotics and AI', 'Personality Theories'];
    const intermediate = ["Schrödinger's Equation", 'Heisenberg Uncertainty Principle', 'Spin and Angular Momentum', 'Nervous System', 'Cardiovascular System', 'Endocrine System', 'Immune System', 'Reproductive System', 'Sensory Organs', 'Isomerism', 'Alcohols and Ethers', 'Aldehydes and Ketones', 'Carboxylic Acids', 'Roman Empire', 'Persian Empire', 'Ancient Americas', 'Partial Derivatives', 'Multiple Integrals', 'Gradient, Divergence, Curl', 'Parametric Surfaces', 'Vector Fields', 'Black Holes', 'Neutron Stars', 'Stellar Evolution', 'Deep Sea Life', 'Ocean Chemistry', 'Marine Conservation', 'Algorithms', 'Operating Systems', 'Computer Networks', 'Database Management', 'Mobile Development', 'API Development', 'Testing and QA', 'DevOps Basics', 'Neural Networks', 'Decision Trees', 'Support Vector Machines', 'AI in Healthcare', 'Expert Systems', 'Data Preprocessing', 'Model Evaluation', 'Biological Bases of Behavior', 'Learning and Conditioning', 'Memory', 'Cognition and Language', 'Developmental Psychology'];
    
    if (advanced.includes(topic)) return 'Advanced';
    if (intermediate.includes(topic)) return 'Intermediate';
    return 'Beginner';
  };

  useEffect(() => {
    const topicDiff = getDifficulty(decodedTopic);
    setDifficulty(topicDiff);

    const loadLessonData = async () => {
      if (!token) return;
      try {
        // 1. Mark topic completed (auto-saved on visit)
        await fetch('/api/progress/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ subject_name: decodedSubject, topic_name: decodedTopic })
        });

        // 2. Fetch AI-generated lesson content from backend Groq proxy
        const response = await fetch('/api/ai/lesson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ topic: decodedTopic, difficulty: topicDiff })
        });

        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
        } else {
          setContent('Failed to generate lesson content.');
        }

        // 3. Check if current topic is bookmarked
        const bookmarkResponse = await fetch('/api/progress/bookmarks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (bookmarkResponse.ok) {
          const bookmarkList = await bookmarkResponse.json();
          const isBookmarked = bookmarkList.some(
            b => b.subject_name === decodedSubject && b.topic_name === decodedTopic
          );
          setBookmarked(isBookmarked);
        }
      } catch (err) {
        console.error('Error fetching lesson details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [decodedSubject, decodedTopic, token]);

  const handleBookmarkToggle = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/progress/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subject_name: decodedSubject, topic_name: decodedTopic })
      });
      if (response.ok) {
        const data = await response.json();
        setBookmarked(data.bookmarked);
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  };

  if (loading) {
    return <Loader message={`Generating AI lesson explanation for ${decodedTopic}...`} />;
  }

  const diffColorClass = difficulty.toLowerCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-slide-up">
      {/* Navigation Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate(`/learning/${encodeURIComponent(decodedSubject)}`)}
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
              LESSON DETAIL
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px' }}>{decodedTopic}</h2>
          </div>
        </div>

        {/* Bookmark toggle button */}
        <button
          onClick={handleBookmarkToggle}
          style={{
            background: bookmarked ? 'rgba(255, 209, 102, 0.12)' : 'rgba(255,255,255,0.05)',
            border: bookmarked ? '1px solid rgba(255, 209, 102, 0.3)' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: bookmarked ? '#FFD166' : 'var(--text-main)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background var(--transition-fast)'
          }}
        >
          <Bookmark size={16} fill={bookmarked ? '#FFD166' : 'none'} />
          <span>{bookmarked ? 'Bookmarked' : 'Bookmark Topic'}</span>
        </button>
      </div>

      {/* Main Grid Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }} className="lesson-grid">
        {/* Lesson text content */}
        <div className="glass-panel" style={{ minHeight: '400px', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span className={`badge-difficulty ${diffColorClass}`}>
              {difficulty} Level
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Progress Auto-Saved</span>
          </div>

          <div style={{
            color: 'var(--text-main)',
            fontSize: '15px',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-body)'
          }} className="lesson-content">
            {content}
          </div>
        </div>

        {/* Action Sidebar Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '24px' }}>
            <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Study tools</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Study Notes */}
              <button
                onClick={() => navigate(`/learning/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(decodedTopic)}/notes`)}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%'
                }}
              >
                <FileText size={16} />
                <span>AI Study Notes</span>
              </button>

              {/* Video Lessons */}
              <button
                onClick={() => navigate(`/learning/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(decodedTopic)}/videos`)}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  borderColor: 'var(--primary)'
                }}
              >
                <Video size={16} />
                <span>Watch Videos</span>
              </button>

              {/* Take Quiz */}
              <button
                onClick={() => navigate(`/quiz/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(decodedTopic)}`)}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  borderColor: 'var(--secondary)',
                  color: 'var(--secondary)',
                  background: 'rgba(0, 245, 212, 0.03)'
                }}
              >
                <PlayCircle size={16} />
                <span>Start Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .lesson-content h1, .lesson-content h2, .lesson-content h3 {
          margin-top: 24px;
          margin-bottom: 12px;
          color: var(--text-main);
        }
        
        @media (max-width: 992px) {
          .lesson-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonDetail;
