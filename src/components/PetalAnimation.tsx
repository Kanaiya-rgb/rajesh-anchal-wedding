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
  type: 'rose' | 'marigold' | 'glitter';
  decay: number;
  flutterAngle: number;
  flutterSpeed: number;
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

    // Regular falling background petal blueprint
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
      type: 'rose' | 'marigold';
      flutterAngle: number;
      flutterSpeed: number;
    }

    const marigoldColors = [
      '#FF9933', // Saffron / Marigold orange
      '#FFC000', // Saffron / Marigold yellow
      '#E8731A', // Rich orange
      '#FF4500', // Red-Orange
    ];

    const roseColors = [
      '#D21F3C', // Deep Crimson rose
      '#9E1B32', // Rich velvet maroon rose
      '#FF4D6D', // Soft rose pink
      '#FF1493', // Deep Pink
    ];

    const maxPetals = window.innerWidth < 768 ? 20 : 45;
    const petals: Petal[] = [];

    const createPetal = (isInitial = false): Petal => {
      const type = Math.random() > 0.5 ? 'rose' : 'marigold';
      const colors = type === 'rose' ? roseColors : marigoldColors;
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : -30,
        r: Math.random() * 8 + 6, // Slightly larger for better realism
        speedY: Math.random() * 1.0 + 0.7,
        speedX: Math.random() * 0.8 - 0.4,
        angle: Math.random() * 360,
        spinSpeed: Math.random() * 1.5 - 0.75,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.35 + 0.5,
        type,
        flutterAngle: Math.random() * Math.PI * 2,
        flutterSpeed: Math.random() * 0.03 + 0.015,
      };
    };

    // Populate initial petals
    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    // Active burst particle array
    const burstParticles: BurstParticle[] = [];
    const gravity = 0.18; // Slightly lower gravity for smoother, slower float

    // Handle the custom "shubh-burst" celebration trigger
    const handleShubhBurst = () => {
      const isMobile = window.innerWidth < 768;
      const cannonParticles = isMobile ? 45 : 95;
      const centerParticles = isMobile ? 35 : 70;

      const goldColors = ['#FFDF00', '#D4AF37', '#FFC000', '#AA7C11'];

      // Left Cannon (blasts from bottom-left corner diagonally up-right)
      for (let i = 0; i < cannonParticles; i++) {
        const typeRand = Math.random();
        const type = typeRand < 0.4 ? 'rose' : typeRand < 0.8 ? 'marigold' : 'glitter';
        const color = type === 'rose' 
          ? roseColors[Math.floor(Math.random() * roseColors.length)]
          : type === 'marigold'
          ? marigoldColors[Math.floor(Math.random() * marigoldColors.length)]
          : goldColors[Math.floor(Math.random() * goldColors.length)];

        burstParticles.push({
          x: -15,
          y: height - 40,
          r: Math.random() * 9 + 6,
          speedX: Math.random() * 15 + 7,
          speedY: -(Math.random() * 19 + 13),
          angle: Math.random() * 360,
          spinSpeed: Math.random() * 8 - 4,
          color,
          opacity: 1,
          type,
          decay: Math.random() * 0.006 + 0.004,
          flutterAngle: Math.random() * Math.PI * 2,
          flutterSpeed: Math.random() * 0.05 + 0.02,
        });
      }

      // Right Cannon (blasts from bottom-right corner diagonally up-left)
      for (let i = 0; i < cannonParticles; i++) {
        const typeRand = Math.random();
        const type = typeRand < 0.4 ? 'rose' : typeRand < 0.8 ? 'marigold' : 'glitter';
        const color = type === 'rose' 
          ? roseColors[Math.floor(Math.random() * roseColors.length)]
          : type === 'marigold'
          ? marigoldColors[Math.floor(Math.random() * marigoldColors.length)]
          : goldColors[Math.floor(Math.random() * goldColors.length)];

        burstParticles.push({
          x: width + 15,
          y: height - 40,
          r: Math.random() * 9 + 6,
          speedX: -(Math.random() * 15 + 7),
          speedY: -(Math.random() * 19 + 13),
          angle: Math.random() * 360,
          spinSpeed: Math.random() * 8 - 4,
          color,
          opacity: 1,
          type,
          decay: Math.random() * 0.006 + 0.004,
          flutterAngle: Math.random() * Math.PI * 2,
          flutterSpeed: Math.random() * 0.05 + 0.02,
        });
      }

      // Center sky explosion
      for (let i = 0; i < centerParticles; i++) {
        const speed = Math.random() * 7 + 4;
        const angleRad = Math.random() * Math.PI * 2;
        const typeRand = Math.random();
        const type = typeRand < 0.45 ? 'rose' : typeRand < 0.9 ? 'marigold' : 'glitter';
        const color = type === 'rose' 
          ? roseColors[Math.floor(Math.random() * roseColors.length)]
          : type === 'marigold'
          ? marigoldColors[Math.floor(Math.random() * marigoldColors.length)]
          : goldColors[Math.floor(Math.random() * goldColors.length)];

        burstParticles.push({
          x: width / 2,
          y: height * 0.45,
          r: Math.random() * 8 + 5,
          speedX: Math.cos(angleRad) * speed,
          speedY: Math.sin(angleRad) * speed - 2,
          angle: Math.random() * 360,
          spinSpeed: Math.random() * 10 - 5,
          color,
          opacity: 1,
          type,
          decay: Math.random() * 0.008 + 0.005,
          flutterAngle: Math.random() * Math.PI * 2,
          flutterSpeed: Math.random() * 0.06 + 0.02,
        });
      }
    };

    window.addEventListener('shubh-burst', handleShubhBurst);

    // Realistic Rose Petal Renderer
    const drawRosePetal = (pCtx: CanvasRenderingContext2D, r: number, color: string, opacity: number) => {
      pCtx.save();
      pCtx.globalAlpha = opacity;

      // Realistic rose petal heart/droplet path
      pCtx.beginPath();
      pCtx.moveTo(0, -r);
      // Top left organic curve
      pCtx.bezierCurveTo(r * 1.3, -r * 1.1, r * 1.5, r * 0.3, 0, r * 1.1);
      // Top right organic curve
      pCtx.bezierCurveTo(-r * 1.5, r * 0.3, -r * 1.3, -r * 1.1, 0, -r);
      pCtx.closePath();

      // Premium radial gradient for authentic lighting/shading
      const grad = pCtx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r * 1.3);
      grad.addColorStop(0, '#FFF5F5'); // Soft light velvet reflection
      grad.addColorStop(0.3, color);   // Rich main rose pigment
      grad.addColorStop(1, '#50050E');   // Deep dramatic dark shadow base
      pCtx.fillStyle = grad;
      pCtx.fill();

      // Delicate leaf veins/folds for premium realistic look
      pCtx.strokeStyle = '#FFFFFF';
      pCtx.lineWidth = 0.55;
      pCtx.globalAlpha = opacity * 0.35;
      pCtx.beginPath();
      pCtx.moveTo(0, r * 1.1);
      pCtx.quadraticCurveTo(r * 0.25, r * 0.2, 0, -r * 0.85);
      pCtx.stroke();

      pCtx.beginPath();
      pCtx.moveTo(0, r * 0.4);
      pCtx.quadraticCurveTo(-r * 0.45, 0, -r * 0.8, -r * 0.2);
      pCtx.stroke();

      pCtx.beginPath();
      pCtx.moveTo(0, r * 0.5);
      pCtx.quadraticCurveTo(r * 0.45, r * 0.1, r * 0.8, -r * 0.1);
      pCtx.stroke();

      pCtx.restore();
    };

    // Realistic Ruffled Marigold Petal Renderer
    const drawMarigoldPetal = (pCtx: CanvasRenderingContext2D, r: number, color: string, opacity: number) => {
      pCtx.save();
      pCtx.globalAlpha = opacity;

      // Organic ruffled layered marigold petal shape
      pCtx.beginPath();
      pCtx.moveTo(0, -r * 1.25);
      pCtx.bezierCurveTo(r * 0.9, -r * 1.3, r * 1.1, -r * 0.4, r * 0.2, r * 0.9);
      pCtx.bezierCurveTo(0, r * 1.2, -r * 0.2, r * 0.9, -r * 1.1, -r * 0.4);
      pCtx.bezierCurveTo(-r * 0.8, -r * 1.3, 0, -r * 1.25, 0, -r * 1.25);
      pCtx.closePath();

      // Multi-step linear gradient reflecting marigold pigment variance
      const grad = pCtx.createLinearGradient(0, r, 0, -r * 1.2);
      grad.addColorStop(0, '#B33C00');   // Rich deep vermilion base
      grad.addColorStop(0.45, color);    // Saffron Orange/Yellow mid
      grad.addColorStop(1, '#FFE853');   // Lighter bright yellow ruffled tips
      pCtx.fillStyle = grad;
      pCtx.fill();

      // Highly detailed internal ruffles and texture lines
      pCtx.strokeStyle = '#FFE853';
      pCtx.lineWidth = 0.7;
      pCtx.globalAlpha = opacity * 0.6;
      pCtx.beginPath();
      pCtx.moveTo(0, r * 0.85);
      pCtx.lineTo(0, -r * 1.1);
      pCtx.stroke();

      pCtx.beginPath();
      pCtx.moveTo(-r * 0.3, r * 0.4);
      pCtx.quadraticCurveTo(-r * 0.4, -r * 0.2, -r * 0.5, -r * 0.8);
      pCtx.stroke();

      pCtx.beginPath();
      pCtx.moveTo(r * 0.3, r * 0.4);
      pCtx.quadraticCurveTo(r * 0.4, -r * 0.2, r * 0.5, -r * 0.8);
      pCtx.stroke();

      pCtx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw regular background falling marigold/rose petals with smooth tumble mechanics
      petals.forEach((petal, index) => {
        // Smooth flutter update
        petal.flutterAngle += petal.flutterSpeed;
        
        // Dynamic horizontal sway based on flutter wave + gentle wind speed
        const sway = Math.sin(petal.flutterAngle) * 0.85;
        
        // Slower and smoother vertical glide depending on physical size and flip status
        const speedMultiplier = 0.5 + Math.abs(Math.cos(petal.flutterAngle)) * 0.5;
        petal.y += petal.speedY * speedMultiplier;
        petal.x += petal.speedX + sway;
        petal.angle += petal.spinSpeed;

        if (petal.y > height + 40 || petal.x < -40 || petal.x > width + 40) {
          petals[index] = createPetal(false);
        }

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate((petal.angle * Math.PI) / 180);
        
        // Realistic 3D Tumbling/Flipping Effect using scale transforms
        const scaleX = Math.sin(petal.flutterAngle);
        const scaleY = Math.cos(petal.flutterAngle * 0.5);
        ctx.scale(scaleX, scaleY);

        if (petal.type === 'rose') {
          drawRosePetal(ctx, petal.r, petal.color, petal.opacity);
        } else {
          drawMarigoldPetal(ctx, petal.r, petal.color, petal.opacity);
        }

        ctx.restore();
      });

      // 2. Draw active burst rose & marigold petals & golden sparkles with physics
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        
        // Physics updates
        p.speedY += gravity;
        p.flutterAngle += p.flutterSpeed;
        
        // Air resistance dampening for ultra-smooth trajectory curves
        p.speedX *= 0.985;
        p.speedY *= 0.985;

        // Apply organic sway wave as speed decays
        const sway = Math.sin(p.flutterAngle) * 0.6;
        p.x += p.speedX + sway;
        p.y += p.speedY;
        p.angle += p.spinSpeed;
        p.opacity -= p.decay;

        // Clean up invisible particles
        if (p.opacity <= 0 || p.y > height + 40 || p.x < -40 || p.x > width + 40) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        
        if (p.type !== 'glitter') {
          // Dynamic 3D Tumbling/Flipping for realistic flowers
          const scaleX = Math.sin(p.flutterAngle);
          const scaleY = Math.cos(p.flutterAngle * 0.5);
          ctx.scale(scaleX, scaleY);
        }

        if (p.type === 'rose') {
          drawRosePetal(ctx, p.r, p.color, p.opacity);
        } else if (p.type === 'marigold') {
          drawMarigoldPetal(ctx, p.r, p.color, p.opacity);
        } else {
          // Glistening gold diamond glitter sparkles with dynamic glow trail
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.lineTo(p.r, 0);
          ctx.lineTo(0, p.r);
          ctx.lineTo(-p.r, 0);
          ctx.closePath();
          ctx.fill();
          
          // Outer magical glow aura
          ctx.shadowColor = '#FFDF00';
          ctx.shadowBlur = 8;
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
