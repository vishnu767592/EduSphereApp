import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const QUESTIONS_DB = {
  'Wave-Particle Duality': [
    { q: 'What does wave-particle duality state?', options: ['Light is only a wave', 'Matter has both wave and particle properties', 'Matter is only a wave', 'Particles can only be waves'], ans: 1 },
    { q: 'Who proposed the matter wave theory?', options: ['Einstein', 'Newton', 'Louis de Broglie', 'Niels Bohr'], ans: 2 },
    { q: 'Which experiment demonstrated light\'s wave nature?', options: ['Photoelectric effect', 'Double-slit experiment', 'Rutherford scattering', 'Oil drop experiment'], ans: 1 },
    { q: 'A photon is a discrete packet of?', options: ['Electricity', 'Magnetic field', 'Electromagnetic energy', 'Atomic mass'], ans: 2 },
    { q: 'The de Broglie wavelength is inversely proportional to?', options: ['Heat', 'Color', 'Momentum', 'Atomic number'], ans: 2 },
  ],
  'Black Holes': [
    { q: 'A black hole is formed when?', options: ['A planet explodes', 'A massive star collapses', 'Two galaxies collide', 'Light is trapped in a mirror'], ans: 1 },
    { q: "What is the 'point of no return' called?", options: ['Singularity', 'The Core', 'Event Horizon', 'Outer Rim'], ans: 2 },
    { q: 'What is hypothesized to be at the center of a black hole?', options: ['A new sun', 'A singularity', 'Empty space', 'A neutron star'], ans: 1 },
    { q: 'Who theorized that black holes emit radiation?', options: ['Albert Einstein', 'Stephen Hawking', 'Isaac Newton', 'Edwin Hubble'], ans: 1 },
    { q: 'Supermassive black holes are typically found?', options: ['In asteroid belts', 'Near the sun', 'At the centers of galaxies', 'In dark nebulae'], ans: 2 },
  ],
  'Skeletal System': [
    { q: 'How many bones does an average adult human have?', options: ['186', '206', '226', '256'], ans: 1 },
    { q: 'What is the hardest substance in the human body?', options: ['Bone', 'Tooth enamel', 'Cartilage', 'Muscle tissue'], ans: 1 },
    { q: 'Which bone is the longest in the human body?', options: ['Tibia', 'Humerus', 'Femur', 'Fibula'], ans: 2 },
    { q: 'Where is the smallest bone in the human body located?', options: ['Hand', 'Foot', 'Middle ear', 'Nose'], ans: 2 },
    { q: 'What is the primary mineral stored in bones?', options: ['Iron', 'Calcium', 'Potassium', 'Zinc'], ans: 1 },
  ],
  'Artificial Intelligence': [
    { q: "What does the 'A' in AI stand for?", options: ['Automated', 'Artificial', 'Advanced', 'Applied'], ans: 1 },
    { q: "Which test determines a machine's ability to exhibit intelligent behavior?", options: ['Voight-Kampff test', 'Turing Test', 'IQ Test', 'Rorschach test'], ans: 1 },
    { q: 'Machine Learning is a subset of?', options: ['Data entry', 'Web development', 'Artificial Intelligence', 'Graphic design'], ans: 2 },
    { q: "A 'Neural Network' is inspired by?", options: ['The human brain', 'Computer hardware', 'Social networks', 'Electric grids'], ans: 0 },
    { q: 'Which programming language is most commonly used for AI?', options: ['C++', 'Java', 'Python', 'JavaScript'], ans: 2 },
  ],
  'Computer Science': [
    { q: "What is considered the 'brain' of a computer?", options: ['RAM', 'Hard Drive', 'CPU', 'Motherboard'], ans: 2 },
    { q: 'Which of these is a non-volatile storage device?', options: ['RAM', 'Cache', 'SSD', 'Registers'], ans: 2 },
    { q: 'What does HTTP stand for?', options: ['High Text Transfer Protocol', 'HyperText Transfer Protocol', 'Hyper Transfer Text Process', 'Home Tool Text Protocol'], ans: 1 },
    { q: "In programming, a 'loop' is used to?", options: ['Save data', 'Repeat instructions', 'Connect to the internet', 'Delete files'], ans: 1 },
    { q: '1 Gigabyte (GB) is approximately equal to?', options: ['1000 Megabytes', '1024 Megabytes', '100 Megabytes', '1024 Kilobytes'], ans: 1 },
  ],
};

const getDefaultQuestions = (topic) => [
  { q: `What is the primary focus of studying '${topic}'?`, options: ['Learning the history', 'Understanding core concepts and theories', 'Mastering the art style', 'Memorizing dates'], ans: 1 },
  { q: `In the context of '${topic}', what are the most important principles?`, options: ['The ones easiest to remember', 'The fundamental laws and rules', 'The most modern ones only', 'The ones from the textbook only'], ans: 1 },
  { q: `Mastering '${topic}' usually involves?`, options: ['Just watching videos', 'Consistent study and practical application', 'A bit of luck', 'Only reading the summary'], ans: 1 },
  { q: `Why is '${topic}' considered a valuable subject?`, options: ['It is very simple', 'It provides critical insights into the field', 'It is only a hobby', 'It has no real-world use'], ans: 1 },
  { q: `How does '${topic}' relate to our daily lives?`, options: ['It has no relation', 'It influences technology, society, or nature', 'It is only for scientists', 'It is a fictional concept'], ans: 1 },
];

