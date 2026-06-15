import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Maximize, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HologramViewer = () => {
  const navigate = useNavigate();

  const videoTopRef = useRef(null);
  const videoBottomRef = useRef(null);
  const videoLeftRef = useRef(null);
  const videoRightRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const getRefs = () => [videoTopRef, videoBottomRef, videoLeftRef, videoRightRef];

  const handlePlayPause = () => {
    const refs = getRefs();
    if (isPlaying) {
      refs.forEach(ref => ref.current?.pause());
      setIsPlaying(false);
    } else {
      // Sync timestamps to prevent drifting
      const primaryTime = videoBottomRef.current ? videoBottomRef.current.currentTime : 0;
      refs.forEach(ref => {
        if (ref.current) {
          ref.current.currentTime = primaryTime;
          ref.current.play().catch(e => console.warn('Autoplay block:', e));
        }
      });
      setIsPlaying(true);
    }
  };

  const handleToggleFullscreen = () => {
    const container = document.getElementById('hologram-viewport-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Sync seek events from bottom video to others
  const handleTimeUpdate = () => {
    if (!isPlaying) return; // Only sync on active seek or initial play
    const primaryTime = videoBottomRef.current ? videoBottomRef.current.currentTime : 0;
    const refs = [videoTopRef, videoLeftRef, videoRightRef];
    refs.forEach(ref => {
      if (ref.current && Math.abs(ref.current.currentTime - primaryTime) > 0.3) {
        ref.current.currentTime = primaryTime;
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-slide-up">
      
      {/* Header Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate('/dashboard')}
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
              LAB EXPERIMENT
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px' }}>✨ 3D Hologram Projector</h2>
          </div>
        </div>

        {/* Sync Controls */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: '10px 16px' }}
          >
            <Info size={16} />
            <span>{showInstructions ? 'Hide Help' : 'Instructions'}</span>
          </button>
          <button
            onClick={handlePlayPause}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: '10px 16px' }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Pause Loop' : 'Play Loop'}</span>
          </button>
          <button
            onClick={handleToggleFullscreen}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: '10px 16px', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
          >
            <Maximize size={16} />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showInstructions ? '3fr 1.2fr' : '1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Hologram Projector Screen */}
        <div 
          id="hologram-viewport-container"
          style={{
            background: '#000000',
            borderRadius: '16px',
            border: '2px solid rgba(255,255,255,0.05)',
            position: 'relative',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            overflow: 'hidden'
          }}
        >
          {/* Centering cross guides */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '1px',
            background: 'rgba(255,255,255,0.04)',
            zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute',
            width: '1px',
            height: '100%',
            background: 'rgba(255,255,255,0.04)',
            zIndex: 1
          }}></div>

          {/* Quad Video Array */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            
            {/* Top Video (Rotated 180) */}
            <video
              ref={videoTopRef}
              src="/hologram.mp4"
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: '6%',
                width: '32%',
                transform: 'rotate(180deg)',
                borderRadius: '8px'
              }}
            />

            {/* Bottom Video (Rotated 0) */}
            <video
              ref={videoBottomRef}
              src="/hologram.mp4"
              loop
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              style={{
                position: 'absolute',
                bottom: '6%',
                width: '32%',
                borderRadius: '8px'
              }}
            />

            {/* Left Video (Rotated 90) */}
            <video
              ref={videoLeftRef}
              src="/hologram.mp4"
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                left: '6%',
                width: '32%',
                transform: 'rotate(90deg)',
                borderRadius: '8px'
              }}
            />

            {/* Right Video (Rotated -90) */}
            <video
              ref={videoRightRef}
              src="/hologram.mp4"
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                right: '6%',
                width: '32%',
                transform: 'rotate(-90deg)',
                borderRadius: '8px'
              }}
            />

            {/* Center target (where to place the plastic prism) */}
            <div style={{
              width: '60px',
              height: '60px',
              border: '1px dashed rgba(0, 245, 212, 0.25)',
              borderRadius: '50%',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0, 245, 212, 0.05)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: 'var(--secondary)',
                borderRadius: '50%',
                opacity: 0.3
              }}></div>
            </div>
          </div>
        </div>

        {/* Instructions Panel */}
        {showInstructions && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
              <span>How to Use</span>
            </h3>
            
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              This page displays a looping projection video duplicated in four quadrants. Place a transparent plastic prism (upside-down pyramid) in the center of the screen to refract the light rays and create a floating 3D illusion!
            </p>

            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Create Your DIY Prism:</h4>
            <ol style={{ fontSize: '13px', color: 'var(--text-muted)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.4 }}>
              <li>Cut out 4 identical trapezoids from clear plastic packaging (CD case or plastic folder).</li>
              <li>Dimensions: Bottom edge: 6cm, Top edge: 1cm, Height: 3.5cm.</li>
              <li>Tape the four trapezoids together to form a pyramid with a cut-off tip.</li>
              <li>Turn screen brightness to 100%, enter Fullscreen, and place the prism upside-down (small opening down) right in the center dot.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default HologramViewer;
