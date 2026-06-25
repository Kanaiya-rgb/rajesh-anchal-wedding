import React from 'react';
import { motion } from 'motion/react';

export default function GaneshaHeader({ lang = 'hi' }: { lang: 'en' | 'hi' | 'mix' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 select-none relative overflow-hidden">
      {/* Decorative background mandala rotating slowly */}
      <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] opacity-5 pointer-events-none animate-slow-spin">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-wedding-maroon">
          <circle cx="50" cy="50" r="45" stroke="#AA7C11" strokeWidth="0.5" fill="none" strokeDasharray="2, 2" />
          <path d="M 50 5 A 45 45 0 0 1 95 50 L 50 50 Z" />
          <path d="M 95 50 A 45 45 0 0 1 50 95 L 50 50 Z" />
          <path d="M 50 95 A 45 45 0 0 1 5 50 L 50 50 Z" />
          <path d="M 5 50 A 45 45 0 0 1 50 5 L 50 50 Z" />
        </svg>
      </div>

      {/* Ganesh ji Portrait with golden arch frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative p-3 rounded-t-full rounded-b-lg border-4 border-royal-gold bg-wedding-maroon shadow-2xl overflow-hidden max-w-[200px] md:max-w-[240px]">
          {/* Glowing background aura */}
          <div className="absolute inset-0 bg-radial-gradient from-bright-gold/30 via-transparent to-transparent opacity-80 animate-pulse-ring" />
          
          <img 
            src="https://thekraftyresin.com/cdn/shop/files/ganeshji.webp?v=1739780216" 
            alt="Lord Ganesha Blessing" 
            className="w-full h-auto object-contain rounded-t-full relative z-10 filter brightness-110 drop-shadow-[0_0_15px_rgba(255,223,0,0.4)]"
            referrerPolicy="no-referrer"
          />
          
          {/* Intricate decorative outline */}
          <div className="absolute inset-1.5 border border-dashed border-bright-gold rounded-t-full rounded-b-md pointer-events-none opacity-60" />
        </div>

        {/* Auspicious Chants / Mantras */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-6 max-w-lg relative z-10"
        >
          <span className="text-royal-gold font-wedding-devanagari text-lg md:text-xl tracking-widest block mb-2">
            ॥ श्री गणेशाय नमः ॥
          </span>
          <p className="text-wedding-crimson font-wedding-serif text-sm md:text-base italic font-semibold leading-relaxed px-4">
            "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
            निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥"
          </p>
          <p className="text-gray-500 font-wedding-serif text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
            {lang === 'mix' ? (
              <span className="block space-y-1.5">
                <span className="block font-wedding-devanagari text-wedding-maroon text-[13px] font-semibold leading-relaxed">
                  (हे घुमावदार सूंड वाले, विशाल शरीर और करोड़ों सूर्यों के समान तेजस्वी देव, मेरे सभी कार्यों को सदैव बाधा रहित पूरा करने की कृपा करें।)
                </span>
                <span className="block text-[10px] text-gray-400 font-medium italic leading-normal">
                  "O Lord Ganesha, with a curved trunk and massive body, having the brilliance of millions of suns, please make all my endeavors free of obstacles, always."
                </span>
              </span>
            ) : lang === 'en' ? (
              "(O Lord Ganesha with a curved trunk and massive body, having the brilliance of millions of suns, please make all my endeavors free of obstacles, always.)"
            ) : (
              "(हे घुमावदार सूंड वाले, विशाल शरीर और करोड़ों सूर्यों के समान तेजस्वी देव, मेरे सभी कार्यों को सदैव बाधा रहित पूरा करने की कृपा करें।)"
            )}
          </p>
        </motion.div>
      </motion.div>

      {/* Elegant hanging golden bells (Ghungroo / Jhumka style decorations) */}
      <div className="hidden md:flex justify-between absolute w-full max-w-5xl px-12 top-10 pointer-events-none">
        <motion.div 
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="flex flex-col items-center opacity-75"
        >
          <div className="w-0.5 h-16 bg-gradient-to-b from-transparent to-royal-gold" />
          <div className="w-4 h-4 rounded-full bg-royal-gold" />
          <div className="w-6 h-6 border-2 border-royal-gold rounded-b-full flex items-center justify-center bg-wedding-crimson text-[8px] text-bright-gold font-bold">ॐ</div>
        </motion.div>
        
        <motion.div 
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="flex flex-col items-center opacity-75"
        >
          <div className="w-0.5 h-20 bg-gradient-to-b from-transparent to-royal-gold" />
          <div className="w-4 h-4 rounded-full bg-royal-gold" />
          <div className="w-6 h-6 border-2 border-royal-gold rounded-b-full flex items-center justify-center bg-wedding-crimson text-[8px] text-bright-gold font-bold">卐</div>
        </motion.div>
      </div>
    </div>
  );
}