const Quiz = () => {
  const { topicName } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const decoded = decodeURIComponent(topicName);

  const questions = QUESTIONS_DB[decoded] || getDefaultQuestions(decoded);
  const TIMER_SECS = 30;

  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'result'
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECS);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase !== 'quiz') return;
    setTimeLeft(TIMER_SECS);
    setAnswered(false);
    setSelected(null);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleNext(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [idx, phase]);

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    clearInterval(timerRef.current);
    if (i === questions[idx].ans) setScore(s => s + 1);
    setTimeout(() => handleNext(i), 1200);
  };

  const handleNext = (sel) => {
    if (idx + 1 >= questions.length) {
      submitResult(score + (sel === questions[idx]?.ans ? 1 : 0));
      setPhase('result');
    } else {
      setIdx(i => i + 1);
    }
  };

  const submitResult = async (finalScore) => {
    if (!token) return;
    const pct = Math.round((finalScore / questions.length) * 100);
    try {
      await apiFetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topicName: decoded, score: finalScore, total: questions.length, percentage: pct }),
      });
    } catch (e) { /* silent */ }
  };

  const pct = Math.round((score / questions.length) * 100);
  const resultEmoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '👍' : '📚';
  const resultMsg = pct >= 90 ? 'Excellent! You mastered this topic!' : pct >= 70 ? 'Great job! Keep it up!' : pct >= 50 ? 'Good effort! Review and try again!' : 'Keep studying! You\'ll get better!';

  const q = questions[idx];
  const optColors = ['#7C6AF7', '#00BCD4', '#FF9800', '#E91E63'];

  if (phase === 'result') {
    return (
      <div className="animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '48px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{resultEmoji}</div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Quiz Complete!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{resultMsg}</p>
          <div style={{ fontSize: '56px', fontWeight: 900, color: 'var(--primary)', marginBottom: '8px' }}>{pct}%</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{score} / {questions.length} correct</p>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '99px', height: '8px', marginBottom: '32px' }}>
            <div style={{ background: 'var(--primary-gradient)', height: '100%', borderRadius: '99px', width: `${pct}%`, transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => { setPhase('quiz'); setIdx(0); setScore(0); }} className="btn-secondary">Retry Quiz</button>
            <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.06)', border: 'var(--border-card)', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: 'var(--text-main)' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quiz</div>
          <div style={{ fontWeight: 700, fontSize: '16px' }}>{decoded}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: `${timeLeft <= 10 ? 'rgba(244,67,54,0.1)' : 'rgba(124,106,247,0.1)'}`, padding: '8px 16px', borderRadius: '10px' }}>
          <Clock size={16} color={timeLeft <= 10 ? '#F44336' : 'var(--primary)'} />
          <span style={{ fontWeight: 700, color: timeLeft <= 10 ? '#F44336' : 'var(--primary)' }}>{timeLeft}s</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <span>Question {idx + 1} of {questions.length}</span>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Score: {score}</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '99px', height: '4px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--primary-gradient)', height: '100%', borderRadius: '99px', width: `${((idx + 1) / questions.length) * 100}%`, transition: 'width 0.3s ease' }} />
      </div>

      {/* Question card */}
      <div className="glass-panel" style={{ marginBottom: '16px', padding: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.5 }}>{q.q}</h3>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {q.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.04)';
          let border = 'var(--border-card)';
          if (answered) {
            if (i === q.ans) { bg = 'rgba(76,175,80,0.15)'; border = '1px solid #4CAF50'; }
            else if (i === selected && i !== q.ans) { bg = 'rgba(244,67,54,0.15)'; border = '1px solid #F44336'; }
          } else if (i === selected) {
            bg = 'rgba(124,106,247,0.15)'; border = '1px solid var(--primary)';
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              style={{
                background: bg, border, borderRadius: '12px', padding: '16px 20px',
                cursor: answered ? 'default' : 'pointer', color: 'var(--text-main)',
                textAlign: 'left', fontSize: '15px', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '12px',
                transition: 'all 0.2s',
              }}
            >
              <span style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                background: `${optColors[i]}20`, color: optColors[i],
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px'
              }}>
                {['A', 'B', 'C', 'D'][i]}
              </span>
              {opt}
              {answered && i === q.ans && <CheckCircle size={18} color="#4CAF50" style={{ marginLeft: 'auto' }} />}
              {answered && i === selected && i !== q.ans && <XCircle size={18} color="#F44336" style={{ marginLeft: 'auto' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;
