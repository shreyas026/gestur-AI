import React, { useState, useEffect, useRef } from 'react';
import './Landing.css';

export default function LandingPage({ onEnter, authUser }) {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Bridging the gap between spoken words and sign language.";
  
  // Reference for the AI Particle Canvas
  const canvasRef = useRef(null);

  // 1. Dynamic Typing Effect
  useEffect(() => {
    let index = 0;
    setDisplayText(""); 
    
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 2. AI Particle Simulator Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const particles = [];
    const particleCount = Math.min(window.innerWidth / 12, 100);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168, 85, 247, ${1 - distance / 120})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="landing-container">
      
      {/* 🧠 AI PARTICLE CANVAS */}
      <canvas ref={canvasRef} className="particle-network"></canvas>

      {/* 🧭 NAVIGATION (Clerk components removed) */}
      <nav className="landing-nav glass-nav">
        <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => { if(authUser) onEnter(); }}>
          <h2>GesturAI</h2>
        </div>
        
        <div className="nav-links">
          <a href="#mission">Vision</a>
          <a href="#engine">How it Works</a>
          <a href="#features">Features</a>
        </div>

        <div className="nav-actions">
          {authUser ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginRight: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>{authUser.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{authUser.email}</span>
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: 'white',
                  boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)'
                }}>
                  {authUser.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <button className="nav-cta" onClick={onEnter}>Go to App ➔</button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={onEnter}>Log In</button>
              <button className="nav-cta" onClick={onEnter}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      <div className="landing-content">
        
        {/* 🚀 HERO SECTION */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">Next-Gen Accessibility</div>
            <h1 className="hero-title">Communication,<br/>Without Barriers.</h1>
            <p className="hero-subtitle">{displayText}<span className="cursor">|</span></p>
            
            <button className="cta-button pulse" onClick={onEnter}>
              Launch App ➔
            </button>
          </div>
        </section>

        {/* 🌍 MISSION SECTION */}
        <section id="mission" className="mission-section glass-panel-landing">
          <h2>The Vision Behind GesturAI</h2>
          <p>
            Millions of people rely on sign language as their primary mode of communication. 
            GesturAI was built to instantly translate everyday spoken language into fluid, 
            easy-to-understand sign language using authentic human video mapping and real-time AI context generation. 
            Our goal is to make the digital and physical world accessible to everyone.
          </p>
        </section>

        {/* ⚙️ HOW IT WORKS SECTION */}
        <section id="engine" className="how-it-works-section">
          <h2 className="section-title">How The Engine Works</h2>
          <div className="steps-container">
            
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>RAG Context Engine</h3>
              <p>Your input is analyzed using Retrieval-Augmented Generation to understand the true context and map synonyms.</p>
            </div>
            
            <div className="step-line"></div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Gloss Conversion</h3>
              <p>The AI translates standard English grammar into native Sign Language syntax (e.g., Time-Topic-Comment structure).</p>
            </div>
            
            <div className="step-line"></div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Asset Retrieval</h3>
              <p>The backend queries our database to fetch exact authentic human video clips matching the gloss sequence.</p>
            </div>

            <div className="step-line"></div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Dynamic Stitching</h3>
              <p>Our Double-Buffering web engine seamlessly stacks and preloads videos for a zero-latency playback experience.</p>
            </div>

          </div>
        </section>

        {/* ✨ FEATURES SECTION */}
        <section id="features" className="features-section">
          <h2 className="section-title">Core Capabilities</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Zero Latency Playback</h3>
              <p>Experience seamless video transitions. Our stacked-player architecture preloads the next sign while the current one plays.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Authentic Human Signing</h3>
              <p>Experience clear, emotionally resonant sign language performed by real humans, capturing nuances and facial expressions.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Universal Access</h3>
              <p>Built purely for the web. No heavy applications to install. Just open your browser and start communicating instantly.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Smart AI Parsing</h3>
              <p>Our intelligent engine understands context, stripping away filler words to match natural sign language phrasing.</p>
            </div>
          </div>
        </section>

      </div>

      {/* 🦶 FOOTER */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} GesturAI. Built to connect the world.</p>
      </footer>
    </div>
  );
}
