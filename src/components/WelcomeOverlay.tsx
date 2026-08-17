import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Flame, Volume2, ArrowRight } from 'lucide-react';

const couple1Img = '/assets/img/couple1.jpg';
const couple2Img = '/assets/img/couple2.jpg';

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
  const [image1Loaded, setImage1Loaded] = useState(false);
  const [image2Loaded, setImage2Loaded] = useState(false);

  // Cycle the couple's welcoming photos to simulate welcoming movement
  useEffect(() => {
    if (phase === 'welcome-couple') {
      const interval = setInterval(() => {
        setActivePhoto(prev => (prev === 1 ? 2 : 1));
      }, 6000);
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
                ? 'from-[#FFFDF9] via-[#FAF3E5] to-[#F5E6CC]'
                : 'from-[#FAF7F2] via-[#F6F0E7] to-[#EEE5D6]'
              : 'from-[#FAF7F2] via-[#F5EFEB] to-[#ECE2D2]'
          } transition-all duration-[2000ms] ease-out text-wedding-maroon`}
        >
          {/* ROYAL ARCH BACKGROUND PATTERN & GOLDEN LIGHT GLOW */}
          <div className="absolute inset-0 royal-bg opacity-35 pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[550px] h-[320px] sm:h-[550px] rounded-full bg-radial-gradient from-royal-gold/15 via-transparent to-transparent pointer-events-none z-0 filter blur-2xl" />

          {/* INNER WRAPPER FOR FULL HEIGHT & SCROLLABLE CONTENT WITH EMBEDDED BORDERS */}
          <div className="relative min-h-screen w-full max-w-2xl mx-auto flex flex-col items-center justify-between text-center px-4 py-4 sm:py-8 z-10">
            {/* ROYAL GOLDEN FILIGREE BORDER FRAME */}
            <div className="absolute inset-2 sm:inset-4 border-2 border-royal-gold/45 pointer-events-none z-30 rounded-lg shadow-sm">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-royal-gold rounded-tl-sm" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-royal-gold rounded-tr-sm" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-royal-gold rounded-bl-sm" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-royal-gold rounded-br-sm" />
              <div className="absolute inset-1.5 border border-royal-gold/30 rounded-md" />
            </div>

            {/* HANGING MARIGOLD AND LEAF TORAN */}
            <div className="absolute top-2 sm:top-4 inset-x-2 sm:inset-x-4 flex justify-around pointer-events-none z-20 opacity-90">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[1px] h-6 md:h-16 bg-gradient-to-b from-transparent to-marigold-orange/60" />
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-marigold-yellow border border-marigold-orange shadow-sm flex items-center justify-center text-[5px] sm:text-[6px] text-white font-bold">❀</div>
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
                  className="w-11 h-11 sm:w-16 sm:h-16 text-deep-gold mb-0.5 filter drop-shadow-sm"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-deep-gold" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M40 20 L50 10 L60 20 Z" fill="rgba(212, 175, 55, 0.25)" />
                    <path d="M45 20 L50 14 L55 20" />
                    <path d="M50 20 C35 25 35 45 42 50 C45 52 48 48 50 45 C52 48 55 52 58 50 C65 45 65 25 50 20" />
                    <path d="M50 45 C50 65 35 65 35 75 C35 80 40 82 45 80" />
                    <path d="M40 25 C25 22 25 40 40 42" />
                    <path d="M60 25 C75 22 75 40 60 42" />
                    <path d="M43 45 L38 47" />
                    <circle cx="65" cy="72" r="3" fill="#D4AF37" />
                    <line x1="50" y1="23" x2="50" y2="32" stroke="#9E1B32" strokeWidth="3.5" />
                  </svg>
                </motion.div>

                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-wedding-crimson font-wedding-devanagari text-base sm:text-2xl tracking-widest block font-bold">
                    ॥ शुभ विवाह आमंत्रण ॥
                  </span>
                  <span className="text-deep-gold font-wedding-serif text-[10px] sm:text-xs tracking-[0.14em] uppercase block font-bold">
                    Rajesh &amp; Anchal Wedding Invitation
                  </span>
                </div>

                <h1 className="text-2xl sm:text-5xl font-wedding-display font-extrabold text-wedding-maroon tracking-wider drop-shadow-sm">
                  पधारो म्हारे देस
                </h1>
                
                <div className="max-w-md mx-auto px-4 leading-relaxed space-y-1">
                  <p className="text-stone-700 font-wedding-serif text-[11px] sm:text-xs italic font-medium">
                    "We welcome you with open hearts. Please light the sacred Diya to begin our celebrations."
                  </p>
                  <p className="text-wedding-maroon font-wedding-devanagari text-[10.5px] sm:text-xs font-bold">
                    "आपका सहृदय स्वागत है। मंगल उत्सव प्रारंभ करने हेतु पवित्र दीप प्रज्वलित करें।"
                  </p>
                </div>

                {/* THE DIYA ASSET */}
                <div className="relative my-0.5 sm:my-2 flex flex-col items-center justify-center">
                  <div className={`absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-bright-gold/30 filter blur-xl transition-all duration-1000 ${isLit ? 'scale-150 opacity-100' : 'scale-75 opacity-40'}`} />

                  {/* Glowing flame when lit */}
                  <div className="h-8 sm:h-14 flex items-end justify-center relative">
                    <AnimatePresence>
                      {isLit && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [1, 1.15, 0.95, 1.1, 1],
                            opacity: 1,
                            y: [0, -2, 1, -1.5, 0]
                          }}
                          transition={{
                            scale: { duration: 0.6, ease: "easeOut" },
                            y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                          }}
                          className="absolute -top-1 z-20 flex flex-col items-center"
                        >
                          <div className="w-6 h-8 sm:w-7.5 sm:h-11 bg-gradient-to-t from-marigold-orange via-bright-gold to-white rounded-full rounded-b-xl shadow-[0_0_25px_#FFDF00] filter blur-[0.2px] border border-bright-gold/25" />
                          <div className="w-2 h-3.5 sm:w-3 sm:h-5 bg-white rounded-full absolute bottom-1 filter blur-[1px] opacity-90" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Clay Diya Vessel */}
                  <motion.div
                    animate={isLit ? { y: [0, -2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <svg viewBox="0 0 100 50" className="w-24 h-12 sm:w-36 sm:h-18 drop-shadow-[0_6px_14px_rgba(158,27,50,0.2)] relative z-10">
                      <ellipse cx="50" cy="18" rx="38" ry="8" fill="#AA7C11" />
                      <path
                        d="M10,18 C10,38 90,38 90,18 C90,12 80,10 50,10 C20,10 10,12 10,18 Z"
                        fill="url(#clayGradientWelcomeModern)"
                        stroke="#8B4513"
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
                        <linearGradient id="clayGradientWelcomeModern" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#D4AF37" />
                          <stop offset="35%" stopColor="#C54B22" />
                          <stop offset="70%" stopColor="#8B4513" />
                          <stop offset="100%" stopColor="#4A1C0A" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                </div>

                {/* LANGUAGE CHOSEN */}
                <div className="w-full max-w-[240px] sm:max-w-[280px] px-1 sm:px-2">
                  <p className="text-wedding-maroon font-wedding-devanagari text-[8.5px] sm:text-[9.5px] uppercase tracking-wider mb-1 font-bold">
                    ॥ निमंत्रण की भाषा चुनें / Choose Language ॥
                  </p>
                  <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                    {['en', 'hi', 'mix'].map((l) => (
                      <button
                        key={l}
                        onClick={() => !isLit && setLangChoice(l as any)}
                        type="button"
                        className={`py-0.5 sm:py-1 px-1 rounded-md border text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                          langChoice === l
                            ? 'bg-gradient-to-r from-bright-gold via-marigold-yellow to-royal-gold text-wedding-maroon border-bright-gold font-bold scale-102 shadow-[0_2px_8px_rgba(212,175,55,0.35)]'
                            : 'bg-white/90 text-stone-700 border-royal-gold/30 hover:bg-white hover:border-royal-gold/60 shadow-2xs font-medium'
                        }`}
                      >
                        <span className="text-[9px] sm:text-[10.5px] font-semibold leading-tight">
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
                  className={`relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-wedding-display text-[10px] sm:text-xs uppercase tracking-widest font-bold shadow-lg transition-all duration-300 border-2 flex items-center gap-1.5 ${
                    isLit
                      ? 'bg-stone-200 text-stone-400 border-stone-300 scale-95'
                      : 'bg-gradient-to-r from-bright-gold via-marigold-yellow to-royal-gold hover:from-bright-gold hover:to-bright-gold text-wedding-maroon border-white hover:scale-105 active:scale-95 cursor-pointer shadow-[0_4px_18px_rgba(212,175,55,0.3)]'
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
                <div className="absolute w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] rounded-full bg-radial-gradient from-bright-gold/25 via-transparent to-transparent opacity-90 animate-pulse-ring z-0" />

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
                      <div className="absolute w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-bright-gold/35 filter blur-xl animate-pulse" />

                      {/* Ornate Ganesha image */}
                      <div className="relative p-1.5 sm:p-2 bg-white border-3 sm:border-4 border-bright-gold rounded-full shadow-[0_0_35px_rgba(212,175,55,0.5)] overflow-hidden w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center">
                        <img 
                          src="https://thekraftyresin.com/cdn/shop/files/ganeshji.webp?v=1739780216" 
                          alt="Lord Ganesha Pop Up Blessing" 
                          className="w-[90%] h-auto object-contain rounded-full brightness-105 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
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
                        className="mt-2.5 sm:mt-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-royal-gold/40 shadow-lg"
                      >
                        <span className="text-wedding-crimson font-wedding-devanagari text-[10px] sm:text-xs tracking-widest block font-bold animate-pulse">
                          ॥ श्री गणेशाय नमः ॥
                        </span>
                        <span className="text-stone-800 font-wedding-devanagari text-[8.5px] sm:text-[9.5px] block mt-0.5 font-medium leading-tight">
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
                    className="absolute left-0 w-1/2 h-full bg-gradient-to-r from-[#6A0C1A] to-[#8B1C2D] border-2 border-royal-gold rounded-l-2xl shadow-2xl flex flex-col items-end justify-center pr-2"
                    style={{ 
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                      boxShadow: '-15px 15px 30px rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Golden ornaments on door */}
                    <div className="absolute inset-2 border border-royal-gold/35 rounded-lg flex items-center justify-end pr-2 pointer-events-none">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border border-royal-gold/50 rounded-full flex items-center justify-center bg-black/10">
                        <span className="text-bright-gold font-wedding-devanagari text-[10px] sm:text-xs font-bold">शुभ</span>
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
                    className="absolute right-0 w-1/2 h-full bg-gradient-to-l from-[#6A0C1A] to-[#8B1C2D] border-2 border-royal-gold rounded-r-2xl shadow-2xl flex flex-col items-start justify-center pl-2"
                    style={{ 
                      transformOrigin: 'right center',
                      transformStyle: 'preserve-3d',
                      boxShadow: '15px 15px 30px rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Golden ornaments on door */}
                    <div className="absolute inset-2 border border-royal-gold/35 rounded-lg flex items-center justify-start pl-2 pointer-events-none">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border border-royal-gold/50 rounded-full flex items-center justify-center bg-black/10">
                        <span className="text-bright-gold font-wedding-devanagari text-[10px] sm:text-xs font-bold">लाभ</span>
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
                  <div className="absolute inset-0 border-4 border-royal-gold/60 pointer-events-none rounded-2xl z-30 shadow-md">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-7 bg-bright-gold border-2 border-wedding-maroon rounded-t-full shadow-lg flex items-center justify-center">
                      <span className="text-[8px] text-wedding-maroon font-bold font-wedding-devanagari">ॐ</span>
                    </div>
                  </div>

                </div>

                <div className="mt-4 text-center z-30">
                  <p className="text-wedding-maroon font-wedding-devanagari text-xs sm:text-sm tracking-wider font-bold animate-pulse">
                    द्वार खुल रहे हैं... स्वागत की पावन बेला
                  </p>
                  <p className="text-stone-600 font-wedding-serif text-[10.5px] mt-0.5 font-medium italic">
                    "The grand palace gates are opening for you..."
                  </p>
                </div>
              </motion.div>
            )}

            {/* ================= PHASE 3: WELCOME COUPLE ANIMATION ================= */}
            {phase === 'welcome-couple' && (
              <motion.div
                key="welcome-couple-phase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center gap-4 relative"
              >
                {/* Tiny Blessed Ganesha at top center as protector */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center mb-0.5 bg-white/95 px-4 py-1.5 rounded-full border border-royal-gold/50 shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://thekraftyresin.com/cdn/shop/files/ganeshji.webp?v=1739780216" 
                      alt="Mini Ganesha" 
                      className="w-6 h-6 object-contain rounded-full border border-royal-gold bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-wedding-maroon font-wedding-devanagari text-[10px] sm:text-[11px] tracking-widest font-bold">
                      ॥ वक्रतुण्डाय हुम् ॥ मंगल मूर्ति सदा सहाय करें
                    </span>
                  </div>
                </motion.div>

                {/* COUPLE PHOTO CONTAINER - GENTLE GREETING/BOWING ANIMATION */}
                <div className="relative w-[230px] sm:w-[320px] h-[310px] sm:h-[420px] rounded-t-full rounded-b-2xl border-4 border-royal-gold bg-white shadow-[0_15px_35px_rgba(158,27,50,0.15)] p-2 overflow-hidden flex flex-col items-center justify-center">
                  
                  {/* Soft Divine Background Glow */}
                  <div className="absolute inset-0 bg-radial-gradient from-bright-gold/20 via-transparent to-transparent opacity-80 animate-pulse" />

                  {/* Floral Garlands/Toran on Frame */}
                  <div className="absolute top-1 inset-x-2 flex justify-between px-4 z-20 opacity-80 pointer-events-none">
                    <div className="text-[11px] text-marigold-yellow animate-bounce">✿</div>
                    <div className="text-[11px] text-marigold-yellow animate-ping">✿</div>
                    <div className="text-[11px] text-marigold-yellow animate-bounce">✿</div>
                  </div>

                  {/* SWITCHING COUPLE IMAGES */}
                  <div className="relative w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-[#FAF6F0]">
                    
                    {/* PHOTO 1: Without Garlands (Normal) */}
                    <AnimatePresence>
                      {activePhoto === 1 ? (
                        <motion.div
                          key="photo1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 w-full h-full"
                        >
                          {!image1Loaded && !photoError1 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF6F0] z-30">
                              <div className="w-8 h-8 border-4 border-t-royal-gold border-royal-gold/20 rounded-full animate-spin mb-2" />
                              <span className="text-[10px] text-wedding-maroon font-wedding-devanagari tracking-wider font-bold">शुभ पावन क्षण लोड हो रहे हैं...</span>
                            </div>
                          )}
                          {!photoError1 ? (
                            <img
                              src={couple1Img}
                              alt="Rajesh & Anchal Welcoming"
                              onLoad={() => setImage1Loaded(true)}
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
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 w-full h-full"
                        >
                          {!image2Loaded && !photoError2 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF6F0] z-30">
                              <div className="w-8 h-8 border-4 border-t-royal-gold border-royal-gold/20 rounded-full animate-spin mb-2" />
                              <span className="text-[10px] text-wedding-maroon font-wedding-devanagari tracking-wider font-bold">शुभ पावन क्षण लोड हो रहे हैं...</span>
                            </div>
                          )}
                          {!photoError2 ? (
                            <img
                              src={couple2Img}
                              alt="Rajesh & Anchal Garland Greeting"
                              onLoad={() => setImage2Loaded(true)}
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
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-12 pb-3 px-2 text-center z-10 flex flex-col items-center">
                      <motion.div
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-bright-gold via-marigold-yellow to-royal-gold rounded-full text-[10.5px] text-wedding-maroon font-bold font-wedding-display border border-white shadow-lg"
                      >
                        <Heart className="w-3.5 h-3.5 fill-wedding-maroon text-wedding-maroon animate-pulse" />
                        <span>पधारो म्हारे देस - स्वागतम्</span>
                        <Heart className="w-3.5 h-3.5 fill-wedding-maroon text-wedding-maroon animate-pulse" />
                      </motion.div>
                    </div>

                  </div>

                  {/* Intricate golden border overlay */}
                  <div className="absolute inset-3.5 border-2 border-dashed border-royal-gold/60 rounded-t-full rounded-b-md pointer-events-none opacity-80" />
                </div>

                {/* COUPLE WELCOMING WORDS */}
                <div className="text-center space-y-1 max-w-md mx-auto px-4 mt-1">
                  <h2 className="text-2xl sm:text-4xl font-wedding-display font-extrabold text-wedding-maroon tracking-wide drop-shadow-sm">
                    {langChoice === 'en' ? 'Rajesh & Anchal' : 'राजेश संग आंचल'}
                  </h2>
                  <p className="text-wedding-crimson font-wedding-devanagari text-sm sm:text-base font-bold tracking-wide">
                    "हमारी शादी के शुभ अवसर पर आपका हार्दिक अभिनंदन है!"
                  </p>
                  <p className="text-stone-700 font-wedding-serif text-[11.5px] sm:text-xs leading-relaxed italic font-medium">
                    "We cordially invite you with pure warmth and happiness to be part of our memorable wedding ceremony."
                  </p>
                </div>

                {/* PROMINENT SUB_BUTTON TO MAIN INVITATION CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-1"
                >
                  <button
                    onClick={handleEnterInvitation}
                    className="relative px-5 py-2.5 sm:px-8 sm:py-3 rounded-full font-wedding-display text-[11px] sm:text-xs uppercase tracking-widest font-extrabold shadow-[0_6px_20px_rgba(212,175,55,0.3)] bg-gradient-to-r from-bright-gold via-marigold-yellow to-royal-gold hover:from-bright-gold hover:to-bright-gold text-wedding-maroon border-2 border-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-wedding-crimson animate-pulse" />
                    <span>शुभ प्रवेश करें (ENTER INVITATION)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-wedding-crimson shrink-0" />
                  </button>
                </motion.div>
              </motion.div>
            )}

          </div>

          {/* ================= ROYAL BOTTOM FOOTER: Created by Kanaiya Soni ================= */}
          <div className="w-full text-center pb-2 pt-4 border-t border-royal-gold/20 z-20 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-stone-500 font-medium tracking-widest uppercase">
              <span className="w-3 h-[1px] bg-royal-gold/40" />
              <span>Created by Kanaiya Soni</span>
              <span className="w-3 h-[1px] bg-royal-gold/40" />
            </div>
            <p className="text-[8.5px] text-stone-400 font-wedding-serif italic">
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
    <div className="w-full h-full bg-gradient-to-b from-[#FAF7F2] to-[#F2EADB] flex flex-col items-center justify-center text-center p-6 relative">
      {/* Radiant golden sunburst background */}
      <div className="absolute w-48 h-48 rounded-full bg-bright-gold/15 filter blur-2xl animate-pulse" />

      {/* Traditional Mandap Arch Frame Decoration */}
      <div className="absolute inset-4 border border-royal-gold/40 rounded-t-full pointer-events-none" />
      <div className="absolute inset-5 border border-dashed border-royal-gold/25 rounded-t-full pointer-events-none" />

      {/* Traditional Indian Wedding Motif (Ganesha / Kalash) */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* Sacred Kalash/Diya Mandala */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-b from-royal-gold to-bright-gold p-0.5 shadow-xl flex items-center justify-center animate-pulse">
          <div className="w-full h-full rounded-full bg-temple-cream flex flex-col items-center justify-center p-2 border border-royal-gold/40">
            {/* Elegant SVG Kalash/Diya */}
            <svg className="w-10 h-10 text-deep-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {/* Sacred fire flame */}
              <path d="M12 2C12 2 9 6 9 8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8C15 6 12 2 12 2Z" fill="currentColor" />
              {/* Sacred pot/kalash base */}
              <path d="M6 14C6 11.5 8 11 12 11C16 11 18 11.5 18 14C18 17 16 21 12 21C8 21 6 17 6 14Z" stroke="currentColor" fill="rgba(212,175,55,0.1)" />
              {/* Coconut leaves */}
              <path d="M8 11C8 11 9.5 9 12 10C14.5 9 16 11 16 11" stroke="currentColor" />
            </svg>
          </div>
        </div>

        {/* Shubh Vivah text in beautiful Hindi font */}
        <div className="mt-2">
          <h3 className="text-wedding-maroon font-wedding-display text-lg tracking-wider font-bold">शुभ विवाह</h3>
          <p className="text-wedding-crimson font-wedding-devanagari text-[11.5px] tracking-wide mt-1 font-semibold">राजेश संग आंचल</p>
        </div>

        <p className="text-wedding-maroon font-wedding-devanagari text-[10px] tracking-widest mt-2 px-4 py-1 bg-royal-gold/15 rounded-full border border-royal-gold/30 font-semibold">
          {type === "garland" ? "वर-वधू स्वागत मुद्रा में" : "मंगलाचरण की पावन बेला"}
        </p>

        <p className="text-stone-500 font-mono text-[8px] max-w-[200px] mt-4 leading-normal leading-snug">
          [To use your real photos, upload <span className="text-wedding-maroon font-bold">couple1.jpeg</span> and <span className="text-wedding-maroon font-bold">couple2.jpeg</span> in the <span className="text-wedding-crimson font-bold">assets/img/</span> folder]
        </p>
      </div>
    </div>
  );
}
