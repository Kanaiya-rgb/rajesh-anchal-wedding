import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
  resistance: number;
  history: { x: number; y: number }[];
  isSpark: boolean; // Falling embers/sparks
  glowColor: string;
  twinkle: boolean;
}

interface Rocket {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  swayFreq: number;
  swayAmp: number;
  timeAlive: number;
  history: { x: number; y: number }[];
}

interface TextBurst {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
  scale: number;
  color: string;
}

export default function ShubhFireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const triggerDebounce = useRef(false);
  const activeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // High fidelity color palettes based on the user's image (Gold, Pink, Orange, Blue, White)
  const palettes = [
    { core: '#FFFFFF', outer: '#FFA500', glow: 'rgba(255, 165, 0, 0.6)' }, // Gold & White Chrysanthemum
    { core: '#FFD700', outer: '#FF1493', glow: 'rgba(255, 20, 147, 0.6)' }, // Rani Pink & Gold
    { core: '#00FFFF', outer: '#39FF14', glow: 'rgba(57, 255, 20, 0.6)' }, // Cyan & Neon Green
    { core: '#FFFFFF', outer: '#FF4500', glow: 'rgba(255, 69, 0, 0.6)' }, // Saffron Red & White
    { core: '#E0B0FF', outer: '#00FFFF', glow: 'rgba(0, 255, 255, 0.6)' }, // Turquoise & Lavender shimmer
    { core: '#FFDF00', outer: '#FFFFFF', glow: 'rgba(255, 223, 0, 0.5)' }, // Pure Brocade Gold & Silver
  ];

  const blessingTexts = [
    'शुभ विवाह',
    'बधाई हो',
    'सदा सौभाग्यवती भव',
    'मंगलम',
    'Congratulations',
    'Shubh Vivah',
    'सदा सुखी रहो',
    'R & A ✨',
  ];

  const launchBurstRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let rockets: Rocket[] = [];
    let textBursts: TextBurst[] = [];
    let textIdCounter = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 1. Launch a single rocket with a beautiful wavy/curved trail (like in the image)
    const launchRocket = () => {
      if (!isPlaying) return;
      const startX = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
      const startY = canvas.height + 20;
      const targetX = startX + (Math.random() - 0.5) * 200;
      const targetY = Math.random() * (canvas.height * 0.45) + canvas.height * 0.1;

      const angle = Math.atan2(targetY - startY, targetX - startX);
      const speed = Math.random() * 4 + 14;

      rockets.push({
        x: startX,
        y: startY,
        tx: targetX,
        ty: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#FFFFFF', // High-contrast initial spark
        alpha: 1,
        swayFreq: Math.random() * 0.15 + 0.05,
        swayAmp: Math.random() * 3 + 1.5,
        timeAlive: 0,
        history: [],
      });
    };

    // 2. Create high fidelity layered explosions matching the reference image
    const explode = (x: number, y: number) => {
      const palette = palettes[Math.floor(Math.random() * palettes.length)];
      
      // Select a stylized burst pattern type:
      // 0 = Double Ring Peony, 1 = Golden Brocade Willow with crackle, 2 = Perfect Radial Ray Chrysanthemum
      const patternType = Math.floor(Math.random() * 3);
      
      const pCount = patternType === 0 ? 110 : patternType === 1 ? 80 : 130;

      for (let i = 0; i < pCount; i++) {
        // Base radial calculations
        const angle = (i / pCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
        let speed = Math.random() * 6 + 3.5;
        let color = palette.outer;
        let decay = Math.random() * 0.007 + 0.004; // Long trails
        let resistance = 0.975;
        let gravity = 0.055;
        let isSpark = false;

        if (patternType === 0) {
          // Double Ring: some outer particles, some inner core particles
          if (i % 3 === 0) {
            speed *= 0.55; // Inner ring
            color = palette.core;
            decay = Math.random() * 0.01 + 0.007;
          } else {
            speed *= 1.15; // Outer ring
          }
        } else if (patternType === 1) {
          // Willow Brocade: particles slide down heavily under gravity, leaving shimmering trails
          gravity = 0.095;
          resistance = 0.96;
          decay = Math.random() * 0.006 + 0.003;
          if (Math.random() > 0.6) {
            isSpark = true; // Makes crackling sparks at the tips
            color = '#FFD700';
          }
        } else {
          // Perfect Chrysanthemum with bright white ray nodes
          if (i % 6 === 0) {
            color = '#FFFFFF'; // White accents/centers
            speed *= 1.25;
          }
        }

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay,
          color,
          size: isSpark ? Math.random() * 1.5 + 0.8 : Math.random() * 3.2 + 1.6,
          gravity,
          resistance,
          history: [],
          isSpark,
          glowColor: palette.glow,
          twinkle: Math.random() > 0.4,
        });
      }

      // Add a central flash star (bright center node like in the photo)
      const flashCount = 15;
      for (let i = 0; i < flashCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 1.8 + 0.5;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          alpha: 1,
          decay: Math.random() * 0.04 + 0.02, // Fades quickly
          color: '#FFFFFF',
          size: Math.random() * 4 + 2,
          gravity: 0.02,
          resistance: 0.95,
          history: [],
          isSpark: false,
          glowColor: 'rgba(255,255,255,0.8)',
          twinkle: false,
        });
      }

      // Add elegant blessing text at the apex of the explosion
      if (Math.random() > 0.3) {
        textBursts.push({
          id: textIdCounter++,
          x,
          y: y - 35,
          text: blessingTexts[Math.floor(Math.random() * blessingTexts.length)],
          alpha: 1,
          scale: 0.82,
          color: palette.outer,
        });
      }
    };

    // Main Canvas rendering loop
    const render = () => {
      // Semi-transparent overlay to keep smooth trailing, matching dark theme perfectly
      ctx.fillStyle = 'rgba(10, 2, 7, 0.16)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isPlaying && particles.length === 0 && rockets.length === 0 && textBursts.length === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // 1. Render Rockets with stylized wavy paths
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.timeAlive += 1;

        // Apply sinusoidal sway to trajectory for organic/stylized wave look (like the bottom of the photo)
        const sway = Math.sin(r.timeAlive * r.swayFreq) * r.swayAmp;
        const perpX = -Math.sin(Math.atan2(r.vy, r.vx)) * sway;
        const perpY = Math.cos(Math.atan2(r.vy, r.vx)) * sway;

        r.x += r.vx + perpX * 0.08;
        r.y += r.vy + perpY * 0.08;

        // Gravity affects rocket peak
        r.vy += 0.06;

        r.history.push({ x: r.x, y: r.y });
        if (r.history.length > 18) r.history.shift();

        // Draw glowing tapered trail
        ctx.save();
        ctx.beginPath();
        if (r.history.length > 1) {
          ctx.moveTo(r.history[0].x, r.history[0].y);
          for (let h = 1; h < r.history.length; h++) {
            ctx.lineTo(r.history[h].x, r.history[h].y);
          }
        } else {
          ctx.moveTo(r.x, r.y);
        }
        ctx.strokeStyle = 'rgba(255, 235, 180, 0.85)';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Glowing apex indicator node
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();

        // Apex explosion
        if (r.vy >= 0 || r.y <= r.ty) {
          explode(r.x, r.y);
          rockets.splice(i, 1);
        }
      }

      // 2. Render Particles with realistic physical star trails & glows
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.resistance;
        p.vy *= p.resistance;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Keep trail history
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 8) p.history.shift();

        ctx.save();
        
        // Twinkle/glimmer flickers
        let drawAlpha = p.alpha;
        if (p.twinkle && Math.random() > 0.72) {
          drawAlpha = Math.random() * 0.25;
        }
        ctx.globalAlpha = drawAlpha;

        // Render sleek line-based star trails (high quality look)
        ctx.beginPath();
        if (p.history.length > 1) {
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let h = 1; h < p.history.length; h++) {
            ctx.lineTo(p.history[h].x, p.history[h].y);
          }
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        
        // Dynamic radial glow (creates the dense light fields seen in user's image)
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = p.size * 3.8;
        ctx.stroke();

        // Core highlight point inside the firework spark
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.restore();
      }

      // 3. Render floating blessing texts
      for (let i = textBursts.length - 1; i >= 0; i--) {
        const t = textBursts[i];
        t.y -= 0.5;
        t.alpha -= 0.008;
        t.scale += 0.0025;

        if (t.alpha <= 0) {
          textBursts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = t.alpha;
        ctx.translate(t.x, t.y);
        ctx.scale(t.scale, t.scale);
        
        ctx.font = 'bold 23px "Space Grotesk", "Inter", sans-serif';
        ctx.fillStyle = t.color;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 10;
        
        // Bright white outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.8;
        ctx.strokeText(t.text, 0, 0);
        ctx.fillText(t.text, 0, 0);
        
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const startCelebrationSequence = () => {
      // Rapid fire starting burst
      launchRocket();
      setTimeout(launchRocket, 200);
      setTimeout(launchRocket, 450);
      setTimeout(launchRocket, 700);

      let count = 0;
      activeIntervalRef.current = setInterval(() => {
        launchRocket();
        if (Math.random() > 0.3) {
          setTimeout(launchRocket, 180);
        }
        count++;
        if (count > 20) {
          if (activeIntervalRef.current) {
            clearInterval(activeIntervalRef.current);
          }
        }
      }, 450);
    };

    launchBurstRef.current = startCelebrationSequence;

    if (isPlaying) {
      startCelebrationSequence();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      if (activeIntervalRef.current) {
        clearInterval(activeIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Scroll listener at the end of the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 160;

      if (scrollPosition >= threshold && !triggerDebounce.current && !isPlaying) {
        triggerDebounce.current = true;
        setIsPlaying(true);

        // Keep celebrating for 12 seconds
        setTimeout(() => {
          setIsPlaying(false);
          // Wait to retrigger organically
          setTimeout(() => {
            triggerDebounce.current = false;
          }, 6000);
        }, 11500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPlaying]);

  const stopCelebration = () => {
    setIsPlaying(false);
  };

  const manualTrigger = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 11500);
  };

  return (
    <>
      <AnimatePresence>
        {isPlaying && (
          <>
            {/* Elegant high-contrast vignette backing sky overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 bg-[#080108] pointer-events-none z-[8887] mix-blend-multiply"
            />
            
            {/* Atmospheric starry universe layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 pointer-events-none z-[8887] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-25"
            />
          </>
        )}
      </AnimatePresence>

      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-[8888] transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Elegant Manual Interactive Celebration Trigger Button */}
      <div className="fixed bottom-6 left-6 z-[8889] pointer-events-auto">
        <motion.button
          onClick={manualTrigger}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-saffron via-marigold-yellow to-saffron hover:from-wedding-maroon hover:to-wedding-crimson text-wedding-maroon hover:text-royal-gold font-extrabold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border-2 border-royal-gold/70 text-xs tracking-wider uppercase transition-all duration-300"
        >
          <span className="text-sm animate-pulse">🎆</span>
          <span>उत्सव मनाएं (Celebrate!)</span>
          <span className="text-sm animate-pulse">✨</span>
        </motion.button>
      </div>

      {/* Custom Celebration Banner with Close/Dismiss control */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="fixed bottom-6 right-6 w-[340px] md:w-96 bg-gradient-to-br from-wedding-maroon via-wedding-crimson to-wedding-maroon border-2 border-royal-gold p-4.5 rounded-2xl shadow-[0_15px_35px_rgba(139,28,45,0.45)] z-[9999] overflow-hidden"
          >
            {/* Pulsing light rings */}
            <div className="absolute inset-0 bg-royal-gold/10 rounded-2xl animate-pulse pointer-events-none" />

            {/* Traditional border frame decoration */}
            <div className="absolute top-1.5 bottom-1.5 left-1.5 right-1.5 border border-royal-gold/30 rounded-xl pointer-events-none" />

            {/* Fast Close button */}
            <button
              onClick={stopCelebration}
              className="absolute top-3.5 right-3.5 w-7 h-7 bg-black/40 hover:bg-wedding-crimson text-royal-gold hover:text-white rounded-full flex items-center justify-center font-bold text-sm border border-royal-gold/30 cursor-pointer transition-all duration-200 shadow-md active:scale-90"
              title="Close Fireworks (उत्सव बंद करें)"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="text-center pr-5 pl-2">
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-royal-gold animate-pulse">
                Shubh Vivah Celebration
              </span>
              <p className="text-white font-bold text-base mt-2 drop-shadow-sm leading-snug">
                ✨ Shubh Kadam, Mangal Mandap Pe Aapka Swagat Hai! ✨
              </p>
              <p className="text-royal-gold/90 text-xs mt-2 italic font-medium">
                Shaadi ki dheron shubhkaamnaayein! 🌸
              </p>
              
              <button
                onClick={stopCelebration}
                className="mt-3.5 px-4 py-1.5 bg-royal-gold text-wedding-maroon hover:bg-white hover:text-wedding-crimson rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer active:scale-95"
              >
                बंद करें (Close)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
