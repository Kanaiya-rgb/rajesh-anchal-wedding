import React, { useEffect, useRef } from 'react';

interface BurstParticle {
  x: number;
  y: number;
  r: number;
  speedY: number;
  speedX: number;
  angle: number;
  spinSpeed: number;
  color: string;
  opacity: number;
  type: 'rose' | 'glitter';
  decay: number;
}

export default function PetalAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Regular falling background marigold petal blueprint
    interface Petal {
      x: number;
      y: number;
      r: number;
      speedY: number;
      speedX: number;
      angle: number;
      spinSpeed: number;
      color: string;
      opacity: number;
    }

    const colors = [
      '#FF9933', // Saffron / Marigold orange
      '#FFC000', // Saffron / Marigold yellow
      '#E8731A', // Rich orange
      '#FF4500', // Red-Orange
    ];

    const maxPetals = window.innerWidth < 768 ? 15 : 35;
    const petals: Petal[] = [];

    const createPetal = (isInitial = false): Petal => ({
      x: Math.random() * width,
      y: isInitial ? Math.random() * height : -20,
      r: Math.random() * 6 + 4,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: Math.random() * 1.0 - 0.5,
      angle: Math.random() * 360,
      spinSpeed: Math.random() * 1.6 - 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.35 + 0.45,
    });

    // Populate initial petals
    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    // Active burst particle array
    const burstParticles: BurstParticle[] = [];
    const gravity = 0.24;

    // Handle the custom "shubh-burst" celebration trigger
    const handleShubhBurst = () => {
      const isMobile = window.innerWidth < 768;
      const cannonParticles = isMobile ? 35 : 75;
      const centerParticles = isMobile ? 25 : 55;

      const roseColors = ['#D21F3C', '#9E1B32', '#FF4D6D', '#FF1493'];
      const goldColors = ['#FFDF00', '#D4AF37', '#FFC000', '#AA7C11'];

      // Left Cannon (blasts from bottom-left corner diagonally up-right)
      for (let i = 0; i < cannonParticles; i++) {
        burstParticles.push({
          x: -10,
          y: height - 30,
          r: Math.random() * 7 + 4,
          speedX: Math.random() * 14 + 6,
          speedY: -(Math.random() * 18 + 12),
          angle: Math.random() * 360,
          spinSpeed: Math.random() * 10 - 5,
          color: Math.random() > 0.5 
            ? roseColors[Math.floor(Math.random() * roseColors.length)]
            : goldColors[Math.floor(Math.random() * goldColors.length)],
          opacity: 1,
          type: Math.random() > 0.45 ? 'rose' : 'glitter',
          decay: Math.random() * 0.007 + 0.005,
        });
      }

      // Right Cannon (blasts from bottom-right corner diagonally up-left)
      for (let i = 0; i < cannonParticles; i++) {
        burstParticles.push({
          x: width + 10,
          y: height - 30,
          r: Math.random() * 7 + 4,
          speedX: -(Math.random() * 14 + 6),
          speedY: -(Math.random() * 18 + 12),
          angle: Math.random() * 360,
          spinSpeed: Math.random() * 10 - 5,
          color: Math.random() > 0.5 
            ? roseColors[Math.floor(Math.random() * roseColors.length)]
            : goldColors[Math.floor(Math.random() * goldColors.length)],
          opacity: 1,
          type: Math.random() > 0.45 ? 'rose' : 'glitter',
          decay: Math.random() * 0.007 + 0.005,
        });
      }

      // Center sky explosion
      for (let i = 0; i < centerParticles; i++) {
        const speed = Math.random() * 8 + 3;
        const angleRad = Math.random() * Math.PI * 2;
        burstParticles.push({
          x: width / 2,
          y: height * 0.45,
          r: Math.random() * 6 + 3,
          speedX: Math.cos(angleRad) * speed,
          speedY: Math.sin(angleRad) * speed - 2,
          angle: Math.random() * 360,
          spinSpeed: Math.random() * 12 - 6,
          color: Math.random() > 0.5 
            ? roseColors[Math.floor(Math.random() * roseColors.length)]
            : goldColors[Math.floor(Math.random() * goldColors.length)],
          opacity: 1,
          type: Math.random() > 0.5 ? 'rose' : 'glitter',
          decay: Math.random() * 0.009 + 0.007,
        });
      }
    };

    window.addEventListener('shubh-burst', handleShubhBurst);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw regular background falling marigold petals
      petals.forEach((petal, index) => {
        petal.y += petal.speedY;
        petal.x += petal.speedX + Math.sin(petal.y / 40) * 0.25;
        petal.angle += petal.spinSpeed;

        if (petal.y > height + 20 || petal.x < -20 || petal.x > width + 20) {
          petals[index] = createPetal(false);
        }

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate((petal.angle * Math.PI) / 180);
        ctx.globalAlpha = petal.opacity;
        ctx.fillStyle = petal.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, petal.r, petal.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = petal.opacity * 0.25;
        ctx.beginPath();
        ctx.moveTo(-petal.r, 0);
        ctx.lineTo(petal.r, 0);
        ctx.stroke();

        ctx.restore();
      });

      // 2. Draw active burst rose petals & golden sparkles with physical traits
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        
        // Physics update
        p.speedY += gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.spinSpeed;
        p.opacity -= p.decay;

        // Clean up invisible particles
        if (p.opacity <= 0 || p.y > height + 20 || p.x < -20 || p.x > width + 20) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === 'rose') {
          // Lush heart/droplet shaped rose petal
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.72, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Delicate highlight line representing real petals
          ctx.strokeStyle = '#FFF0F5';
          ctx.lineWidth = 0.6;
          ctx.globalAlpha = p.opacity * 0.35;
          ctx.beginPath();
          ctx.moveTo(-p.r, 0);
          ctx.lineTo(p.r, 0);
          ctx.stroke();
        } else {
          // Glistening gold diamond glitter sparkles
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.lineTo(p.r, 0);
          ctx.lineTo(0, p.r);
          ctx.lineTo(-p.r, 0);
          ctx.closePath();
          ctx.fill();
          
          // Outer magical glow aura
          ctx.shadowColor = '#FFDF00';
          ctx.shadowBlur = 6;
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('shubh-burst', handleShubhBurst);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="petal-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
