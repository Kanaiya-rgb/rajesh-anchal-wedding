import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Flame, Volume2, ArrowRight } from 'lucide-react';
// @ts-ignore
import couple1Img from '@/assets/.aistudio/couple1.jpeg';
// @ts-ignore
import couple2Img from '@/assets/.aistudio/couple2.jpeg';

interface WelcomeOverlayProps {
  onEnter: (selectedLang: 'en' | 'hi' | 'mix') => void;
}

export default function WelcomeOverlay({ onEnter }: WelcomeOverlayProps) {
  const [isLit, setIsLit] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [langChoice, setLangChoice] = useState<'en' | 'hi' | 'mix'>('mix');
  
  // Opening sequence phases: 'diya' -> 'gate-closed' -> 'gate-opening' -> 'welcome-couple'
  const [phase, setPhase] = useState<'diya' | 'gate-closed' | 'gate-opening' | 'welcome-couple'>('diya');
  const [activePhoto, setActivePhoto] = useState<1 | 2>(1);
  const [photoError1, setPhotoError1] = useState(false);
  const [photoError2, setPhotoError2] = useState(false);

  // Cycle the couple's welcoming photos to simulate welcoming movement
  useEffect(() => {
    if (phase === 'welcome-couple') {
      const interval = setInterval(() => {
        setActivePhoto(prev => (prev === 1 ? 2 : 1));
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleLightDiya = () => {
    if (isLit) return;
    setIsLit(true);

    // Play wedding music directly under click gesture context to bypass browser autoplay blocks
    if (typeof (window as any).playWeddingMusicDirectly === 'function') {
      try {
        (window as any).playWeddingMusicDirectly();
      } catch (err) {
        console.warn("Direct play trigger error:", err);
        window.dispatchEvent(new CustomEvent('play-wedding-music'));
      }
    } else {
      window.dispatchEvent(new CustomEvent('play-wedding-music'));
    }

    // Fire shubh burst petals
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('shubh-burst'));
    }, 400);

    // Transition to closed gates after diya lights up
    setTimeout(() => {
      setPhase('gate-closed');
      
      // Auto open gates after a small dramatic pause
      setTimeout(() => {
        setPhase('gate-opening');
        
        // After gates open and Ganesha blesses, transition to couple welcome
        setTimeout(() => {
          setPhase('welcome-couple');
        }, 3800);
      }, 1000);
    }, 1800);
  };

  const handleEnterInvitation = () => {
    setIsVisible(false);
    onEnter(langChoice);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={`fixed inset-0 z-[9999] overflow-x-hidden overflow-y-auto select-none bg-gradient-to-b ${
            phase === 'diya'
              ? isLit
                ? 'from-wedding-maroon via-[#9a1b24] to-[#e07a24]'
                : 'from-[#3a060e] via-wedding-maroon to-[#5c0b15]'
              : 'from-[#2c040a] via-wedding-maroon to-[#1f0206]'
          } transition-all duration-[2000ms] ease-out`}
        >
          {/* INNER WRAPPER FOR FULL HEIGHT & SCROLLABLE CONTENT WITH EMBEDDED BORDERS */}
          <div className="relative min-h-screen w-full max-w-2xl mx-auto flex flex-col items-center justify-between text-center px-4 py-4 sm:py-8 z-10">
            {/* ROYAL GOLDEN FILIGREE BORDER FRAME */}
            <div className="absolute inset-2 sm:inset-4 border-2 border-royal-gold/40 pointer-events-none z-30 rounded-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-bright-gold rounded-tl-sm" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-bright-gold rounded-tr-sm" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-bright-gold rounded-bl-sm" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-bright-gold rounded-br-sm" />
              <div className="absolute inset-1.5 border border-royal-gold/25 rounded-md" />
            </div>

            {/* HANGING MARIGOLD AND LEAF TORAN */}
            <div className="absolute top-2 sm:top-4 inset-x-2 sm:inset-x-4 flex justify-around pointer-events-none z-20 opacity-80">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[1px] h-6 md:h-16 bg-gradient-to-b from-transparent to-marigold-orange/40" />
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-marigold-yellow border border-marigold-orange shadow-sm flex items-center justify-center text-[5px] sm:text-[6px] text-white">❀</div>
                  <div className="w-1.5 h-3.5 sm:w-2 sm:h-4.5 bg-henna-green rounded-b-full shadow-sm mt-0.5" />
                </div>
              ))}
            </div>

            {/* HEADER PLACEHOLDER FOR PUSH DOWN */}
            <div className="h-4 sm:h-10 w-full" />

            {/* MAIN WORKSPACE CONTAINER */}
            <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center relative z-10 py-2 sm:py-6 px-2">
            
            {/* ================= PHASE 1: DIYA LIGHTING ================= */}
            {phase === 'diya' && (
              <motion.div
                key="diya-phase"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-2.5 sm:gap-6 w-full"
              >
                {/* Elegant Lord Ganesha Icon Outline */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.95 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="w-10 h-10 sm:w-18 sm:h-18 text-bright-gold mb-0.5"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-bright-gold" strokeWidth="2" strokeLinecap="round">
                    <path d="M40 20 L50 10 L60 20 Z" fill="rgba(212, 175, 55, 0.2)" />
                    <path d="M45 20 L50 14 L55 20" />
                    <path d="M50 20 C35 25 35 45 42 50 C45 52 48 48 50 45 C52 48 55 52 58 50 C65 45 65 25 50 20" />
                    <path d="M50 45 C50 65 35 65 35 75 C35 80 40 82 45 80" />
                    <path d="M40 25 C25 22 25 40 40 42" />
                    <path d="M60 25 C75 22 75 40 60 42" />
                    <path d="M43 45 L38 47" />
                    <circle cx="65" cy="72" r="3" fill="#D4AF37" />
                    <line x1="50" y1="23" x2="50" y2="32" stroke="#FF5722" strokeWidth="3" />
                  </svg>
                </motion.div>

                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-bright-gold font-wedding-devanagari text-base sm:text-2xl tracking-widest block text-shadow-gold">
                    ॥ शुभ विवाह आमंत्रण ॥
                  </span>
                  <span className="text-royal-gold font-wedding-serif text-[10px] sm:text-xs tracking-[0.12em] uppercase block font-bold">
                    Rajesh &amp; Anchal Wedding Invitation
                  </span>
                </div>

                <h1 className="text-xl sm:text-5xl font-wedding-display font-extrabold text-white tracking-wider drop-shadow-md">
                  पधारो म्हारे देस
                </h1>
                
                <p className="text-gray-100 font-wedding-serif text-[10.5px] sm:text-xs max-w-sm mx-auto italic px-4 leading-relaxed font-semibold">
                  "We welcome you with open hearts. Please light the sacred Diya to begin our celebrations."
                  <span className="text-[10px] sm:text-xs text-bright-gold block mt-0.5 font-wedding-devanagari">"आपका सहृदय स्वागत है। मंगल उत्सव प्रारंभ करने हेतु पवित्र दीप प्रज्वलित करें।"</span>
                </p>

                {/* THE DIYA ASSET */}
                <div className="relative my-1 sm:my-4 flex flex-col items-center justify-center">
                  <div className={`absolute w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-bright-gold/25 filter blur-xl transition-all duration-1000 ${isLit ? 'scale-150 opacity-100' : 'scale-50 opacity-40'}`} />

                  {/* Glowing flame when lit */}
                  <div className="h-10 sm:h-18 flex items-end justify-center relative">
                    <AnimatePresence>
                      {isLit && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [1, 1.15, 0.95, 1.1, 1],
                            opacity: 1,
                            y: [0, -3, 1, -2, 0]
                          }}
                          transition={{
                            scale: { duration: 0.6, ease: "easeOut" },
                            y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                          }}
                          className="absolute -top-1 z-20 flex flex-col items-center"
                        >
                          <div className="w-7 h-10 sm:w-9 sm:h-13 bg-gradient-to-t from-marigold-orange via-bright-gold to-white rounded-full rounded-b-xl shadow-[0_0_25px_#FFDF00] filter blur-[0.2px] border border-bright-gold/25" />
                          <div className="w-2.5 h-4.5 sm:w-3.5 sm:h-7 bg-white rounded-full absolute bottom-1 filter blur-[1px] opacity-90" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Clay Diya Vessel */}
                  <motion.div
                    animate={isLit ? { y: [0, -2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <svg viewBox="0 0 100 50" className="w-28 h-14 sm:w-44 sm:h-22 drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] relative z-10">
                      <ellipse cx="50" cy="18" rx="38" ry="8" fill="#AA7C11" />
                      <path
                        d="M10,18 C10,38 90,38 90,18 C90,12 80,10 50,10 C20,10 10,12 10,18 Z"
                        fill="url(#clayGradientWelcome)"
                        stroke="#AA7C11"
                        strokeWidth="1.5"
                      />
                      <path d="M50,10 L50,16" stroke="#4A3B32" strokeWidth="3" strokeLinecap="round" />
                      <path
                        d="M20,24 C30,30 40,30 50,24 C60,30 70,30 80,24"
                        fill="none"
                        stroke="#FFDF00"
                        strokeWidth="1.2"
                        strokeDasharray="2, 2"
                        opacity="0.9"
                      />
                      <circle cx="50" cy="30" r="3.5" fill="#FFDF00" opacity="0.95" />
                      <circle cx="35" cy="27" r="2.5" fill="#FFDF00" opacity="0.85" />
                      <circle cx="65" cy="27" r="2.5" fill="#FFDF00" opacity="0.85" />
                      <defs>
                        <linearGradient id="clayGradientWelcome" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#D4AF37" />
                          <stop offset="35%" stopColor="#C54B22" />
                          <stop offset="70%" stopColor="#8B4513" />
                          <stop offset="100%" stopColor="#3d1402" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                </div>

                {/* LANGUAGE CHOSEN */}
                <div className="w-full max-w-[270px] sm:max-w-sm px-2 sm:px-4">
                  <p className="text-bright-gold font-wedding-devanagari text-[8.5px] sm:text-[10px] uppercase tracking-wider mb-1 sm:mb-2 font-bold">
                    ॥ निमंत्रण की भाषा चुनें / Choose Invitation Language ॥
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {['en', 'hi', 'mix'].map((l) => (
                      <button
                        key={l}
                        onClick={() => !isLit && setLangChoice(l as any)}
                        type="button"
                        className={`py-1 sm:py-1.5 rounded-lg border text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                          langChoice === l
                            ? 'bg-gradient-to-r from-bright-gold to-royal-gold text-wedding-maroon border-bright-gold font-bold scale-105 shadow-[0_0_10px_rgba(255,223,0,0.4)]'
                            : 'bg-black/30 text-royal-gold/90 border-royal-gold/20 hover:bg-black/50 hover:border-royal-gold/40'
                        }`}
                      >
                        <span className="text-[10px] sm:text-xs font-semibold">
                          {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'दोनों Mix'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* LIGHT DIYA BUTTON */}
                <button
                  onClick={handleLightDiya}
                  disabled={isLit}
                  className={`relative px-4 py-2 sm:px-8 sm:py-3.5 rounded-full font-wedding-display text-[10px] sm:text-sm uppercase tracking-widest font-bold shadow-2xl transition-all duration-300 border-2 flex items-center gap-2 ${
                    isLit
                      ? 'bg-wedding-maroon/80 text-gray-400 border-gray-600 scale-95'
                      : 'bg-gradient-to-r from-bright-gold via-marigold-yellow to-royal-gold hover:from-bright-gold hover:to-bright-gold text-wedding-maroon border-white hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(255,223,0,0.4)]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-wedding-crimson shrink-0" />
                  <span>{isLit ? 'मंगल उत्सव का शुभारंभ...' : 'शुभ दीप प्रज्वलित करें (Light Diya)'}</span>
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-wedding-crimson shrink-0" />
                </button>
              </motion.div>
            )}

                        {/* ================= PHASE 2: GATES AND GANESHA POP-UP ================= */}
            {(phase === 'gate-closed' || phase === 'gate-opening') && (
              <motion.div
                key="gate-phase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center relative min-h-[300px] sm:min-h-[450px]"
              >
                {/* Divine rays expanding behind */}
                <div className="absolute w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] rounded-full bg-radial-gradient from-bright-gold/20 via-transparent to-transparent opacity-80 animate-pulse-ring z-0" />

                {/* Ganesha blessing emerging inside the gate archway */}
                <AnimatePresence>
                  {phase === 'gate-opening' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 50 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        y: 0,
                        rotate: [0, -2, 2, 0]
                      }}
                      transition={{ 
                        delay: 0.6,
                        duration: 1.8,
                        ease: "easeOut",
                        scale: { type: "spring", stiffness: 70, damping: 10 }
                      }}
                      className="absolute z-10 flex flex-col items-center justify-center text-center p-2 max-w-[240px] sm:max-w-[280px]"
                    >
                      {/* Aura */}
                      <div className="absolute w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-bright-gold/30 filter blur-xl animate-pulse" />

                      {/* Ornate Ganesha image */}
                      <div className="relative p-1.5 sm:p-2 bg-[#42040c] border-3 sm:border-4 border-bright-gold rounded-full shadow-[0_0_35px_rgba(255,223,0,0.6)] overflow-hidden w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center">
                        <img 
                          src="https://thekraftyresin.com/cdn/shop/files/ganeshji.webp?v=1739780216" 
                          alt="Lord Ganesha Pop Up Blessing" 
                          className="w-[90%] h-auto object-contain rounded-full brightness-110 drop-shadow-[0_0_12px_rgba(255,223,0,0.5)]"
                          referrerPolicy="no-referrer"
                        />
                        {/* Shimmer dashed gold ring */}
                        <div className="absolute inset-1 border border-dashed border-bright-gold rounded-full pointer-events-none opacity-80" />
                      </div>

                      {/* Shloka Text */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.8 }}
                        className="mt-2.5 sm:mt-4 bg-black/40 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-royal-gold/30"
                      >
                        <span className="text-bright-gold font-wedding-devanagari text-[10px] sm:text-xs tracking-widest block font-semibold animate-pulse">
                          ॥ श्री गणेशाय नमः ॥
                        </span>
                        <span className="text-white font-wedding-devanagari text-[8px] sm:text-[9px] block mt-0.5 opacity-90 leading-tight">
                          वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br/>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
                        </span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* THE ROYAL GATES (3D SWINGING OPEN) */}
                <div className="w-full max-w-[400px] h-[260px] sm:h-[340px] relative flex items-center justify-center z-20 overflow-visible" style={{ perspective: '1200px' }}>
                  
                  {/* Left Gate Door Panel */}
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={phase === 'gate-opening' ? { rotateY: -105 } : { rotateY: 0 }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                    className="absolute left-0 w-1/2 h-full bg-gradient-to-r from-[#4d0c14] to-[#7c1421] border-2 border-royal-gold rounded-l-2xl shadow-2xl flex flex-col items-end justify-center pr-2"
                    style={{ 
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                      boxShadow: '-15px 15px 30px rgba(0,0,0,0.6)'
                    }}
                  >
                    {/* Golden ornaments on door */}
                    <div className="absolute inset-2 border border-royal-gold/30 rounded-lg flex items-center justify-end pr-2 pointer-events-none">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border border-royal-gold/40 rounded-full flex items-center justify-center opacity-60">
                        <span className="text-bright-gold text-[9px] sm:text-[10px]">शुभ</span>
                      </div>
                    </div>
                    {/* Traditional Brass Knocker handle */}
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-bright-gold bg-yellow-600/30 flex items-center justify-center shadow-lg relative z-10 translate-x-1.5 sm:translate-x-2 mr-1">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-bright-gold border border-wedding-maroon" />
                    </div>
                    {/* Hanging bells */}
                    <div className="absolute bottom-4 left-4 w-4 h-10 border-l border-bright-gold/40 flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-bright-gold mt-4" />
                    </div>
                  </motion.div>

                  {/* Right Gate Door Panel */}
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={phase === 'gate-opening' ? { rotateY: 105 } : { rotateY: 0 }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                    className="absolute right-0 w-1/2 h-full bg-gradient-to-l from-[#4d0c14] to-[#7c1421] border-2 border-royal-gold rounded-r-2xl shadow-2xl flex flex-col items-start justify-center pl-2"
                    style={{ 
                      transformOrigin: 'right center',
                      transformStyle: 'preserve-3d',
                      boxShadow: '15px 15px 30px rgba(0,0,0,0.6)'
                    }}
                  >
                    {/* Golden ornaments on door */}
                    <div className="absolute inset-2 border border-royal-gold/30 rounded-lg flex items-center justify-start pl-2 pointer-events-none">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border border-royal-gold/40 rounded-full flex items-center justify-center opacity-60">
                        <span className="text-bright-gold text-[9px] sm:text-[10px]">लाभ</span>
                      </div>
                    </div>
                    {/* Traditional Brass Knocker handle */}
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-bright-gold bg-yellow-600/30 flex items-center justify-center shadow-lg relative z-10 -translate-x-1.5 sm:-translate-x-2 ml-1">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-bright-gold border border-wedding-maroon" />
                    </div>
                    {/* Hanging bells */}
                    <div className="absolute bottom-4 right-4 w-4 h-10 border-r border-bright-gold/40 flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-bright-gold mt-4" />
                    </div>
                  </motion.div>

                  {/* Elegant Temple Arch Framing the gates */}
                  <div className="absolute inset-0 border-4 border-royal-gold/50 pointer-events-none rounded-2xl z-30">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 bg-bright-gold border-2 border-wedding-maroon rounded-t-full shadow-lg flex items-center justify-center">
                      <span className="text-[7px] text-wedding-maroon font-bold font-wedding-devanagari">ॐ</span>
                    </div>
                  </div>

                </div>

                <div className="mt-4 text-center z-30">
                  <p className="text-bright-gold font-wedding-devanagari text-xs tracking-wider font-semibold animate-pulse">
                    द्वार खुल रहे हैं... स्वागत की पावन बेला
                  </p>
                  <p className="text-gray-400 font-wedding-serif text-[10px] mt-0.5">
                    "The grand palace gates are opening for you..."
                  </p>
                </div>
              </motion.div>
            )}

            {/* ================= PHASE 3: WELCOME COUPLE ANIMATION ================= */}
            {phase === 'welcome-couple' && (
              <motion.div
                key="welcome-couple-phase"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full flex flex-col items-center gap-4 relative"
              >
                {/* Tiny Blessed Ganesha at top center as protector */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  className="flex flex-col items-center mb-1 bg-[#470710]/80 px-4 py-1.5 rounded-full border border-royal-gold/40 shadow-inner"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://thekraftyresin.com/cdn/shop/files/ganeshji.webp?v=1739780216" 
                      alt="Mini Ganesha" 
                      className="w-6 h-6 object-contain rounded-full border border-bright-gold"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-bright-gold font-wedding-devanagari text-[10px] tracking-widest font-semibold">
                      ॥ वक्रतुण्डाय हुम् ॥ मंगल मूर्ति सदा सहाय करें
                    </span>
                  </div>
                </motion.div>

                {/* COUPLE PHOTO CONTAINER - GENTLE GREETING/BOWING ANIMATION */}
                <div className="relative w-[230px] sm:w-[320px] h-[310px] sm:h-[420px] rounded-t-full rounded-b-2xl border-4 border-royal-gold bg-wedding-maroon/90 shadow-[0_15px_35px_rgba(0,0,0,0.7)] p-2 overflow-hidden flex flex-col items-center justify-center">
                  
                  {/* Soft Divine Background Glow */}
                  <div className="absolute inset-0 bg-radial-gradient from-bright-gold/25 via-transparent to-transparent opacity-80 animate-pulse" />

                  {/* Floral Garlands/Toran on Frame */}
                  <div className="absolute top-1 inset-x-2 flex justify-between px-4 z-20 opacity-70 pointer-events-none">
                    <div className="text-[10px] text-marigold-yellow animate-bounce">✿</div>
                    <div className="text-[10px] text-marigold-yellow animate-ping">✿</div>
                    <div className="text-[10px] text-marigold-yellow animate-bounce">✿</div>
                  </div>

                  {/* SWITCHING COUPLE IMAGES */}
                  <div className="relative w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-[#240307]">
                    
                    {/* PHOTO 1: Without Garlands (Normal) */}
                    <AnimatePresence mode="wait">
                      {activePhoto === 1 ? (
                        <motion.div
                          key="photo1"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            y: [0, -4, 0],
                            rotate: [0, -0.5, 0.5, 0]
                          }}
                          exit={{ opacity: 0, scale: 1.02 }}
                          transition={{ 
                            opacity: { duration: 0.7 },
                            scale: { duration: 0.7 },
                            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                            rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                          }}
                          className="absolute inset-0 w-full h-full"
                        >
                          {!photoError1 ? (
                            <img
                              src={couple1Img}
                              alt="Rajesh & Anchal Welcoming"
                              onError={() => setPhotoError1(true)}
                              className="w-full h-full object-cover rounded-t-full"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <CoupleIllustrationFallback type="normal" />
                          )}
                        </motion.div>
                      ) : (
                        /* PHOTO 2: With Garlands & Stoles (Auspicious Welcome) */
                        <motion.div
                          key="photo2"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            y: [0, -4, 0],
                            rotate: [0, 0.5, -0.5, 0]
                          }}
                          exit={{ opacity: 0, scale: 1.02 }}
                          transition={{ 
                            opacity: { duration: 0.7 },
                            scale: { duration: 0.7 },
                            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                            rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                          }}
                          className="absolute inset-0 w-full h-full"
                        >
                          {!photoError2 ? (
                            <img
                              src={couple2Img}
                              alt="Rajesh & Anchal Garland Greeting"
                              onError={() => setPhotoError2(true)}
                              className="w-full h-full object-cover rounded-t-full"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <CoupleIllustrationFallback type="garland" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Welcoming Text Badge Overlay at the bottom of the photo */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-3 px-2 text-center z-10 flex flex-col items-center">
                      <motion.div
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-bright-gold via-marigold-yellow to-royal-gold rounded-full text-[10px] text-wedding-maroon font-bold font-wedding-display border border-white shadow-lg"
                      >
                        <Heart className="w-3 h-3 fill-wedding-maroon text-wedding-maroon animate-pulse" />
                        <span>पधारो म्हारे देस - स्वागतम्</span>
                        <Heart className="w-3 h-3 fill-wedding-maroon text-wedding-maroon animate-pulse" />
                      </motion.div>
                    </div>

                  </div>

                  {/* Intricate golden border overlay */}
                  <div className="absolute inset-3.5 border-2 border-dashed border-bright-gold/60 rounded-t-full rounded-b-md pointer-events-none opacity-80" />
                </div>

                {/* COUPLE WELCOMING WORDS */}
                <div className="text-center space-y-1 max-w-sm mx-auto px-4 mt-2">
                  <h2 className="text-2xl sm:text-3xl font-wedding-display font-extrabold text-white tracking-wide">
                    {langChoice === 'en' ? 'Rajesh & Anchal' : 'राजेश संग आंचल'}
                  </h2>
                  <p className="text-bright-gold font-wedding-devanagari text-sm font-semibold tracking-wide">
                    "हमारी शादी के शुभ अवसर पर आपका हार्दिक अभिनंदन है!"
                  </p>
                  <p className="text-gray-300 font-wedding-serif text-[11px] leading-relaxed italic">
                    "We cordially invite you with pure warmth and happiness to be part of our memorable wedding ceremony."
                  </p>
                </div>

                {/* PROMINENT SUB_BUTTON TO MAIN INVITATION CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-2"
                >
                  <button
                    onClick={handleEnterInvitation}
                    className="relative px-7 py-3 sm:px-9 sm:py-4 rounded-full font-wedding-display text-xs sm:text-sm uppercase tracking-widest font-extrabold shadow-[0_10px_25px_rgba(255,223,0,0.3)] bg-gradient-to-r from-bright-gold via-marigold-yellow to-royal-gold hover:from-bright-gold hover:to-bright-gold text-wedding-maroon border-2 border-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-wedding-crimson animate-pulse" />
                    <span>शुभ प्रवेश करें (Enter Invitation)</span>
                    <ArrowRight className="w-4 h-4 text-wedding-crimson shrink-0" />
                  </button>
                </motion.div>
              </motion.div>
            )}

          </div>

          {/* ================= ROYAL BOTTOM FOOTER: Created by Kanaiya Soni ================= */}
          <div className="w-full text-center pb-2 pt-4 border-t border-royal-gold/10 z-20 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-royal-gold/60 font-medium tracking-widest uppercase">
              <span className="w-2.5 h-[1px] bg-royal-gold/30" />
              <span>Created by Kanaiya Soni</span>
              <span className="w-2.5 h-[1px] bg-royal-gold/30" />
            </div>
            <p className="text-[8px] text-gray-500 font-wedding-serif italic">
              Rajesh &amp; Anchal Wedding Celebration · 2027
            </p>
          </div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

// PREMIUM 2D TRADITIONAL INDIAN COUPLE VECTOR ILLUSTRATION FALLBACK
function CoupleIllustrationFallback({ type }: { type: 'normal' | 'garland' }) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#4d0c14] to-[#1f0206] flex flex-col items-center justify-center text-center p-4">
      {/* Radiant golden sunburst background */}
      <div className="absolute w-44 h-44 rounded-full bg-bright-gold/10 filter blur-xl animate-pulse" />

      <svg viewBox="0 0 200 240" className="w-[85%] h-auto max-h-[280px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
        {/* Halo background */}
        <circle cx="100" cy="100" r="45" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3,3" className="animate-spin-slow" />
        <circle cx="100" cy="100" r="42" fill="rgba(212, 175, 55, 0.05)" />

        {/* BRIDE (Right side of viewer, Left of groom) */}
        <g transform="translate(15, 10)">
          {/* Hair / Dupatta */}
          <path d="M110,65 C95,50 145,50 130,65 C125,80 140,110 130,130 L115,130" fill="#a01a24" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="120" cy="62" r="3.5" fill="#D4AF37" /> {/* Maang Tikka */}
          <circle cx="120" cy="58" r="1.2" fill="#FF5722" />

          {/* Saree/Lehenga Drape */}
          <path d="M100,105 C110,105 135,115 140,155 L105,155 Z" fill="#b91c1c" />
          {/* Golden borders */}
          <path d="M115,110 Q125,125 138,155" fill="none" stroke="#FFD700" strokeWidth="1.5" />
          <path d="M100,112 Q112,130 120,155" fill="none" stroke="#FFD700" strokeWidth="1" />

          {/* Head & Neck */}
          <circle cx="120" cy="74" r="11" fill="#fcd34d" className="opacity-95" />
          <path d="M117,85 L123,85 L121,92 L119,92 Z" fill="#fbcfe8" /> {/* Neck */}

          {/* Bindi and ornaments */}
          <circle cx="118" cy="71" r="1" fill="#b91c1c" />
          <path d="M115,86 Q120,89 125,86" fill="none" stroke="#FFD700" strokeWidth="1" /> {/* Necklace */}

          {/* Hands doing Namaste */}
          <path d="M103,115 Q108,102 113,115" fill="#fcd34d" stroke="#b91c1c" strokeWidth="0.5" />
        </g>

        {/* GROOM (Left side of viewer, Right of bride) */}
        <g transform="translate(-15, 10)">
          {/* Traditional Pagri/Turban */}
          <path d="M65,58 C55,54 95,54 85,58 L88,68 L62,68 Z" fill="#dc2626" stroke="#D4AF37" strokeWidth="0.75" />
          <path d="M75,54 L75,44 Q77,46 75,50" fill="none" stroke="#FFD700" strokeWidth="1.5" /> {/* Feather ornament */}
          <circle cx="75" cy="58" r="2" fill="#FFD700" />

          {/* Sherwani Body (Royal Ivory Cream) */}
          <path d="M50,105 C55,105 90,105 90,155 L55,155 Z" fill="#fdfbf7" />
          {/* Crimson Red Stole/Sash over shoulder */}
          <path d="M53,105 C55,120 62,140 56,155" fill="none" stroke="#b91c1c" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M53,105 C55,120 62,140 56,155" fill="none" stroke="#FFD700" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Sherwani collar & golden elements */}
          <path d="M71,105 L71,155" stroke="#FFD700" strokeWidth="1.5" />
          {/* Golden buttons */}
          <circle cx="71" cy="115" r="1.5" fill="#FFD700" />
          <circle cx="71" cy="125" r="1.5" fill="#FFD700" />
          <circle cx="71" cy="135" r="1.5" fill="#FFD700" />

          {/* Head & Neck */}
          <circle cx="75" cy="76" r="11.5" fill="#fcd34d" />
          <path d="M72,87 L78,87 L76,94 L74,94 Z" fill="#fcd34d" />

          {/* Traditional Tilak */}
          <line x1="75" y1="69" x2="75" y2="74" stroke="#dc2626" strokeWidth="1.5" />

          {/* Hands doing Namaste */}
          <path d="M87,115 Q92,102 97,115" fill="#fcd34d" stroke="#b91c1c" strokeWidth="0.5" />
        </g>

        {/* JOINT NAMASTE HANDS (CENTERED) */}
        <g transform="translate(100, 118)" className="animate-bounce" style={{ transformOrigin: 'center center' }}>
          {/* Groom's left hand & Bride's right hand together in prayer/namaste gesture */}
          <path d="M-6,0 Q0,-18 6,0 L4,12 L-4,12 Z" fill="#fcd34d" stroke="#AA7C11" strokeWidth="1" />
          <line x1="0" y1="-14" x2="0" y2="10" stroke="#AA7C11" strokeWidth="0.5" strokeDasharray="1,1" />
          {/* Henna detail on bride's hand side */}
          <circle cx="2" cy="1" r="1" fill="#dc2626" />
          <circle cx="2" cy="5" r="1" fill="#dc2626" />
        </g>

        {/* EXTRA AUSPICIOUS GARLANDS (SHOWN IN GARLAND TYPE) */}
        {type === 'garland' && (
          <g className="animate-pulse">
            {/* Groom Garland */}
            <path d="M50,96 Q75,145 100,96" fill="none" stroke="#FBBF24" strokeWidth="4.5" strokeLinecap="round" opacity="0.95" />
            <path d="M50,96 Q75,145 100,96" fill="none" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3, 4" />

            {/* Bride Garland */}
            <path d="M100,96 Q125,145 150,96" fill="none" stroke="#FBBF24" strokeWidth="4.5" strokeLinecap="round" opacity="0.95" />
            <path d="M100,96 Q125,145 150,96" fill="none" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3, 4" />
            
            {/* Hanging flowers */}
            <circle cx="75" cy="120" r="2.5" fill="#EA580C" />
            <circle cx="125" cy="120" r="2.5" fill="#EA580C" />
          </g>
        )}

        {/* Small rising hearts for welcoming vibe */}
        <g>
          <path d="M96,65 Q93,60 90,65 L90,66 L96,72 L102,66 L102,65 Q99,60 96,65 Z" fill="#dc2626" className="animate-ping" style={{ transformOrigin: '96px 65px' }} />
          <path d="M104,50 Q101,45 98,50 L98,51 L104,57 L110,51 L110,50 Q107,45 104,50 Z" fill="#f59e0b" className="animate-bounce" />
        </g>
      </svg>

      <p className="text-royal-gold font-wedding-devanagari text-[10px] tracking-widest mt-2 animate-pulse">
        {type === 'garland' ? 'वर-वधू स्वागत मुद्रा में' : 'मंगलाचरण की पावन बेला'}
      </p>
      
      <p className="text-gray-400 font-mono text-[9px] max-w-[200px] mt-1 leading-normal leading-snug">
        [To use your real photos, upload <span className="text-bright-gold">couple1.jpeg</span> and <span className="text-bright-gold">couple2.jpeg</span> in the <span className="text-white font-bold">assets/.aistudio/</span> folder]
      </p>
    </div>
  );
}
