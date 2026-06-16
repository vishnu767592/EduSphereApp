import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, BookOpen } from 'lucide-react';
import Loader from '../components/Loader';

const Bookmarks = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/progress/bookmarks', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setBookmarks(await res.json());
      } catch (e) { /* silent */ }
      setLoading(false);
    };
    if (token) load();
  }, [token]);

  const removeBookmark = async (id) => {
    try {
      await fetch(`/api/progress/bookmark/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setBookmarks(b => b.filter(bk => bk.id !== id));
    } catch (e) { /* silent */ }
  };

  if (loading) return <Loader message="Loading bookmarks..." />;

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bookmark size={28} color="#FFD166" /> Bookmarks
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>{bookmarks.length} saved {bookmarks.length === 1 ? 'lesson' : 'lessons'}</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '80px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔖</div>
          <h3 style={{ marginBottom: '8px' }}>No bookmarks yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Save lessons while learning to find them here.</p>
          <button onClick={() => navigate('/learning')} className="btn-primary">Explore Learning Portal</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {bookmarks.map(bk => (
            <div key={bk.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(255,209,65,0.1)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bookmark size={18} color="#FFD166" fill="#FFD166" />
                </div>
                <button onClick={() => removeBookmark(bk.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F44336' }}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{bk.topicName}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>{bk.subjectName}</div>
              <button
                onClick={() => navigate(`/learning/${encodeURIComponent(bk.subjectName)}/${encodeURIComponent(bk.topicName)}`)}
                className="btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}
              >
                <BookOpen size={14} /> Resume Lesson
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
