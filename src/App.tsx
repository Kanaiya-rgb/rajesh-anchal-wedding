import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PetalAnimation from './components/PetalAnimation';
import GaneshaHeader from './components/GaneshaHeader';
import Countdown from './components/Countdown';
import WeddingCard from './components/WeddingCard';
import EventTimeline from './components/EventTimeline';
import RsvpForm from './components/RsvpForm';
import Guestbook from './components/Guestbook';
import MusicPlayer from './components/MusicPlayer';
import WelcomeOverlay from './components/WelcomeOverlay';
import DigitalInvitationCard from './components/DigitalInvitationCard';
import { Sparkles, Heart, Flower, Languages } from 'lucide-react';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi' | 'mix'>('mix');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const triggerShubhBurst = () => {
    // Fire the custom physical confetti event
    window.dispatchEvent(new CustomEvent('shubh-burst'));
  };

  const toggleLanguage = () => {
    setLang(prev => {
      if (prev === 'mix') return 'en';
      if (prev === 'en') return 'hi';
      return 'mix';
    });
  };

  return (
    <>
      {/* 0. Traditional welcome Diya overlay screen */}
      <WelcomeOverlay onEnter={(selectedLang) => {
        setLang(selectedLang);
        setHasEntered(true);
      }} />

      <div className={`relative min-h-screen bg-temple-cream text-wedding-maroon font-wedding-serif selection:bg-wedding-crimson selection:text-white pb-20 overflow-x-hidden transition-all duration-1000 ${!hasEntered ? 'h-screen overflow-hidden opacity-30 blur-[2px]' : 'opacity-100 blur-0'}`}>
        
        {/* 1. Live falling marigold petals animation */}
        <PetalAnimation />

        {/* Traditional Auspicious Floral Toran (Hanging marigold garland) at the very top */}
        <div className="w-full h-4 bg-gradient-to-r from-saffron via-marigold-yellow to-saffron relative z-30" />
        <div className="flex justify-around absolute w-full top-4 z-20 pointer-events-none text-marigold-orange">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Thread */}
              <div className="w-0.5 h-6 bg-marigold-orange/30" />
              {/* Mango leaf combined with marigold */}
              <motion.div
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 3 + i % 2, ease: "easeInOut" }}
                className="flex flex-col items-center -mt-1"
              >
                <div className="w-4 h-4 rounded-full bg-marigold-yellow border border-marigold-orange flex items-center justify-center text-[6px] text-white">❀</div>
                <div className="w-2.5 h-7 bg-henna-green rounded-b-full shadow-sm mt-0.5" />
              </motion.div>
            </div>
          ))}
        </div>

        {/* FLOATING CONTROLS BAR (Language Toggle + Digital Card + Music Player stacked) */}
        <div className="fixed top-6 right-4 z-50 flex flex-col gap-3 items-end">
          {/* Stunning Royal Language Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-wedding-maroon to-wedding-crimson hover:from-wedding-crimson hover:to-wedding-maroon text-bright-gold border-2 border-royal-gold rounded-full shadow-xl cursor-pointer text-xs font-bold tracking-wider relative group overflow-hidden"
          >
            {/* Soft pulse ring */}
            <span className="absolute inset-0 bg-bright-gold/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
            <Languages className="w-4 h-4 text-bright-gold animate-pulse shrink-0" />
            <span className="font-wedding-devanagari text-[10px] md:text-xs">
              {lang === 'mix' ? 'दोनों Mix' : lang === 'en' ? 'English' : 'हिन्दी'}
            </span>
          </motion.button>

          {/* Golden Digital Card Floating Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCardModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-saffron to-marigold-orange text-white border-2 border-royal-gold rounded-full shadow-xl cursor-pointer text-xs font-bold tracking-wider relative group overflow-hidden"
            id="floating-card-btn"
          >
            <span className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
            <Sparkles className="w-4 h-4 text-bright-gold animate-pulse shrink-0" />
            <span className="font-wedding-devanagari text-[10px] md:text-xs">
              {lang === 'mix' ? 'आमंत्रण पत्र / Card' : lang === 'en' ? 'Digital Card' : 'निमंत्रण पत्र'}
            </span>
          </motion.button>

          {/* Music Player triggers underneath */}
          <MusicPlayer />
        </div>

        {/* Main Container */}
        <div className="container mx-auto max-w-5xl px-4 relative z-20 pt-16">
          
          {/* HEADER SECTION */}
          <header className="text-center mb-10 select-none px-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex items-center justify-center gap-2 text-saffron font-wedding-devanagari text-xs md:text-base tracking-widest font-bold"
            >
              <Flower className="w-3.5 h-3.5 animate-spin text-marigold-orange shrink-0" />
              <span>
                {lang === 'mix' 
                  ? '॥ मांगलिक विवाह आमंत्रण / Auspicious Invitation ॥' 
                  : lang === 'en' 
                    ? '॥ Auspicious Wedding Invitation ॥' 
                    : '॥ मांगलिक शुभ विवाह आमंत्रण ॥'
                }
              </span>
              <Flower className="w-3.5 h-3.5 animate-spin text-marigold-orange shrink-0" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-4xl md:text-6xl font-wedding-display font-extrabold text-wedding-crimson mt-4 tracking-wide drop-shadow-[0_2px_4px_rgba(158,27,50,0.15)] leading-tight"
            >
              {lang === 'mix' ? 'राजेश एवं आंचल' : lang === 'en' ? 'Rajesh & Anchal' : 'राजेश एवं आंचल'}
              {lang === 'mix' && (
                <span className="block text-2xl md:text-3xl text-wedding-crimson font-wedding-serif font-bold mt-1">(Rajesh &amp; Anchal)</span>
              )}
            </motion.h1>

            <div className="text-royal-gold font-wedding-script text-2xl md:text-3xl mt-3 font-semibold leading-relaxed max-w-2xl mx-auto px-1">
              {lang === 'mix' ? (
                <span className="block space-y-1">
                  <span className="block font-wedding-devanagari text-xl md:text-2xl text-royal-gold">पावन परिणय सूत्र के पवित्र बंधन में बंधने जा रहे हैं</span>
                  <span className="block font-wedding-serif text-sm md:text-base text-gray-500 font-medium tracking-wide italic">are tying the holy knot of together-forever</span>
                </span>
              ) : lang === 'en' ? (
                'Are tying the holy knot of together-forever'
              ) : (
                'पावन परिणय सूत्र के पवित्र बंधन में बंधने जा रहे हैं'
              )}
            </div>

            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-royal-gold to-transparent mx-auto mt-4" />
          </header>

          {/* 2. LORD GANESHA AUSPICIOUS SECTION */}
          <section className="mb-12 bg-white/40 backdrop-blur-sm rounded-3xl border border-royal-gold/15 shadow-sm overflow-hidden">
            <GaneshaHeader lang={lang} />
          </section>

          {/* DIGITAL INVITATION CARD GENERATOR BANNER */}
          <section className="mb-12 text-center px-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#7A1221] to-[#4A0710] border-2 border-royal-gold rounded-3xl p-6 shadow-xl max-w-xl mx-auto relative overflow-hidden group hover:border-bright-gold transition-all duration-300 select-none"
            >
              {/* Inner hairlines */}
              <div className="absolute inset-1.5 border border-royal-gold/20 rounded-[22px] pointer-events-none" />
              <div className="absolute inset-2 border border-royal-gold/10 rounded-[18px] pointer-events-none" />
              
              <div className="absolute -left-6 -top-6 opacity-10 pointer-events-none text-bright-gold w-24 h-24">
                <Flower className="w-full h-full animate-slow-spin" />
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-bright-gold w-24 h-24">
                <Flower className="w-full h-full animate-slow-spin" />
              </div>

              <span className="text-bright-gold font-wedding-devanagari text-xs uppercase tracking-wider block mb-1.5 font-bold">
                ॥ डिजिटल आमंत्रण पत्र / DIGITAL INVITATION CARD ॥
              </span>
              <h3 className="text-white font-wedding-display text-lg md:text-xl font-extrabold mb-2.5">
                {lang === 'mix' 
                  ? 'अपना कस्टमाइज्ड विवाह निमंत्रण पत्र डाउनलोड करें' 
                  : lang === 'en' 
                    ? 'Download Your Customized Invitation Card' 
                    : 'अपना कस्टमाइज्ड विवाह निमंत्रण पत्र डाउनलोड करें'
                }
                {lang === 'mix' && (
                  <span className="block text-xs font-wedding-serif text-white/70 font-medium mt-0.5">(Get Your Elegant Digital Invite)</span>
                )}
              </h3>
              <div className="text-white/80 font-wedding-serif text-xs md:text-sm mb-5 leading-relaxed max-w-md mx-auto px-1">
                {lang === 'mix' ? (
                  <p className="font-wedding-devanagari font-semibold text-[#FDF9F3] text-[13px]">वर-वधू के शुभ विवाह का एक अति सुंदर एवं पारंपरिक निमंत्रण पत्र विभिन्न कलर थीम्स और भाषाओं में जनरेट करें और सीधे अपने फोन में डाउनलोड करें।</p>
                ) : lang === 'en' ? (
                  <p>Generate and download a stunning, traditional digital wedding invitation card for Rajesh &amp; Anchal with customizable royal themes and languages.</p>
                ) : (
                  <p>वर-वधू के शुभ विवाह का एक अति सुंदर एवं पारंपरिक निमंत्रण पत्र विभिन्न कलर थीम्स और भाषाओं में जनरेट करें और सीधे अपने फोन में डाउनलोड करें।</p>
                )}
              </div>

              <button
                onClick={() => setIsCardModalOpen(true)}
                className="relative px-6 py-3 bg-gradient-to-r from-saffron to-marigold-orange hover:from-marigold-orange hover:to-saffron text-white font-bold font-wedding-display text-xs md:text-sm uppercase tracking-widest rounded-full border-2 border-royal-gold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden group flex items-center justify-center gap-2.5 mx-auto"
                id="open-card-generator-btn"
              >
                <Sparkles className="w-4 h-4 text-bright-gold animate-pulse" />
                <span>
                  {lang === 'mix' 
                    ? 'आमंत्रण पत्र जनरेट करें' 
                    : lang === 'en' 
                      ? 'Get Digital Invitation Card' 
                      : 'आमंत्रण पत्र जनरेट करें'
                  }
                </span>
                <Sparkles className="w-4 h-4 text-bright-gold animate-pulse" />
              </button>
            </motion.div>
          </section>

          {/* INTERACTIVE SHUBH SHOWER BLOCKS PANEL */}
          <section className="mb-12 text-center px-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-royal-gold/40 rounded-3xl p-5 md:p-6 shadow-xl max-w-xl mx-auto relative overflow-hidden group hover:border-royal-gold transition-all duration-300"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-saffron via-bright-gold to-saffron" />
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-wedding-crimson w-24 h-24">
                <Flower className="w-full h-full animate-slow-spin" />
              </div>

              <span className="text-saffron font-wedding-devanagari text-xs uppercase tracking-wider block mb-1 font-bold">
                {lang === 'mix' 
                  ? '॥ शुभ पुष्प वर्षा (Shubh Pushpa Varsha) ॥' 
                  : lang === 'en' 
                    ? 'SHUBH PUSHPA VARSHA' 
                    : '॥ शुभ पुष्प वर्षा ॥'
                }
              </span>
              <h3 className="text-wedding-maroon font-wedding-display text-lg md:text-xl font-extrabold mb-2">
                {lang === 'mix' 
                  ? 'राजेश एवं आंचल को मंगल आशीर्वाद दें' 
                  : lang === 'en' 
                    ? 'Bless Rajesh & Anchal' 
                    : 'राजेश एवं आंचल को मंगल आशीर्वाद दें'
                }
                {lang === 'mix' && (
                  <span className="block text-xs font-wedding-serif text-gray-500 font-bold mt-0.5">(Bless Rajesh &amp; Anchal)</span>
                )}
              </h3>
              <div className="text-gray-500 font-wedding-serif text-xs md:text-sm mb-5 leading-relaxed max-w-md mx-auto px-1 space-y-1">
                {lang === 'mix' ? (
                  <>
                    <p className="font-wedding-devanagari font-semibold text-wedding-maroon text-[13px]">हमारे प्रिय अतिथियों का हार्दिक स्वागत है! वर-वधू पर ताजे गुलाब की पंखुड़ियों और दिव्य स्वर्ण कणों की पवित्र पुष्पवर्षा करने के लिए नीचे दिए गए बटन पर क्लिक करें।</p>
                    <p className="text-[11px] text-gray-400 italic font-medium">"Welcome our beloved guests! Click the button below to shower the couple with an auspicious blessing of fresh rose petals and celestial golden glitter."</p>
                  </>
                ) : lang === 'en' ? (
                  <p>'Welcome our beloved guests! Click the button below to shower the couple with an auspicious blessing of fresh rose petals and celestial golden glitter.'</p>
                ) : (
                  <p>'हमारे प्रिय अतिथियों का हार्दिक स्वागत है! वर-वधू पर ताजे गुलाब की पंखुड़ियों और दिव्य स्वर्ण कणों की पवित्र पुष्पवर्षा करने के लिए नीचे दिए गए बटन पर क्लिक करें।'</p>
                )}
              </div>

              <button
                onClick={triggerShubhBurst}
                className="relative px-6 py-3.5 bg-gradient-to-r from-wedding-crimson to-wedding-maroon hover:from-wedding-maroon hover:to-wedding-maroon text-bright-gold font-bold font-wedding-display text-xs md:text-sm uppercase tracking-widest rounded-full border-2 border-royal-gold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden group flex items-center justify-center gap-2.5 mx-auto"
              >
                <Sparkles className="w-4 h-4 text-bright-gold animate-pulse" />
                <span>
                  {lang === 'mix' 
                    ? 'पवित्र पुष्पवर्षा करें (Shower Blessings)' 
                    : lang === 'en' 
                      ? 'Shower Shubh Blessings' 
                      : 'पवित्र पुष्पवर्षा करें'
                  }
                </span>
                <Sparkles className="w-4 h-4 text-bright-gold animate-pulse" />
              </button>
            </motion.div>
          </section>

          {/* 3. WEDDING INVITATION CARD DETAIL SECTION */}
          <section className="mb-12">
            <WeddingCard lang={lang} />
          </section>

          {/* 4. AUSPICIOUS COUNTDOWN SECTION */}
          <section className="mb-12 bg-gradient-to-br from-white/90 to-temple-cream/90 border-2 border-royal-gold/20 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-royal-gold" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-royal-gold" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-royal-gold" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-royal-gold" />
            {/* The wedding date is February 22, 2027 */}
            <Countdown targetDateStr="2027-02-22T11:00:00+05:30" lang={lang} />
          </section>

          {/* 5. MULTI-DAY CEREMONY TIMELINE */}
          <section className="mb-12 bg-white/45 backdrop-blur-sm rounded-3xl border border-royal-gold/15 p-4 md:p-6 shadow-md">
            <EventTimeline lang={lang} />
          </section>

          {/* 6. PERSISTENT GUEST RSVP FORM */}
          <section id="rsvp-section" className="mb-12">
            <RsvpForm lang={lang} />
          </section>

          {/* 7. DURABLE BLESSINGS GUESTBOOK WALL */}
          <section className="mb-12 bg-white/40 backdrop-blur-sm rounded-3xl border border-royal-gold/15 p-4 md:p-6 shadow-md">
            <Guestbook lang={lang} />
          </section>

          {/* FOOTER */}
          <footer className="text-center pt-8 border-t border-royal-gold/20 select-none pb-12 px-2">
            <span className="font-wedding-devanagari text-saffron text-sm md:text-base font-bold tracking-wider block mb-3">
              {lang === 'mix' ? (
                <span className="block leading-relaxed">
                  ॥ वर-वधू को सुखद वैवाहिक जीवन का आशीर्वाद प्रदान करें ॥
                  <span className="block font-wedding-serif text-[11px] text-gray-400 font-medium tracking-wide mt-1 uppercase italic">Bestow your warm blessings on the bride &amp; groom</span>
                </span>
              ) : lang === 'en' ? (
                '॥ Bestow your warm blessings on the bride and groom ॥'
              ) : (
                '॥ वर-वधू को सुखद वैवाहिक जीवन का आशीर्वाद प्रदान करें ॥'
              )}
            </span>
            <p className="font-wedding-script text-3xl text-wedding-crimson mt-2 font-bold">
              #RajeshWedsAnchal
            </p>
            <p className="text-xs text-gray-400 mt-3 font-wedding-serif leading-relaxed px-4 max-w-md mx-auto">
              {lang === 'mix' ? (
                <span className="block leading-relaxed">
                  श्रद्धा, प्रेम और सनातन परंपरा के साथ हमारे मांगलिक उत्सव हेतु सुसज्जित
                  <span className="block text-[10px] text-gray-400 mt-0.5 font-medium italic">Designed with devotion, love, and tradition for our celebrations · 2027</span>
                </span>
              ) : lang === 'en' ? (
                'Designed with devotion, love, and tradition for our grand celebrations · 2027'
              ) : (
                'श्रद्धा, प्रेम और सनातन परंपरा के साथ हमारे मांगलिक उत्सव हेतु सुसज्जित · 2027'
              )}
            </p>
            <div className="w-16 h-0.5 bg-royal-gold/30 mx-auto mt-4" />
            
            {/* Royal Credit Line */}
            <div className="mt-4 flex flex-col items-center justify-center gap-1">
              <p className="text-[10px] tracking-widest text-royal-gold/60 uppercase font-bold font-mono">
                Created by Kanaiya Soni
              </p>
              <p className="text-[8px] text-gray-400 italic font-wedding-serif">
                Crafted with love for Rajesh &amp; Anchal's Special Day
              </p>
            </div>
          </footer>

          {/* AnimatePresence Digital Card Modal Overlay */}
          <AnimatePresence>
            {isCardModalOpen && (
              <DigitalInvitationCard 
                lang={lang} 
                onClose={() => setIsCardModalOpen(false)} 
              />
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
