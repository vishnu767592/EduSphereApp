import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Sparkles, StickyNote } from 'lucide-react';
import Loader from '../components/Loader';

const Notes = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const initTopic = searchParams.get('topic') || '';
  const initSubject = searchParams.get('subject') || '';

  const [topic, setTopic] = useState(initTopic);
  const [content, setContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/progress/notes', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setAllNotes(await res.json());
      } catch (e) { /* silent */ }
      setLoadingNotes(false);
    };
    fetchNotes();
  }, [token]);

  const generateNotes = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setContent('');
    try {
      const res = await fetch('/api/ai/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topic, subject: initSubject }),
      });
      const data = await res.json();
      setContent(data.content || '');
    } catch (e) {
      setContent('Error generating notes. Please try again.');
    }
    setGenerating(false);
  };

  const saveNote = async () => {
    if (!topic.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/progress/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topic, content }),
      });
      if (res.ok) {
        const note = await res.json();
        setAllNotes(n => [note, ...n]);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) { /* silent */ }
    setSaving(false);
  };

  const deleteNote = async (noteId) => {
    try {
      await fetch(`/api/progress/notes/${noteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setAllNotes(n => n.filter(note => note.id !== noteId));
    } catch (e) { /* silent */ }
  };

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <StickyNote size={28} color="var(--secondary)" /> My Notes
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Generate AI-powered notes or write your own.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Editor */}
        <div className="glass-panel">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              className="input-field"
              placeholder="Topic name (e.g. Quantum Entanglement)"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={generateNotes}
              disabled={!topic.trim() || generating}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
            >
              <Sparkles size={16} />
              {generating ? 'Generating...' : 'AI Generate'}
            </button>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Your notes will appear here... or start typing your own!"
            style={{
              width: '100%', minHeight: '400px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
              color: 'var(--text-main)', padding: '16px', fontSize: '14px',
              lineHeight: 1.8, fontFamily: 'var(--font-body)', resize: 'vertical', outline: 'none'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            {saved && <span className="success-msg">✓ Note saved successfully!</span>}
            <div style={{ marginLeft: 'auto' }}>
              <button onClick={saveNote} disabled={saving || !content.trim()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} />
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>

        {/* Saved Notes List */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>Saved Notes ({allNotes.length})</h4>
          {loadingNotes ? (
            <Loader message="Loading notes..." />
          ) : allNotes.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
              <p style={{ fontSize: '14px' }}>No saved notes yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px', overflowY: 'auto' }}>
              {allNotes.map(note => (
                <div
                  key={note.id}
                  className="glass-panel"
                  style={{ padding: '16px', cursor: 'pointer', borderLeft: selectedNote === note.id ? '3px solid var(--secondary)' : '3px solid transparent' }}
                  onClick={() => { setSelectedNote(note.id); setTopic(note.topic); setContent(note.content); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{note.topic}</div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F44336', padding: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
