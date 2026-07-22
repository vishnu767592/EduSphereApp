import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, StickyNote, Bookmark, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import Loader from '../components/Loader';

const LessonDetail = () => {
  const { subjectName, topicName } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState(null);

  const decoded = {
    subject: decodeURIComponent(subjectName),
    topic: decodeURIComponent(topicName),
  };

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch('/api/ai/lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ topic: decoded.topic, subject: decoded.subject }),
        });
        if (!res.ok) throw new Error('Failed to generate lesson');
        const data = await res.json();
        setLesson(data.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchLesson();
  }, [token, decoded.topic]);

  const markComplete = async () => {
    setCompleting(true);
    try {
      const res = await apiFetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topicName: decoded.topic, subjectName: decoded.subject }),
      });
      if (res.ok) setIsCompleted(true);
    } catch (e) { /* silent */ }
    setCompleting(false);
  };

  const toggleBookmark = async () => {
    setBookmarking(true);
    try {
      const res = await apiFetch('/api/progress/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topicName: decoded.topic, subjectName: decoded.subject }),
      });
      if (res.ok) setIsBookmarked(b => !b);
    } catch (e) { /* silent */ }
    setBookmarking(false);
  };

  if (loading) return <Loader message={`Generating AI lesson on ${decoded.topic}...`} />;

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate(`/learning/${encodeURIComponent(decoded.subject)}`)}
          style={{ background: 'rgba(255,255,255,0.06)', border: 'var(--border-card)', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: 'var(--text-main)', flexShrink: 0 }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{decoded.subject}</div>
          <h2 style={{ fontSize: '26px', fontWeight: 800 }}>{decoded.topic}</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={toggleBookmark}
            style={{
              background: isBookmarked ? 'rgba(255,209,65,0.12)' : 'rgba(255,255,255,0.06)',
              border: isBookmarked ? '1px solid rgba(255,209,65,0.4)' : 'var(--border-card)',
              borderRadius: '10px', padding: '10px 16px', cursor: 'pointer',
              color: isBookmarked ? '#FFD141' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600
            }}
            disabled={bookmarking}
          >
            <Bookmark size={16} fill={isBookmarked ? '#FFD141' : 'none'} />
            {isBookmarked ? 'Saved' : 'Bookmark'}
          </button>
          <button
            onClick={() => navigate(`/notes?topic=${encodeURIComponent(decoded.topic)}&subject=${encodeURIComponent(decoded.subject)}`)}
            style={{
              background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.2)',
              borderRadius: '10px', padding: '10px 16px', cursor: 'pointer',
              color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600
            }}
          >
            <StickyNote size={16} /> Take Notes
          </button>
          <button
            onClick={() => navigate(`/quiz/${encodeURIComponent(decoded.topic)}`)}
            style={{
              background: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.25)',
              borderRadius: '10px', padding: '10px 16px', cursor: 'pointer',
              color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600
            }}
          >
            <Brain size={16} /> Take Quiz
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      {error ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: '20px' }}>Retry</button>
        </div>
      ) : (
        <div className="glass-panel" style={{ lineHeight: 1.9, fontSize: '15px' }}>
          <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>
            {lesson}
          </div>
        </div>
      )}

      {/* Mark Complete */}
      {!error && (
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={markComplete}
            disabled={isCompleted || completing}
            className="btn-primary"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 36px', fontSize: '16px',
              background: isCompleted ? 'linear-gradient(135deg, #4CAF50, #43A047)' : undefined
            }}
          >
            {completing ? <Loader2 size={18} className="spin" /> : <CheckCircle size={18} />}
            {isCompleted ? 'Lesson Completed! ✓' : 'Mark as Complete'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default LessonDetail;
