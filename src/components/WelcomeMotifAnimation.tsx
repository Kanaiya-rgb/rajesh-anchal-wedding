import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface FloatingMotif {
  id: number;
  type: 'namaste' | 'kalash' | 'shehnai' | 'diya' | 'goli';
  x: number; // percentage left (0 to 100)
  size: number; // size in pixels
  delay: number; // animation delay
  duration: number; // animation duration
  sway: number; // horizontal sway distance
  opacity: number;
}

export default function WelcomeMotifAnimation() {
  const [motifs, setMotifs] = useState<FloatingMotif[]>([]);

  useEffect(() => {
    // Generate a fixed set of beautiful, high-quality floating welcoming motifs
    // that drift upwards to avoid performance overhead of continuous generation.
    const initialMotifs: FloatingMotif[] = Array.from({ length: 14 }).map((_, i) => {
      const types: Array<'namaste' | 'kalash' | 'shehnai' | 'diya'> = ['namaste', 'kalash', 'shehnai', 'diya'];
      return {
        id: i,
        type: types[i % types.length],
        x: 4 + (i * 7) + (Math.random() * 4), // Spread across screen width
        size: Math.random() * 25 + 40, // 40px to 65px (slightly larger for better visibility)
        delay: Math.random() * 12,
        duration: Math.random() * 18 + 22, // 22s to 40s drift time for elegant slow rise
        sway: Math.random() * 50 + 25,
        opacity: Math.random() * 0.15 + 0.18, // Enhanced opacity so they are clearly visible
      };
    });
    setMotifs(initialMotifs);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1] select-none">
      {motifs.map((motif) => (
        <motion.div
          key={motif.id}
          className="absolute flex flex-col items-center justify-center filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]"
          style={{
            left: `${motif.x}%`,
            width: motif.size,
            height: motif.size,
            bottom: '-15%',
          }}
          initial={{ y: 0, x: 0, opacity: 0, scale: 0.8 }}
          animate={{
            y: [0, -window.innerHeight - 300],
            x: [0, motif.sway, -motif.sway, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0, motif.opacity, motif.opacity * 0.8, 0],
            scale: [0.8, 1.1, 1, 0.8],
          }}
          transition={{
            duration: motif.duration,
            delay: motif.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {motif.type === 'namaste' && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-wedding-crimson/35 hover:text-wedding-crimson/50 transition-colors duration-300"
            >
              {/* Traditional Namaste Hands */}
              <path d="M12 2C11.5 2 11 3 11 5V13C11 14 11.5 15 12 15C12.5 15 13 14 13 13V5C13 3 12.5 2 12 2Z" fill="rgba(139,28,45,0.06)" />
              <path d="M11 5.5C9.5 6 8.5 7.5 8.5 9.5V13.5C8.5 15 9.5 16 11 16.5V18.5" />
              <path d="M13 5.5C14.5 6 15.5 7.5 15.5 9.5V13.5C15.5 15 14.5 16 13 16.5V18.5" />
              <path d="M9 19.5C9 20.5 10 21.5 12 21.5C14 21.5 15 20.5 15 19.5" />
              <path d="M12 18.5V21.5" />
              {/* Aura/Blessing rays above */}
              <line x1="12" y1="1" x2="12" y2="2" strokeWidth="1.5" />
              <line x1="9" y1="2.5" x2="10" y2="3.5" strokeWidth="1.5" />
              <line x1="15" y1="2.5" x2="14" y2="3.5" strokeWidth="1.5" />
            </svg>
          )}

          {motif.type === 'kalash' && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-saffron/40"
            >
              {/* Traditional Auspicious Welcome Kalash */}
              <path d="M6 11C6 7 8 6 12 6C16 6 18 7 18 11C18 16 16 19 12 19C8 19 6 16 6 11Z" fill="rgba(255,153,51,0.06)" />
              <path d="M8 6H16" />
              <path d="M9 6C9 4 10 3 12 3C14 3 15 4 15 6" />
              {/* Coconut & Mango Leaves top */}
              <path d="M12 3L12 1" />
              <path d="M10 6L7 4" />
              <path d="M14 6L17 4" />
              {/* Swastik or auspicious line on Kalash */}
              <path d="M12 10V15" />
              <path d="M10 12.5H14" />
              <path d="M10 10H11" />
              <path d="M13 15H14" />
              <path d="M9 19H15" strokeWidth="1.5" />
            </svg>
          )}

          {motif.type === 'shehnai' && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-royal-gold/45"
            >
              {/* Traditional Welcoming Shehnai */}
              <path d="M4 19L17 6" />
              <path d="M3 21C2.5 21.5 3.5 21.5 4 21C5 20 6 19 6 19L5 18L3 21Z" fill="rgba(212,175,55,0.06)" />
              <path d="M16 5.5L18.5 8C20 6.5 21.5 5 22 3.5C22.5 2 22 1.5 21 1.5C19.5 1.5 18 3 16 5.5Z" />
              {/* Sound waves/Music notes */}
              <path d="M19 12C20.5 11 21 12 22 11" />
              <path d="M15 16C16.5 15 17 16 18 15" />
              {/* Tassel */}
              <path d="M10 13C9 14 8 15 8 16" />
              <circle cx="8" cy="17.5" r="1" fill="currentColor" />
            </svg>
          )}

          {motif.type === 'diya' && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-marigold-yellow/45"
            >
              {/* Auspicious Welcome Oil Lamp / Diya */}
              <path d="M3 13C3 17.5 7 19.5 12 19.5C17 19.5 21 17.5 21 13H3Z" fill="rgba(255,191,0,0.06)" />
              <path d="M12 13V19.5" />
              {/* Sacred Flame */}
              <path d="M12 11C12 11 10.5 8.5 11 6C11.5 3.5 12 2 12 2C12 2 12.5 3.5 13 6C13.5 8.5 12 11 12 11Z" fill="currentColor" className="text-marigold-orange/50" />
              {/* Base pedestal */}
              <path d="M8 19.5L7 21.5H17L16 19.5" />
            </svg>
          )}

          {/* Hindi Welcoming Text Caption under icons for absolute magical theme */}
          <span className="text-[10px] font-bold font-wedding-display tracking-widest text-wedding-maroon/40 mt-1 whitespace-nowrap filter drop-shadow-sm">
            {motif.type === 'namaste' && 'स्वागतम्'}
            {motif.type === 'kalash' && 'शुभ लाभ'}
            {motif.type === 'shehnai' && 'मंगल ध्वनि'}
            {motif.type === 'diya' && 'शुभ विवाह'}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
