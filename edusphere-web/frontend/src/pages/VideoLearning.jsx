import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';

const VideoLearning = () => {
  const { subjectName, topicName } = useParams();
  const navigate = useNavigate();

  const decodedSubject = decodeURIComponent(subjectName);
  const decodedTopic = decodeURIComponent(topicName);

  // Helper to extract video ID from YouTube watch link
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Replicating getVideosForTopic from Android
  const getVideosForTopic = (topic) => {
    switch (topic) {
      case 'Wave-Particle Duality':
        return [
          { title: "⭐ Wave-Particle Duality Explained", description: "Best beginner explanation", url: "https://www.youtube.com/watch?v=Iuv6hY6zsd0" },
          { title: "Double Slit Experiment", description: "The most famous quantum experiment", url: "https://www.youtube.com/watch?v=Q1YqgPAtzho" },
          { title: "Quantum Physics for Beginners", description: "Simple visual explanation", url: "https://www.youtube.com/watch?v=p7bzE1E5PMY" },
          { title: "Wave Nature of Light", description: "Light behaves as a wave", url: "https://www.youtube.com/watch?v=H6QHkBblSuY" }
        ];
      case "Schrödinger's Equation":
        return [
          { title: "⭐ Schrödinger Equation Explained", description: "Clear step by step", url: "https://www.youtube.com/watch?v=QeUMFo8sODk" },
          { title: "Schrödinger's Cat", description: "Famous thought experiment", url: "https://www.youtube.com/watch?v=IOYyCHGWJq4" },
          { title: "Quantum Wave Function", description: "What the wave function means", url: "https://www.youtube.com/watch?v=p7bzE1E5PMY" },
          { title: "Quantum Mechanics Full Course", description: "Complete beginner course", url: "https://www.youtube.com/watch?v=8mi0PoPvLvs" }
        ];
      case 'Quantum Entanglement':
        return [
          { title: "⭐ Quantum Entanglement Explained", description: "Clear and simple", url: "https://www.youtube.com/watch?v=JFozGfxmi8A" },
          { title: "Einstein's Spooky Action", description: "Entanglement and Einstein", url: "https://www.youtube.com/watch?v=ZuvK-od647c" },
          { title: "Entanglement in 5 Minutes", description: "Quick overview", url: "https://www.youtube.com/watch?v=5_0o2fJhtSc" },
          { title: "Quantum Teleportation", description: "How quantum teleportation works", url: "https://www.youtube.com/watch?v=DxQK1WDYI_k" }
        ];
      case 'Heisenberg Uncertainty Principle':
        return [
          { title: "⭐ Uncertainty Principle Explained", description: "Heisenberg made simple", url: "https://www.youtube.com/watch?v=TQKELOE9eY4" },
          { title: "Why Quantum Mechanics is Weird", description: "Uncertainty explained", url: "https://www.youtube.com/watch?v=Usu9xZfabPM" },
          { title: "Position vs Momentum", description: "The core trade-off", url: "https://www.youtube.com/watch?v=a8FTr2qMutA" },
          { title: "Quantum Mechanics Overview", description: "Full quantum intro", url: "https://www.youtube.com/watch?v=8mi0PoPvLvs" }
        ];
      case 'Quantum Tunneling':
        return [
          { title: "⭐ Quantum Tunneling Explained", description: "How particles pass through walls", url: "https://www.youtube.com/watch?v=WItItIB5CjA" },
          { title: "Tunneling in Electronics", description: "Real world applications", url: "https://www.youtube.com/watch?v=cTodS8hkSDg" },
          { title: "Nuclear Fusion and Tunneling", description: "Tunneling in stars", url: "https://www.youtube.com/watch?v=Usu9xZfabPM" },
          { title: "Quantum Physics Documentary", description: "Full documentary", url: "https://www.youtube.com/watch?v=CBrsWPCp_rs" }
        ];
      case 'Superposition':
        return [
          { title: "⭐ Quantum Superposition Explained", description: "Being in two states at once", url: "https://www.youtube.com/watch?v=RlXdsyctD50" },
          { title: "Superposition and Measurement", description: "What happens when we look", url: "https://www.youtube.com/watch?v=p7bzE1E5PMY" },
          { title: "Schrödinger's Cat", description: "Famous superposition example", url: "https://www.youtube.com/watch?v=IOYyCHGWJq4" },
          { title: "Quantum Computing Basics", description: "Superposition in computers", url: "https://www.youtube.com/watch?v=jHoEjvuPoB8" }
        ];
      case 'Black Holes':
        return [
          { title: "⭐ Black Holes Explained", description: "Best black hole video", url: "https://www.youtube.com/watch?v=e-P5IFTqB98" },
          { title: "Inside a Black Hole", description: "What really happens inside", url: "https://www.youtube.com/watch?v=yWO-cvGETRQ" },
          { title: "Black Hole Size Comparison", description: "Visual size comparison", url: "https://www.youtube.com/watch?v=Iy7NzjCmUf0" },
          { title: "Hawking Radiation Explained", description: "Stephen Hawking's theory", url: "https://www.youtube.com/watch?v=qPKj0YnKANw" }
        ];
      case 'The Big Bang':
        return [
          { title: "⭐ Big Bang Theory Explained", description: "Origin of the universe", url: "https://www.youtube.com/watch?v=wNDGgL73ihY" },
          { title: "Universe Timeline", description: "From Big Bang to now", url: "https://www.youtube.com/watch?v=HdPzOWlLrbE" },
          { title: "What Came Before Big Bang", description: "Mind-blowing concepts", url: "https://www.youtube.com/watch?v=YBfNBxPRZFc" },
          { title: "Cosmic Microwave Background", description: "Evidence for Big Bang", url: "https://www.youtube.com/watch?v=3tCMd1ytvWg" }
        ];
      case 'Skeletal System':
        return [
          { title: "⭐ Human Skeletal System", description: "Complete overview", url: "https://www.youtube.com/watch?v=s3uNDMFmkm0" },
          { title: "Bones of the Body", description: "All major bones explained", url: "https://www.youtube.com/watch?v=NbgkBP8Plso" },
          { title: "How Bones Grow", description: "Bone development process", url: "https://www.youtube.com/watch?v=dC80IXQZPGU" },
          { title: "Joints and Movement", description: "How joints work", url: "https://www.youtube.com/watch?v=2TKKbP_YXSQ" }
        ];
      case 'Muscular System':
        return [
          { title: "⭐ Muscular System Explained", description: "Complete muscle overview", url: "https://www.youtube.com/watch?v=VVL-8zr2hk4" },
          { title: "How Muscles Contract", description: "Muscle contraction mechanism", url: "https://www.youtube.com/watch?v=GrHsiHazpsw" },
          { title: "Types of Muscles", description: "Cardiac skeletal and smooth", url: "https://www.youtube.com/watch?v=B4gA9fABlHI" },
          { title: "Muscle Growth Science", description: "How muscles grow stronger", url: "https://www.youtube.com/watch?v=2tM1LFFxeKg" }
        ];
      case 'Nervous System':
        return [
          { title: "⭐ Nervous System Overview", description: "Complete guide", url: "https://www.youtube.com/watch?v=44B0ms3XPKU" },
          { title: "How Neurons Work", description: "Brain cell communication", url: "https://www.youtube.com/watch?v=WhowH0kb7n0" },
          { title: "Brain Structure Explained", description: "Parts of the brain", url: "https://www.youtube.com/watch?v=tLAEzGbLwmA" },
          { title: "Reflex Actions", description: "How reflexes work", url: "https://www.youtube.com/watch?v=rnhEoB8CqHw" }
        ];
      case 'Cardiovascular System':
        return [
          { title: "⭐ How the Heart Works", description: "Best heart explanation", url: "https://www.youtube.com/watch?v=CWFyxn0qDEU" },
          { title: "Blood Circulation", description: "Full circulation explained", url: "https://www.youtube.com/watch?v=P7pBMNRm6TU" },
          { title: "Heart Anatomy 3D", description: "Inside the human heart", url: "https://www.youtube.com/watch?v=4DPXH9BJ6bg" },
          { title: "Blood Vessels", description: "Arteries veins capillaries", url: "https://www.youtube.com/watch?v=yN_YMZhMBCg" }
        ];
      case 'Digestive System':
        return [
          { title: "⭐ Digestive System Explained", description: "How food is processed", url: "https://www.youtube.com/watch?v=Og5xAdC8EUI" },
          { title: "Journey of Food", description: "From mouth to intestine", url: "https://www.youtube.com/watch?v=1sISguPDlhY" },
          { title: "Stomach and Digestion", description: "How stomach works", url: "https://www.youtube.com/watch?v=3_BHPK4c3gU" },
          { title: "Gut Microbiome", description: "Bacteria in your gut", url: "https://www.youtube.com/watch?v=VzPD009qTN4" }
        ];
      case 'Brain Structure':
        return [
          { title: "⭐ Human Brain Explained", description: "Complete brain guide", url: "https://www.youtube.com/watch?v=tLAEzGbLwmA" },
          { title: "How Memory Works", description: "Memory formation in brain", url: "https://www.youtube.com/watch?v=bSaD-jQaXgs" },
          { title: "Left vs Right Brain", description: "Brain hemisphere explained", url: "https://www.youtube.com/watch?v=ZMSbDwpIyF4" },
          { title: "Neuroscience Basics", description: "Brain science for beginners", url: "https://www.youtube.com/watch?v=qPKj0YnKANw" }
        ];
      default:
        // Dynamic search results fallback links (matching Android search links logic)
        return [
          {
            title: `⭐ Search: ${topic} Explained`,
            description: "Tap to search YouTube",
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+explained`
          },
          {
            title: `${topic} Full Lecture`,
            description: "University lecture",
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+lecture`
          },
          {
            title: `${topic} Animation`,
            description: "Visual animated explanation",
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+animation`
          },
          {
            title: `${topic} Tutorial`,
            description: "Step by step tutorial",
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+tutorial`
          }
        ];
    }
  };

  const videos = getVideosForTopic(decodedTopic);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-slide-up">
      {/* Navigation Header */}
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
            VIDEO LECTURES
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px' }}>🎬 {decodedTopic} Videos</h2>
        </div>
      </div>

      {/* Grid of video embeds / cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '28px'
      }} className="video-grid">
        {videos.map((vid, idx) => {
          const videoId = getYouTubeId(vid.url);

          return (
            <div key={idx} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
              
              {/* Responsive Embedded YouTube Player */}
              {videoId ? (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                  <iframe
                    title={vid.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0
                    }}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                // If it is a results/search page link, render a beautiful link card
                <div style={{
                  height: '200px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  <Play size={32} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Search link (No direct embed available)</span>
                </div>
              )}

              {/* Title & Description */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>{vid.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{vid.description}</p>
                </div>
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                    flexShrink: 0
                  }}
                  title="Open on YouTube"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 576px) {
          .video-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoLearning;
