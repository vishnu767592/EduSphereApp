import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import Loader from '../components/Loader';

const AITutor = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hello! I\'m your EduSphere AI Tutor powered by Groq. Ask me anything about your studies — concepts, problems, explanations, or study strategies!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await apiFetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.reply || 'Sorry, I could not process that.' }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Connection error. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => setMessages([{ role: 'assistant', content: '👋 Chat cleared! How can I help you?' }]);

  const quickPrompts = [
    'Explain quantum entanglement simply',
    'What is machine learning?',
    'How does the immune system work?',
    'Explain recursion with an example',
  ];

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={28} color="var(--primary)" /> AI Tutor
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Powered by Groq Llama-3.1</p>
        </div>
        <button onClick={clearChat} style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', color: '#F44336', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <Trash2 size={16} /> Clear
        </button>
      </div>

      {/* Quick prompts */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {quickPrompts.map(p => (
          <button key={p} onClick={() => { setInput(p); }} style={{ background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)', borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', color: 'var(--primary)', fontSize: '12px', fontWeight: 500 }}>
            {p}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px 0', marginBottom: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: msg.role === 'user' ? 'var(--primary-gradient)' : 'rgba(0,245,212,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {msg.role === 'user' ? <User size={18} color="#fff" /> : <Bot size={18} color="var(--secondary)" />}
            </div>
            <div style={{
              maxWidth: '75%',
              background: msg.role === 'user' ? 'rgba(124,106,247,0.12)' : 'var(--bg-card)',
              border: msg.role === 'user' ? '1px solid rgba(124,106,247,0.2)' : 'var(--border-card)',
              borderRadius: '14px',
              padding: '14px 18px',
              fontSize: '14px', lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,245,212,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="var(--secondary)" />
            </div>
            <div style={{ background: 'var(--bg-card)', border: 'var(--border-card)', borderRadius: '14px', padding: '18px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[0, 1, 2].map(j => (
                <span key={j} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.6, animation: `bounce 1s ease-in-out ${j * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-card)', border: 'var(--border-card)', borderRadius: '16px', padding: '8px 8px 8px 20px', alignItems: 'flex-end' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything... (Enter to send)"
          rows={1}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text-main)', fontSize: '14px', resize: 'none', lineHeight: 1.6,
            fontFamily: 'var(--font-body)', padding: '8px 0', maxHeight: '120px', overflowY: 'auto'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="btn-primary"
          style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
        >
          <Send size={16} />
        </button>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </div>
  );
};

export default AITutor;
