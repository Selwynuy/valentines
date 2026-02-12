'use client';

import { useEffect, useRef, useState } from 'react';
import '../valentine.css';

type GameState = 'START' | 'PLAYING' | 'PROPOSAL' | 'CELEBRATION' | 'PLANNER' | 'CONFIRMATION';

interface DatePlan {
  id: number;
  title: string;
  activity: string;
  date: string;
  time: string;
  location: string;
  note: string;
}

class Player {
  w = 100;
  h = 80;
  x: number;
  y: number;
  speed = 10;
  dx = 0;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth / 2 - this.w / 2;
    this.y = canvasHeight - 100;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#ff4d6d';
    ctx.beginPath();
    ctx.arc(this.x + this.w / 2, this.y, this.w / 2, 0, Math.PI, false);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = '#c9184a';
    ctx.lineWidth = 5;
    ctx.arc(this.x + this.w / 2, this.y - 10, this.w / 2, Math.PI, 0, false);
    ctx.stroke();
  }

  update(canvasWidth: number) {
    this.x += this.dx;
    if (this.x < 0) this.x = 0;
    if (this.x + this.w > canvasWidth) this.x = canvasWidth - this.w;
  }
}

class Heart {
  size: number;
  x: number;
  y: number;
  speed: number;
  color: string;

  constructor(canvasWidth: number) {
    this.size = Math.random() * 20 + 20;
    this.x = Math.random() * (canvasWidth - this.size);
    this.y = -this.size;
    this.speed = Math.random() * 3 + 2;
    this.color = `hsl(${Math.random() * 20 + 340}, 100%, 60%)`;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const topCurveHeight = this.size * 0.3;
    ctx.moveTo(this.x, this.y + topCurveHeight);
    
    ctx.bezierCurveTo(
      this.x, this.y,
      this.x - this.size / 2, this.y,
      this.x - this.size / 2, this.y + topCurveHeight
    );
    
    ctx.bezierCurveTo(
      this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2,
      this.x, this.y + (this.size + topCurveHeight) / 2,
      this.x, this.y + this.size
    );
    
    ctx.bezierCurveTo(
      this.x, this.y + (this.size + topCurveHeight) / 2,
      this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2,
      this.x + this.size / 2, this.y + topCurveHeight
    );
    
    ctx.bezierCurveTo(
      this.x + this.size / 2, this.y,
      this.x, this.y,
      this.x, this.y + topCurveHeight
    );
    
    ctx.fill();
  }

