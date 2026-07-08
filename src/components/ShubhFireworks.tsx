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
  isSpark: boolean;
  glowColor: string;
  twinkle: boolean;
  trailLength: number;
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

  // Exquisite colors selected directly from the premium fireworks palette
  const palettes = [
    { core: '#FFFFFF', outer: '#FFA500', glow: 'rgba(255, 165, 0, 0.7)' },  // Golden Chrysanthemum
    { core: '#FFD700', outer: '#FF1493', glow: 'rgba(255, 20, 147, 0.7)' }, // Rani Pink Sparkle
    { core: '#00FFFF', outer: '#39FF14', glow: 'rgba(57, 255, 20, 0.7)' },  // Neon Turquoise Green
    { core: '#FFFFFF', outer: '#FF4500', glow: 'rgba(255, 69, 0, 0.7)' },   // Pure Saffron & Gold
    { core: '#E2F6FF', outer: '#00D2FF', glow: 'rgba(0, 210, 255, 0.7)' },  // Electric Ice Blue
    { core: '#FFDF00', outer: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.6)' }, // Imperial Brocade Silver-Gold
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

  const startCelebrationRef = useRef<(() => void) | null>(null);

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

    // 1. Launch a single rocket with a beautiful wavy path
    const launchRocket = () => {
      if (!isPlaying) return;
      const startX = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
      const startY = canvas.height + 20;
      const targetX = startX + (Math.random() - 0.5) * 200;
      const targetY = Math.random() * (canvas.height * 0.45) + canvas.height * 0.1;

      const angle = Math.atan2(targetY - startY, targetX - startX);
      const speed = Math.random() * 4 + 14; // High-velocity ascent

      rockets.push({
        x: startX,
        y: startY,
        tx: targetX,
        ty: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#FFFFFF',
        alpha: 1,
        swayFreq: Math.random() * 0.12 + 0.04,
        swayAmp: Math.random() * 3.5 + 1.5,
        timeAlive: 0,
      });
    };

    // 2. High fidelity multi-layered radial explosion (runs at solid 60 FPS without shadowBlur!)
    const explode = (x: number, y: number) => {
      const palette = palettes[Math.floor(Math.random() * palettes.length)];
      
      // Determine pattern (0 = Double Ring, 1 = Shimmering Willow, 2 = Dazzling Ray)
      const patternType = Math.floor(Math.random() * 3);
      const pCount = patternType === 0 ? 100 : patternType === 1 ? 70 : 120;

      for (let i = 0; i < pCount; i++) {
        const angle = (i / pCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
        let speed = Math.random() * 5.5 + 3.5;
        let color = palette.outer;
        let decay = Math.random() * 0.008 + 0.005; // Elegant slow decay
        let resistance = 0.974;
        let gravity = 0.055;
        let isSpark = false;
        let trailLength = Math.random() * 1.5 + 1.2;

        if (patternType === 0) {
          // Double Ring
          if (i % 3 === 0) {
            speed *= 0.55; // Inner core
            color = palette.core;
            decay = Math.random() * 0.012 + 0.008;
            trailLength = 1.0;
          } else {
            speed *= 1.15; // Outer expansion ring
          }
        } else if (patternType === 1) {
          // Shimmering Willow
          gravity = 0.09;
          resistance = 0.965;
          decay = Math.random() * 0.006 + 0.003;
          trailLength = Math.random() * 2.2 + 1.8;
          if (Math.random() > 0.6) {
            isSpark = true;
            color = '#FFD700';
          }
        } else {
          // Dazzling Radial Ray
          if (i % 6 === 0) {
            color = '#FFFFFF';
            speed *= 1.25;
            trailLength = 2.4;
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
          size: isSpark ? Math.random() * 1.2 + 0.6 : Math.random() * 2.8 + 1.4,
          gravity,
          resistance,
          isSpark,
          glowColor: palette.glow,
          twinkle: Math.random() > 0.4,
          trailLength,
        });
      }

      // Add central white-hot flash sparks that expand and fade instantly
      const flashCount = 12;
      for (let i = 0; i < flashCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 1.5 + 0.5;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          alpha: 1,
          decay: Math.random() * 0.045 + 0.025,
          color: '#FFFFFF',
          size: Math.random() * 3.5 + 1.5,
          gravity: 0.02,
          resistance: 0.94,
          isSpark: false,
          glowColor: 'rgba(255,255,255,0.8)',
          twinkle: false,
          trailLength: 1.0,
        });
      }

      // Add floating blessing text above the explosion apex
      if (Math.random() > 0.35) {
        textBursts.push({
          id: textIdCounter++,
          x,
          y: y - 30,
          text: blessingTexts[Math.floor(Math.random() * blessingTexts.length)],
          alpha: 1,
          scale: 0.85,
          color: palette.outer,
        });
      }
    };

    // Main Canvas render loop
    const render = () => {
      // 1. Draw dark semi-transparent sky backdrop to create gorgeous smooth trails
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(10, 2, 7, 0.16)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isPlaying && particles.length === 0 && rockets.length === 0 && textBursts.length === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // 2. Enable additive blending for glowing hot-centers and hyper-realistic sparks!
      ctx.globalCompositeOperation = 'lighter';

      // 2a. Update and render rockets with beautiful gold trailing embers
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.timeAlive += 1;

        // Apply sine sway for curved aesthetic trajectory
        const sway = Math.sin(r.timeAlive * r.swayFreq) * r.swayAmp;
        const perpX = -Math.sin(Math.atan2(r.vy, r.vx)) * sway;
        const perpY = Math.cos(Math.atan2(r.vy, r.vx)) * sway;

        r.x += r.vx + perpX * 0.08;
        r.y += r.vy + perpY * 0.08;
        r.vy += 0.065; // gravity pull

        // Spawn golden-orange magnesium sparks from rocket bottom
        if (Math.random() > 0.32) {
          particles.push({
            x: r.x,
            y: r.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.8 + 1.2,
            alpha: 0.85,
            decay: Math.random() * 0.03 + 0.015,
            color: '#FFA500',
            size: Math.random() * 1.6 + 0.8,
            gravity: 0.08,
            resistance: 0.98,
            isSpark: true,
            glowColor: 'rgba(255, 165, 0, 0.4)',
            twinkle: Math.random() > 0.4,
            trailLength: 2.2,
          });
        }

        // Draw elegant ascending comet head
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();

        // Check if rocket has reached peak height
        if (r.vy >= 0 || r.y <= r.ty) {
          explode(r.x, r.y);
          rockets.splice(i, 1);
        }
      }

      // 2b. Render Particles with high performance vectors instead of laggy shadowBlur loops
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

        ctx.save();
        
        let drawAlpha = p.alpha;
        if (p.twinkle && Math.random() > 0.75) {
          drawAlpha = Math.random() * 0.25; // Shimmering/flickering glow
        }
        ctx.globalAlpha = drawAlpha;

        // Draw physical vector spark trail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * p.trailLength, p.y - p.vy * p.trailLength);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Bright white hot-center node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.restore();
      }

      // 3. Switch back to normal blending for crisp text shadows
      ctx.globalCompositeOperation = 'source-over';

      // Render Floating auspicious blessings text
      for (let i = textBursts.length - 1; i >= 0; i--) {
        const t = textBursts[i];
        t.y -= 0.55;
        t.alpha -= 0.009;
        t.scale += 0.003;

        if (t.alpha <= 0) {
          textBursts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = t.alpha;
        ctx.translate(t.x, t.y);
        ctx.scale(t.scale, t.scale);
        
        ctx.font = 'bold 22px "Space Grotesk", "Inter", sans-serif';
        ctx.fillStyle = t.color;
        ctx.textAlign = 'center';
        
        // Deep black backdrop shadow for crisp readability
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 8;
        
        // Pure white stroke outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.0;
        ctx.strokeText(t.text, 0, 0);
        ctx.fillText(t.text, 0, 0);
        
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const startCelebration = () => {
      // Launch initial fireworks immediately
      launchRocket();
      setTimeout(launchRocket, 150);
      setTimeout(launchRocket, 400);

      let count = 0;
      activeIntervalRef.current = setInterval(() => {
        launchRocket();
        if (Math.random() > 0.35) {
          setTimeout(launchRocket, 180);
        }
        count++;
        if (count > 22) {
          if (activeIntervalRef.current) {
            clearInterval(activeIntervalRef.current);
          }
        }
      }, 450);
    };

    startCelebrationRef.current = startCelebration;

    if (isPlaying) {
      startCelebration();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      if (activeIntervalRef.current) {
        clearInterval(activeIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Handle auto-scroll trigger when reaching the footer area
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 160;

      if (scrollPosition >= threshold && !triggerDebounce.current && !isPlaying) {
        triggerDebounce.current = true;
        setIsPlaying(true);

        // Run the burst sequence for 12 seconds, then allow retriggering
        setTimeout(() => {
          setIsPlaying(false);
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
    // Auto-stop after 11.5 seconds
    setTimeout(() => {
      setIsPlaying(false);
    }, 11500);
  };

  return (
    <>
      <AnimatePresence>
        {isPlaying && (
          <>
            {/* Deep twilight-night backing backdrop to contrast with golden bursts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.78 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 bg-[#060006] pointer-events-none z-[100006] mix-blend-multiply"
            />
            
            {/* Ambient stardust / sparkle fields */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 pointer-events-none z-[100007] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-20"
            />
          </>
        )}
      </AnimatePresence>

      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-[100008] transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Elegant Manual Interactive Celebration Trigger Button - COMPACT on mobile to prevent overlaps! */}
      <div className="fixed bottom-6 left-6 z-[100010] pointer-events-auto flex flex-col items-start">
        {/* Floating "Click Here" Hint Message Pop-up */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: [0, -6, 0],
                scale: 1 
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeInOut"
                },
                opacity: { duration: 0.4 },
                scale: { duration: 0.3 }
              }}
              onClick={manualTrigger}
              className="absolute bottom-16 left-0 mb-1 bg-gradient-to-r from-wedding-crimson to-wedding-maroon text-bright-gold text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-xl shadow-[0_6px_20px_rgba(158,27,50,0.5)] border-2 border-royal-gold whitespace-nowrap z-[100012] flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-bright-gold"></span>
              </span>
              <span className="animate-pulse">✨</span>
              <span>यहाँ क्लिक करें / Click Here!</span>
              <span className="text-xs">🎆</span>
              {/* Cute speech bubble pointer */}
              <div className="absolute -bottom-1.5 left-5 w-2.5 h-2.5 bg-wedding-maroon border-r-2 border-b-2 border-royal-gold rotate-45 transform" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={manualTrigger}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-saffron via-marigold-yellow to-saffron hover:from-wedding-maroon hover:to-wedding-crimson text-wedding-maroon hover:text-royal-gold font-extrabold w-12 h-12 md:w-auto md:h-auto md:px-5 md:py-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2.5 border-2 border-royal-gold/70 text-xs tracking-wider uppercase transition-all duration-300 relative z-[100011]"
          title="उत्सव मनाएं (Celebrate!)"
        >
          <span className="text-sm animate-pulse">🎆</span>
          <span className="hidden md:inline">उत्सव मनाएं (Celebrate!)</span>
          <span className="text-sm animate-pulse hidden md:inline">✨</span>
        </motion.button>
      </div>

      {/* Premium Celebration Info Banner with Quick Dismiss option */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="fixed bottom-6 right-6 w-[340px] md:w-96 bg-gradient-to-br from-wedding-maroon via-wedding-crimson to-wedding-maroon border-2 border-royal-gold p-4.5 rounded-2xl shadow-[0_15px_35px_rgba(139,28,45,0.45)] z-[100015] overflow-hidden"
          >
            {/* Outer golden halo */}
            <div className="absolute inset-0 bg-royal-gold/10 rounded-2xl animate-pulse pointer-events-none" />

            {/* Traditional border decoration */}
            <div className="absolute top-1.5 bottom-1.5 left-1.5 right-1.5 border border-royal-gold/30 rounded-xl pointer-events-none" />

            {/* Close Button "✕" */}
            <button
              onClick={stopCelebration}
              className="absolute top-3.5 right-3.5 w-7 h-7 bg-black/40 hover:bg-wedding-crimson text-royal-gold hover:text-white rounded-full flex items-center justify-center font-bold text-sm border border-royal-gold/30 cursor-pointer transition-all duration-200 shadow-md active:scale-90"
              title="Close Celebration (उत्सव बंद करें)"
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
