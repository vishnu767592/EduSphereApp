import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Clock, Award, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import Loader from '../components/Loader';

const Quiz = () => {
  const { subjectName, topicName } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const decodedSubject = decodeURIComponent(subjectName);
  const decodedTopic = decodeURIComponent(topicName);

  // Local static questions repository mapping to Android getQuestionsForTopic
  const getQuestionsForTopic = (topic) => {
    switch (topic) {
      case 'Wave-Particle Duality':
        return [
          {
            question: "What does wave-particle duality state?",
            options: [
              "Light is only a wave",
              "Matter has both wave and particle properties",
              "Particles can only be waves",
              "None of the above"
            ],
            correctIndex: 1
          },
          {
            question: "Who proposed the wave nature of electrons?",
            options: [
              "Albert Einstein",
              "Isaac Newton",
              "Louis de Broglie",
              "Niels Bohr"
            ],
            correctIndex: 2
          }
        ];
      case "Schrödinger's Equation":
        return [
          {
            question: "What does the Schrödinger wave function (Ψ) represent?",
            options: [
              "Exact position of a particle",
              "Probability amplitude of finding a particle",
              "Velocity of an electron",
              "Classical energy of a system"
            ],
            correctIndex: 1
          },
          {
            question: "Which of the following is true for a stationary state?",
            options: [
              "Its probability density changes with time",
              "Its probability density remains constant in time",
              "The wave function does not oscillate",
              "The energy of the particle is zero"
            ],
            correctIndex: 1
          }
        ];
      default:
        // Generic fallback questions
        return [
          {
            question: `Which field of science is most concerned with ${topic}?`,
            options: [
              "Classical Mechanics",
              "Conceptual Research & Development",
              "Organic Chemistry Synthesizers",
              "Macro-Environmental Geography"
            ],
            correctIndex: 1
          },
          {
            question: `What is the primary key resource to learn more about ${topic}?`,
            options: [
              "EduSphere 3D & AI study systems",
              "Basic search engine results",
              "Old catalog books",
              "Standard music streaming files"
            ],
            correctIndex: 0
          }
        ];
    }
  };

  const questions = getQuestionsForTopic(decodedTopic);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);

  // Starts the 30 seconds question timer
  useEffect(() => {
    if (quizFinished) return;

    setTimeLeft(30);
    setAnswered(false);
    setSelectedAnswer(-1);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, quizFinished]);

  const handleTimeOut = () => {
    setAnswered(true);
    // Move to next question after delay
    setTimeout(() => {
      advanceQuestion();
    }, 1500);
  };

  const selectOption = (idx) => {
    if (answered) return;
    setSelectedAnswer(idx);
  };

  const handleNextSubmit = () => {
    if (selectedAnswer === -1) {
      alert('Please select an option to continue!');
      return;
    }
    clearInterval(timerRef.current);
    setAnswered(true);

    const q = questions[currentIndex];
    const isCorrect = selectedAnswer === q.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      advanceQuestion(isCorrect);
    }, 1200);
  };

  const advanceQuestion = (lastWasCorrect) => {
    if (currentIndex + 1 >= questions.size || currentIndex + 1 >= questions.length) {
      finishQuiz(lastWasCorrect);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const finishQuiz = async (lastWasCorrect) => {
    setQuizFinished(true);
    setSubmitting(true);
    
    // Calculate final score counting the last question
    const finalScore = score + (lastWasCorrect ? 1 : 0);

    if (!token) return;
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject_name: decodedSubject,
          topic_name: decodedTopic,
          score: finalScore,
          total: questions.length
        })
      });
    } catch (err) {
      console.error('Failed to submit quiz scores to API:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(-1);
    setAnswered(false);
    setQuizFinished(false);
  };

  // Result parameters
  const getResultsDetails = () => {
    const percentage = Math.round((score * 100) / questions.length);
    let emoji = '🏆';
    let message = 'Excellent! You mastered this topic!';
    let color = 'var(--difficulty-beginner)';

    if (percentage >= 90) {
      emoji = '🏆';
      message = 'Excellent! You mastered this topic!';
    } else if (percentage >= 70) {
      emoji = '⭐';
      message = 'Great job! Keep it up!';
      color = 'var(--primary)';
    } else if (percentage >= 50) {
      emoji = '👍';
      message = 'Good effort! Review and try again!';
      color = 'var(--difficulty-intermediate)';
    } else {
      emoji = '📚';
      message = "Keep studying! You'll get better!";
      color = 'var(--difficulty-advanced)';
    }

    return { percentage, emoji, message, color };
  };

  // Render Result Page
  if (quizFinished) {
    const { percentage, emoji, message, color } = getResultsDetails();
    return (
      <div style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} className="animate-fade-in">
        <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', textAlign: 'center', padding: '36px' }}>
          <span style={{ fontSize: '60px', display: 'block', marginBottom: '16px' }}>{emoji}</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Quiz Completed!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>{decodedTopic}</p>

          {/* Large circular percent summary */}
          <div style={{
            position: 'relative',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            border: `6px solid rgba(255,255,255,0.06)`,
            borderTopColor: color,
            margin: '0 auto 28px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${color}1a`
          }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: color }}>{percentage}%</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Score: {score}/{questions.length}</span>
          </div>

          <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)', marginBottom: '32px', padding: '0 10px' }}>
            {message}
          </p>

          {/* Redirect Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={restartQuiz}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <RotateCcw size={16} />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => navigate(`/learning/${encodeURIComponent(decodedSubject)}`)}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderColor: 'var(--primary)' }}
            >
              <ArrowLeft size={16} />
              <span>Return to Subject</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Home size={16} />
              <span>Dashboard Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) * 100) / questions.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-slide-up">
      {/* Quiz Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
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
              INTERACTIVE ASSESSMENT
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginTop: '2px' }}>📝 {decodedTopic} Quiz</h2>
          </div>
        </div>

        {/* Timer Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: timeLeft <= 10 ? 'rgba(244, 67, 54, 0.12)' : 'rgba(124, 106, 247, 0.12)',
          border: timeLeft <= 10 ? '1px solid rgba(244, 67, 54, 0.2)' : '1px solid rgba(124, 106, 247, 0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          color: timeLeft <= 10 ? 'var(--difficulty-advanced)' : 'var(--primary)',
          fontSize: '14px',
          fontWeight: 700,
          transition: 'background 0.3s ease'
        }}>
          <Clock size={16} />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Progress metrics */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'var(--primary-gradient)',
            borderRadius: '3px',
            transition: 'width 0.4s ease'
          }}></div>
        </div>
      </div>

      {/* Question Panel */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.5, marginBottom: '24px' }}>
          {q.question}
        </h3>

        {/* Options container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {q.options.map((option, idx) => {
            // Options coloring states after answering
            let background = 'rgba(255,255,255,0.03)';
            let borderColor = 'rgba(255,255,255,0.08)';
            let color = 'var(--text-main)';
            let icon = null;

            if (answered) {
              if (idx === q.correctIndex) {
                // Correct option in Green
                background = 'rgba(76, 175, 80, 0.15)';
                borderColor = 'var(--difficulty-beginner)';
                color = 'var(--difficulty-beginner)';
                icon = <CheckCircle size={16} style={{ flexShrink: 0 }} />;
              } else if (idx === selectedAnswer) {
                // Selected incorrect option in Red
                background = 'rgba(244, 67, 54, 0.15)';
                borderColor = 'var(--difficulty-advanced)';
                color = 'var(--difficulty-advanced)';
                icon = <XCircle size={16} style={{ flexShrink: 0 }} />;
              }
            } else if (idx === selectedAnswer) {
              // Option is currently selected
              background = 'rgba(124, 106, 247, 0.15)';
              borderColor = 'var(--primary)';
            }

            return (
              <div
                key={idx}
                onClick={() => selectOption(idx)}
                style={{
                  background,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: '10px',
                  padding: '16px 20px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color,
                  cursor: answered ? 'default' : 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background var(--transition-fast), border var(--transition-fast)'
                }}
                className={!answered ? 'quiz-option' : ''}
              >
                <span>{option}</span>
                {icon}
              </div>
            );
          })}
        </div>

        {/* Action button */}
        {!answered ? (
          <button
            onClick={handleNextSubmit}
            className="btn-primary"
            style={{ width: '100%', marginTop: '28px', height: '46px' }}
          >
            Submit Answer
          </button>
        ) : (
          <div style={{
            height: '46px',
            marginTop: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Checking answer, moving forward...
          </div>
        )}
      </div>

      <style>{`
        .quiz-option:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
};

export default Quiz;