  update() {
    this.y += this.speed;
  }
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.life = 100;
    this.color = `rgba(255, 255, 255, 0.8)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life / 100;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export default function ValentineGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [noClickCount, setNoClickCount] = useState(0);
  const [openEnvelopeId, setOpenEnvelopeId] = useState<number | null>(null);
  const [hoveredEnvelopeId, setHoveredEnvelopeId] = useState<number | null>(null);
  const [chosenPlanId, setChosenPlanId] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(4);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [showSuggestionBox, setShowSuggestionBox] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const WIN_SCORE = 15;

  const datePlans: DatePlan[] = [
    {
      id: 1,
      title: "Dinner Date",
      activity: "Romantic Dinner",
      date: "2026-02-14",
      time: "7:00 PM",
      location: "Your Favorite Restaurant",
      note: "Let's enjoy a candlelit dinner together! Dress fancy! 💕"
    },
    {
      id: 2,
      title: "Movie Night",
      activity: "Cozy Movie Date",
      date: "2026-02-15",
      time: "8:00 PM",
      location: "Home Sweet Home",
      note: "Popcorn, blankets, and your favorite movies! 🍿"
    },
    {
      id: 3,
      title: "Adventure Day",
      activity: "Surprise Adventure",
      date: "2026-02-16",
      time: "10:00 AM",
      location: "It's a Surprise!",
      note: "Pack your bags for an exciting day out! 🎒✨"
    }
  ];

  const playerRef = useRef<Player | null>(null);
  const heartsRef = useRef<Heart[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (playerRef.current) {
        playerRef.current.y = canvas.height - 100;
      }
    };

    const handleInput = (e: MouseEvent | TouchEvent) => {
      if (!playerRef.current || !canvas) return;
      
      const clientX = e.type === 'mousemove' 
        ? (e as MouseEvent).clientX 
        : (e as TouchEvent).touches[0].clientX;
      
      playerRef.current.x = clientX - playerRef.current.w / 2;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleInput);
    window.addEventListener('touchmove', handleInput, { passive: false });
    resize();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleInput);
      window.removeEventListener('touchmove', handleInput);
    };
  }, []);

  useEffect(() => {
    // Auto-play music on load
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked by browser - will play after first user interaction
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'PLAYING') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spawnHeart = () => {
      if (Math.random() < 0.02) {
        heartsRef.current.push(new Heart(canvas.width));
      }
    };

    const createParticles = (x: number, y: number) => {
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(new Particle(x, y));
      }
    };

    const updateGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (playerRef.current) {
        playerRef.current.update(canvas.width);
        playerRef.current.draw(ctx);
      }

      spawnHeart();

      heartsRef.current = heartsRef.current.filter((heart, index) => {
        heart.update();
        heart.draw(ctx);

        if (
          playerRef.current &&
          heart.y + heart.size > playerRef.current.y &&
          heart.x > playerRef.current.x &&
          heart.x < playerRef.current.x + playerRef.current.w
        ) {
          createParticles(heart.x, heart.y);
          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore >= WIN_SCORE) {
              setTimeout(() => setGameState('PROPOSAL'), 500);
            }
            return newScore;
          });
          return false;
        }

        if (heart.y > canvas.height) {
          return false;
        }

        return true;
      });

      particlesRef.current = particlesRef.current.filter((p) => {
        p.update();
        p.draw(ctx);
        return p.life > 0;
      });

      animationIdRef.current = requestAnimationFrame(updateGame);
    };

    updateGame();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [gameState, WIN_SCORE]);

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    playerRef.current = new Player(canvas.width, canvas.height);
    heartsRef.current = [];
    particlesRef.current = [];
    setScore(0);
    setGameState('PLAYING');
  };

  const handleYes = () => {
    setGameState('CELEBRATION');
    setShowCountdown(false);
    setCountdown(4);
    
    // Show countdown after 3 seconds
    setTimeout(() => {
      setShowCountdown(true);
      
      // Start countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 3000);
    
    // Transition to planner after 7 seconds (3 + 4)
    setTimeout(() => {
      setGameState('PLANNER');
    }, 7000);
  };

  const handleNoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (noClickCount < 5) {
      const newCount = noClickCount + 1;
      setNoClickCount(newCount);
      
      // On the 5th click, immediately move the button away
      if (newCount === 5) {
        const button = e.currentTarget;
        const x = Math.random() * (window.innerWidth - button.offsetWidth);
        const y = Math.random() * (window.innerHeight - button.offsetHeight);
        button.style.position = 'fixed';
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
      }
    }
  };

  const moveNoButton = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (noClickCount < 5) return; // Only move after 5 clicks
    
    const button = e.currentTarget;
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.position = 'fixed';
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
  };

  const getPersuasiveText = () => {
    const messages = [
      "You caught my heart! Now I have to ask...",
      "Are you sure? I caught all those hearts for you! 💕",
      "Please reconsider... I put so much effort into this! 🥺",
      "Come on, you know you want to say yes! ❤️",
      "Think about all the hearts we caught together! 💘",
      "Last chance to click NO... or just say YES! 😊",
    ];
    return messages[noClickCount] || messages[0];
  };

  const handleEnvelopeClick = (id: number) => {
    setOpenEnvelopeId(openEnvelopeId === id ? null : id);
  };

  const handleChoosePlan = (id: number) => {
    setChosenPlanId(id);
    setOpenEnvelopeId(null);
  };

  const handleSubmitPlan = async () => {
    if (chosenPlanId) {
      const chosenPlan = datePlans.find(p => p.id === chosenPlanId);
      
      // Save response to database
      try {
        await fetch('/api/save-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accepted: true,
            chosenPlanId: chosenPlanId,
            chosenPlanTitle: chosenPlan?.title,
            suggestions: suggestion || null,
          }),
        });
      } catch (error) {
        console.error('Failed to save response:', error);
        // Continue anyway to show confirmation
      }
      
      setGameState('CONFIRMATION');
    }
  };

  const handleAddSuggestion = () => {
    setShowSuggestionBox(true);
  };

  const handleSaveSuggestion = () => {
    setShowSuggestionBox(false);
  };

  return (
    <div id="game-container">
      <audio ref={audioRef} loop autoPlay>
        <source src="/You-and-I.mp3" type="audio/mpeg" />
      </audio>

      <canvas ref={canvasRef} id="gameCanvas" />

      <div id="ui-layer">
        <div id="score-board">
          <span>❤️ Love Meter: </span>
          <div className="progress-bar">
            <div 
              id="love-fill" 
              style={{ width: `${(score / WIN_SCORE) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className={`screen ${gameState === 'START' ? 'active' : 'hidden'}`}>
        <h1>Catch the Love!</h1>
        <p>Catch enough hearts to reveal a special question...</p>
        <button onClick={startGame} className="btn" id="start-btn">
          Start Game
        </button>
      </div>

      <div className={`screen ${gameState === 'PROPOSAL' ? 'active' : 'hidden'}`}>
        <div className="proposal-content">
          <h1>Will You Be My Valentine?</h1>
          <p className="sub-text">{getPersuasiveText()}</p>
          <div className="buttons">
            <button onClick={handleYes} className="btn yes-btn">
              YES!
            </button>
            <button 
              onClick={handleNoClick}
              onMouseOver={moveNoButton}
              onTouchStart={moveNoButton}
              className="btn no-btn"
              style={{ cursor: noClickCount >= 5 ? 'not-allowed' : 'pointer' }}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div className={`screen ${gameState === 'CELEBRATION' ? 'active' : 'hidden'}`}>
        <h1>Happy Valentine's Day!</h1>
        <p>I love you!</p>
        {showCountdown && (
          <div className="countdown-timer">
            <p className="countdown-text">Preparing something special for you...</p>
            <div className="countdown-number">{countdown}</div>
          </div>
        )}
      </div>

      <div className={`screen ${gameState === 'PLANNER' ? 'active' : 'hidden'}`}>
        <div className="planner-content">
          <h1 className="planner-title">Our Valentine's Plans</h1>
          <p className="planner-subtitle">Click on each envelope to reveal our special dates! 💌</p>
          
          <div className="envelopes-container">
            {datePlans.map((plan) => (
              <div key={plan.id} className="envelope-wrapper">
                <div 
                  className={`envelope ${openEnvelopeId === plan.id || hoveredEnvelopeId === plan.id ? 'open' : ''} ${chosenPlanId === plan.id ? 'chosen' : ''}`}
                  onClick={() => handleEnvelopeClick(plan.id)}
                  onMouseEnter={() => setHoveredEnvelopeId(plan.id)}
                  onMouseLeave={() => setHoveredEnvelopeId(null)}
                >
                  <div className="envelope-flap"></div>
                  <div className="envelope-body">
                    <div className="envelope-number">{plan.id}</div>
                    {chosenPlanId === plan.id && (
                      <div className="chosen-badge">✓</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {openEnvelopeId !== null && (
            <div className="letter-backdrop" onClick={() => setOpenEnvelopeId(null)}>
              <div className="letter" onClick={(e) => e.stopPropagation()}>
                <div className="letter-content">
                  <button 
                    className="letter-close" 
                    onClick={() => setOpenEnvelopeId(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h2>{datePlans.find(p => p.id === openEnvelopeId)?.title}</h2>
                  <div className="letter-details">
                    <div className="detail-row">
                      <span className="detail-label">📅 Date:</span>
                      <span>{new Date(datePlans.find(p => p.id === openEnvelopeId)?.date || '').toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">⏰ Time:</span>
                      <span>{datePlans.find(p => p.id === openEnvelopeId)?.time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📍 Location:</span>
                      <span>{datePlans.find(p => p.id === openEnvelopeId)?.location}</span>
                    </div>
                    <div className="detail-row activity">
                      <span className="detail-label">💝 Activity:</span>
                      <span>{datePlans.find(p => p.id === openEnvelopeId)?.activity}</span>
                    </div>
                  </div>
                  <p className="letter-note">{datePlans.find(p => p.id === openEnvelopeId)?.note}</p>
                  <button 
                    className="btn choose-btn"
                    onClick={() => handleChoosePlan(openEnvelopeId)}
                  >
                    {chosenPlanId === openEnvelopeId ? 'Plan Chosen! ✓' : 'Choose This Date'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {chosenPlanId !== null && (
            <div className="planner-action-section">
              {!showSuggestionBox && !suggestion && (
                <button 
                  className="btn suggestion-btn"
                  onClick={handleAddSuggestion}
                >
                  ✏️ Add Your Suggestions (Optional)
                </button>
              )}
              
              {showSuggestionBox && (
                <div className="suggestion-box">
                  <p className="suggestion-prompt">Any ideas to make this date even better? 💭</p>
                  <textarea
                    className="suggestion-input"
                    placeholder="e.g., 'Let's get ice cream after!' or 'Can we visit the bookstore too?'"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    rows={4}
                  />
                  <div className="suggestion-actions">
                    <button 
                      className="btn save-suggestion-btn"
                      onClick={handleSaveSuggestion}
                    >
                      Save My Ideas ✨
                    </button>
                    <button 
                      className="btn skip-suggestion-btn"
                      onClick={() => setShowSuggestionBox(false)}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}
              
              {suggestion && !showSuggestionBox && (
                <div className="user-suggestion-preview">
                  <div className="suggestion-header">
                    <span className="suggestion-title">✨ Your Ideas Added!</span>
                    <button 
                      className="edit-suggestion-btn"
                      onClick={() => setShowSuggestionBox(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <p>{suggestion}</p>
                </div>
              )}
              
              <button 
                className="btn submit-btn"
                onClick={handleSubmitPlan}
              >
                Confirm Our Date 💕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`screen ${gameState === 'CONFIRMATION' ? 'active' : 'hidden'}`}>
        <div className="confirmation-wrapper">
          <div id="confirmation-card" className="confirmation-card">
            <div className="card-header">
              <h1 className="card-title">Our Date is Set! 💕</h1>
              <p className="card-subtitle">Valentine's Special</p>
            </div>
            
            <div className={`card-content-grid ${suggestion ? 'has-suggestion' : ''}`}>
              <div className="card-left-column">
                <div className="chosen-plan-icon">
                  {chosenPlanId === 1 && '🍽️'}
                  {chosenPlanId === 2 && '🎬'}
                  {chosenPlanId === 3 && '🎒'}
                </div>
                
                <h2 className="plan-title">{datePlans.find(p => p.id === chosenPlanId)?.title}</h2>
                
                <div className="card-details">
                  <div className="card-detail-item">
                    <span className="card-icon">📅</span>
                    <div className="card-detail-text">
                      <span className="detail-label-small">Date</span>
                      <span className="detail-value">
                        {new Date(datePlans.find(p => p.id === chosenPlanId)?.date || '').toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-detail-item">
                    <span className="card-icon">⏰</span>
                    <div className="card-detail-text">
                      <span className="detail-label-small">Time</span>
                      <span className="detail-value">{datePlans.find(p => p.id === chosenPlanId)?.time}</span>
                    </div>
                  </div>
                  
                  <div className="card-detail-item">
                    <span className="card-icon">📍</span>
                    <div className="card-detail-text">
                      <span className="detail-label-small">Location</span>
                      <span className="detail-value">{datePlans.find(p => p.id === chosenPlanId)?.location}</span>
                    </div>
                  </div>
                  
                  <div className="card-detail-item">
                    <span className="card-icon">💝</span>
                    <div className="card-detail-text">
                      <span className="detail-label-small">Activity</span>
                      <span className="detail-value">{datePlans.find(p => p.id === chosenPlanId)?.activity}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-right-column">
                <div className="card-note">
                  <p>{datePlans.find(p => p.id === chosenPlanId)?.note}</p>
                </div>
                
                {suggestion && (
                  <div className="user-suggestion">
                    <div className="suggestion-header">
                      <span className="suggestion-title">Her Ideas 💡</span>
                    </div>
                    <p>{suggestion}</p>
                  </div>
                )}
                
                <div className="hearts-decoration">
                  ❤️ 💕 💖 💗 💝
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
