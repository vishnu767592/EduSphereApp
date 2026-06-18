import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, BookOpen } from 'lucide-react';

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]); // Empty state by default for E2E validation

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-slide-up" id="bookmarks-container">
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>🔖 Saved Bookmarks</h2>
        <p style={{ color: 'var(--text-muted)' }}>Quickly access your bookmarked modules, lessons, and topics.</p>
      </div>

      <div className="glass-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center',
        minHeight: '350px'
      }} id="bookmarks-panel">
        {bookmarks.length === 0 ? (
          /* Empty-state handling */
          <div id="bookmarks-empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '400px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(124, 106, 247, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '10px'
            }}>
              <Bookmark size={36} />
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Your Bookmark Drawer is Empty</h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>
              You haven't bookmarked any scientific topics or lesson modules yet. When exploring the learning portal, tap the bookmark icon to save content here.
            </p>

            <button
              id="go-to-learning-btn"
              onClick={() => navigate('/learning')}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '10px',
                height: '44px'
              }}
            >
              <BookOpen size={16} />
              <span>Explore Learning Portal</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} id="bookmarks-list">
            {bookmarks.map(item => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '16px',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>{item.title}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', marginLeft: '10px' }}>{item.category}</span>
                </div>
                <button 
                  onClick={() => setBookmarks(prev => prev.filter(b => b.id !== item.id))}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
