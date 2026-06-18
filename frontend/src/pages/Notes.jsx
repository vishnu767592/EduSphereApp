import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Printer, FileDown } from 'lucide-react';
import Loader from '../components/Loader';

const Notes = () => {
  const { subjectName, topicName } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const decodedSubject = decodeURIComponent(subjectName);
  const decodedTopic = decodeURIComponent(topicName);

  const [notesText, setNotesText] = useState('');
  const [definition, setDefinition] = useState('');
  const [formulas, setFormulas] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [examTips, setExamTips] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/ai/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ topic: decodedTopic })
        });
        if (response.ok) {
          const data = await response.json();
          const rawNotes = data.notes;
          setNotesText(rawNotes);
          parseNotes(rawNotes);
        } else {
          setNotesText('Failed to load notes.');
        }
      } catch (err) {
        console.error('Notes loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [decodedTopic, token]);

  // Replicating parseAndDisplayNotes from Android
  const parseNotes = (text) => {
    try {
      const defStart = text.indexOf("DEFINITION:") + 11;
      const defEnd = text.indexOf("KEY FORMULAS");
      const def = (defStart > 10 && defEnd > defStart) ? text.substring(defStart, defEnd).trim() : "";

      const formulaStart = text.indexOf("KEY FORMULAS OR FACTS:") + 22;
      const formulaEnd = text.indexOf("KEY POINTS:");
      const form = (formulaStart > 21 && formulaEnd > formulaStart) ? text.substring(formulaStart, formulaEnd).trim() : "";

      const keyStart = text.indexOf("KEY POINTS:") + 11;
      const keyEnd = text.indexOf("SUMMARY:");
      const key = (keyStart > 10 && keyEnd > keyStart) ? text.substring(keyStart, keyEnd).trim() : "";

      const sumStart = text.indexOf("SUMMARY:") + 8;
      const sumEnd = text.indexOf("EXAM TIPS:");
      const sum = (sumStart > 7 && sumEnd > sumStart) ? text.substring(sumStart, sumEnd).trim() : "";

      const tipStart = text.indexOf("EXAM TIPS:") + 10;
      const tip = (tipStart > 9) ? text.substring(tipStart).trim() : "";

      setDefinition(def);
      setFormulas(form);
      setKeyPoints(key);
      setSummaryText(sum);
      setExamTips(tip);
    } catch (e) {
      console.warn('Parsing study notes failed, showing raw content:', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([notesText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${decodedTopic.replace(/\s+/g, '_')}_Study_Notes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return <Loader message={`Generating study notes for ${decodedTopic}...`} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-slide-up print-area">
      {/* Navigation Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate(`/learning/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(decodedTopic)}`)}
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
              STUDY NOTES
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px' }}>📓 {decodedTopic} Notes</h2>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleDownloadTxt}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: '10px 16px' }}
          >
            <FileDown size={16} />
            <span>Download .TXT</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: '10px 16px' }}
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Print Layout Card */}
      <div className="glass-panel" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Topic Banner */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{decodedTopic} Study Guide</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Subject: {decodedSubject}</span>
        </div>

        {/* Structured Sections */}
        {definition || formulas || keyPoints || summaryText || examTips ? (
          <>
            {/* Definition */}
            {definition && (
              <div>
                <h4 style={{ color: 'var(--primary)', fontSize: '18px', marginBottom: '8px' }}>📖 Definition</h4>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.6, fontSize: '15px' }}>{definition}</p>
              </div>
            )}

            {/* Key Formulas */}
            {formulas && (
              <div>
                <h4 style={{ color: 'var(--secondary)', fontSize: '18px', marginBottom: '8px' }}>🔢 Key Formulas & Facts</h4>
                <div style={{
                  color: 'var(--text-main)',
                  lineHeight: 1.7,
                  fontSize: '15px',
                  whiteSpace: 'pre-wrap',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>{formulas}</div>
              </div>
            )}

            {/* Key Points */}
            {keyPoints && (
              <div>
                <h4 style={{ color: 'var(--accent)', fontSize: '18px', marginBottom: '8px' }}>🔑 Key Points to Remember</h4>
                <div style={{
                  color: 'var(--text-main)',
                  lineHeight: 1.7,
                  fontSize: '15px',
                  whiteSpace: 'pre-wrap'
                }}>{keyPoints}</div>
              </div>
            )}

            {/* Summary */}
            {summaryText && (
              <div>
                <h4 style={{ color: '#FFD166', fontSize: '18px', marginBottom: '8px' }}>📋 Summary</h4>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.6, fontSize: '15px' }}>{summaryText}</p>
              </div>
            )}

            {/* Exam Tips */}
            {examTips && (
              <div style={{
                background: 'rgba(124, 106, 247, 0.08)',
                border: '1px solid rgba(124, 106, 247, 0.15)',
                padding: '20px',
                borderRadius: '12px'
              }}>
                <h4 style={{ color: 'var(--primary)', fontSize: '18px', marginBottom: '8px' }}>💡 Exam Tips</h4>
                <div style={{
                  color: 'var(--text-main)',
                  lineHeight: 1.6,
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap'
                }}>{examTips}</div>
              </div>
            )}
          </>
        ) : (
          // Fallback raw text output
          <div style={{
            color: 'var(--text-main)',
            fontSize: '15px',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap'
          }}>
            {notesText}
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .glass-panel {
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            color: black !important;
          }
          .glass-panel * {
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Notes;
