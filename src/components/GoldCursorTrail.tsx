import React, { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
  angle: number;
  angularVelocity: number;
  isStar: boolean;
}

export default function GoldCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const sparks: Spark[] = [];
    
    // Rich royal wedding gold shades
    const colors = [
      '#FFDF00', // Traditional Golden
      '#D4AF37', // Royal Metallic Gold
      '#FFD700', // Pure Gold
      '#FFF9D0', // Shimmering Off-White Gold
      '#FF9933', // Subtle Saffron Sparkle
    ];

    let lastX = 0;
    let lastY = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const createSparks = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.9 + 0.3;
        const isStar = Math.random() > 0.55; // ~45% chance of being a beautiful star spark
        
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3,
          vy: Math.sin(angle) * speed + 0.4, // Slight gravity drift downward
          alpha: 1,
          decay: Math.random() * 0.015 + 0.018, // Lifespan of sparks
          size: Math.random() * 2.2 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * Math.PI * 2,
          angularVelocity: (Math.random() - 0.5) * 0.06,
          isStar
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 3) {
        // More speed means more vibrant sparks
        const count = Math.min(Math.floor(dist / 6) + 1, 4);
        createSparks(x, y, count);
        lastX = x;
        lastY = y;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 4) {
        const count = Math.min(Math.floor(dist / 8) + 1, 3);
        createSparks(x, y, count);
        lastX = x;
        lastY = y;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Helper to draw a beautiful 4-pointed star
    const drawStar = (context: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        
        // Physics integration
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.angle += spark.angularVelocity;
        spark.alpha -= spark.decay;

        if (spark.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = spark.alpha;
        ctx.fillStyle = spark.color;
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = spark.size * 3.5;

        if (spark.isStar) {
          ctx.translate(spark.x, spark.y);
          ctx.rotate(spark.angle);
          drawStar(ctx, 0, 0, 4, spark.size * 2.8, spark.size * 0.45);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
