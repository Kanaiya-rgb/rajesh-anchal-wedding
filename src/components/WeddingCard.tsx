import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Star, User, BookOpen, Briefcase, MapPin, Users, Phone, ShieldCheck } from 'lucide-react';

interface WeddingCardProps {
  lang?: 'en' | 'hi' | 'mix';
}

export default function WeddingCard({ lang = 'mix' }: WeddingCardProps) {
  const [activeTab, setActiveTab] = useState<'none' | 'groom' | 'bride'>('none');

  const toggleTab = (tab: 'groom' | 'bride') => {
    setActiveTab(prev => prev === tab ? 'none' : tab);
  };

  return (
    <div className="py-4 px-1 max-w-4xl mx-auto text-center relative">
      {/* Royal Hanging Marigold Strings on card sides (Desktop) */}
      <div className="absolute top-12 left-0 w-3 flex-col items-center gap-1 hidden lg:flex opacity-80 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-[1.5px] h-6 bg-marigold-orange/30" />
            <div className="w-3.5 h-3.5 rounded-full bg-marigold-yellow border border-marigold-orange shadow-sm flex items-center justify-center text-[5px] text-white">❀</div>
          </div>
        ))}
      </div>
      <div className="absolute top-12 right-0 w-3 flex-col items-center gap-1 hidden lg:flex opacity-80 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-[1.5px] h-6 bg-marigold-orange/30" />
            <div className="w-3.5 h-3.5 rounded-full bg-marigold-yellow border border-marigold-orange shadow-sm flex items-center justify-center text-[5px] text-white">❀</div>
          </div>
        ))}
      </div>

      {/* Decorative Traditional Border corners */}
      <div className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 border-t-4 border-l-4 border-royal-gold/40 pointer-events-none rounded-tl-3xl hidden md:block" />
      <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 border-t-4 border-r-4 border-royal-gold/40 pointer-events-none rounded-tr-3xl hidden md:block" />
      <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 border-b-4 border-l-4 border-royal-gold/40 pointer-events-none rounded-bl-3xl hidden md:block" />
      <div className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 border-b-4 border-r-4 border-royal-gold/40 pointer-events-none rounded-br-3xl hidden md:block" />

      {/* Main card panel with royal borders */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0 }}
        className="relative bg-white border-4 border-royal-gold/60 p-5 sm:p-8 md:p-14 rounded-3xl shadow-[0_20px_50px_rgba(139,28,45,0.12)] royal-bg select-none overflow-hidden"
      >
        {/* Elegant double gold-crimson inner border */}
        <div className="absolute inset-1.5 sm:inset-2 border border-wedding-crimson/10 rounded-[22px] pointer-events-none" />
        <div className="absolute inset-2.5 sm:inset-3 border border-royal-gold/20 rounded-[18px] pointer-events-none" />

        {/* Top Sacred Kalash / Mandala Outline Watermark */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-[0.03] w-48 h-48 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-wedding-maroon">
            <path d="M50 5 L62 25 Q50 35 38 25 Z M38 25 Q50 20 62 25 Q68 45 50 65 Q32 45 38 25" />
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Shubh Vivah text header */}
        <div className="mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0.93 }}
            animate={{ scale: [0.96, 1.04, 0.96] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="inline-block bg-gradient-to-r from-wedding-maroon via-wedding-crimson to-wedding-maroon text-bright-gold border-2 border-royal-gold px-8 py-2.5 rounded-full shadow-xl hover:shadow-wedding-crimson/25 transition-all duration-300"
          >
            <span className="font-wedding-devanagari text-xl md:text-2xl tracking-widest block font-bold text-shadow-gold">
              ॥ शुभ विवाह ॥
            </span>
          </motion.div>
          
          <div className="mt-5 text-gray-700 font-wedding-serif text-sm md:text-base max-w-2xl mx-auto px-2">
            {lang === 'mix' ? (
              <div className="space-y-1">
                <span className="block font-wedding-devanagari text-base md:text-lg tracking-wide font-bold text-wedding-maroon leading-relaxed">
                  श्री हनुमान सोनी एवं श्रीमती गीता सोनी <br className="sm:hidden" />
                  <span className="text-royal-gold font-serif text-sm font-normal mx-1">तथा</span> <br className="sm:hidden" />
                  श्री मुन्ना सोनी एवं श्रीमती संगीता सोनी
                </span>
                <span className="block tracking-wider text-xs md:text-sm text-gray-400 font-semibold leading-relaxed">
                  Mr. Hanuman Soni &amp; Mrs. Geeta Soni <br className="sm:hidden" />
                  <span className="text-royal-gold font-serif lowercase italic text-[11px] mx-1">and</span> <br className="sm:hidden" />
                  Mr. Munna Soni &amp; Mrs. Sangeeta Soni
                </span>
              </div>
            ) : lang === 'en' ? (
              <span className="block tracking-wider font-semibold">
                Mr. Hanuman Soni &amp; Mrs. Geeta Soni <br className="sm:hidden" />
                <span className="text-royal-gold font-serif lowercase italic text-xs md:text-sm mx-1">and</span> <br className="sm:hidden" />
                Mr. Munna Soni &amp; Mrs. Sangeeta Soni
              </span>
            ) : (
              <span className="block font-wedding-devanagari text-base md:text-lg tracking-wide font-bold text-wedding-maroon">
                श्री हनुमान सोनी एवं श्रीमती गीता सोनी <br className="sm:hidden" />
                <span className="text-royal-gold font-serif text-sm font-normal mx-1">तथा</span> <br className="sm:hidden" />
                श्री मुन्ना सोनी एवं श्रीमती संगीता सोनी
              </span>
            )}
          </div>

          <p className="text-gray-500 font-wedding-serif text-xs md:text-sm italic mt-2.5 max-w-md mx-auto px-4 leading-relaxed">
            {lang === 'mix' ? (
              <span className="block space-y-1">
                <span className="block font-wedding-devanagari text-wedding-maroon font-semibold not-italic text-sm">अपने प्रिय बच्चों के इस मांगलिक एवं पवित्र विवाह संस्कार के पावन अवसर पर आपको सपरिवार सादर आमंत्रित करते हैं।</span>
                <span className="block text-[11px] text-gray-400">"cordially invite you to celebrate the sacred wedding union of their beloved children"</span>
              </span>
            ) : lang === 'en' 
              ? "cordially invite you to celebrate the sacred wedding union of their beloved children"
              : "अपने प्रिय बच्चों के इस मांगलिक एवं पवित्र विवाह संस्कार के पावन अवसर पर आपको सपरिवार सादर आमंत्रित करते हैं।"
            }
          </p>
        </div>

        {/* Bride & Groom Portrait Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-stretch max-w-3xl mx-auto my-8 relative z-10">
          
          {/* Groom block */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => toggleTab('groom')}
            className={`md:col-span-5 p-6 rounded-3xl bg-white border cursor-pointer transition-all duration-300 flex flex-col justify-between relative group overflow-hidden ${
              activeTab === 'groom' 
                ? 'border-saffron ring-2 ring-saffron/30 shadow-xl' 
                : 'border-royal-gold/25 shadow-md hover:border-royal-gold hover:shadow-lg'
            }`}
          >
            {/* Background delicate shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-bright-gold/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-royal-gold/15 group-hover:border-royal-gold/40 transition-colors pointer-events-none rounded-tr-3xl" />

            <div>
              {/* Royal Groom Motif */}
              <div className="w-16 h-16 rounded-full bg-saffron/10 border border-saffron/30 flex items-center justify-center mx-auto mb-4 relative group-hover:bg-saffron/20 transition-all duration-300 shadow-sm">
                <svg viewBox="0 0 100 100" className="w-9 h-9 fill-saffron">
                  {/* Groom Safa (Turban) Silhouette */}
                  <path d="M30 45 C30 25 70 25 70 45 C70 52 30 52 30 45 Z" />
                  <path d="M50 15 L50 35 L40 32 Z" stroke="gold" strokeWidth="1.5" />
                  <circle cx="50" cy="28" r="2.5" fill="#FFDF00" />
                  <path d="M35 48 Q50 54 65 48" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>

              <span className="text-saffron font-wedding-devanagari text-xs md:text-sm uppercase tracking-wider block font-bold">
                {lang === 'mix' ? 'वर पक्ष (Groom)' : lang === 'en' ? ' वर (Groom)' : 'वर पक्ष (Groom)'}
              </span>
              <h4 className="text-3xl md:text-4xl font-wedding-script text-wedding-crimson mt-1 font-bold">
                Rajesh Soni
              </h4>
              <span className="text-[10px] font-bold text-royal-gold font-wedding-display tracking-widest block mt-1">KASHYAP GOTRA</span>
              
              <div className="flex justify-center items-center gap-1.5 my-3">
                <div className="w-6 h-[1.5px] bg-gradient-to-r from-transparent to-wedding-crimson/30" />
                <span className="text-wedding-crimson text-[8px]">❀</span>
                <div className="w-6 h-[1.5px] bg-gradient-to-l from-transparent to-wedding-crimson/30" />
              </div>
              
              <div className="text-xs text-gray-500 font-wedding-serif leading-relaxed px-1">
                {lang === 'mix' ? (
                  <span className="block space-y-1 text-center">
                    <span className="block font-wedding-devanagari text-wedding-maroon font-bold text-xs leading-normal">एम.एससी (ऑर्गेनिक केमिस्ट्री), क्वालिटी कंट्रोल विभाग में ऑफिसर (Troikaa Pharmaceuticals)। श्री हनुमान सोनी एवं श्रीमती गीता सोनी के सुपुत्र।</span>
                    <span className="block text-[10px] text-gray-400 font-medium leading-normal">M.Sc. Organic Chemistry, Quality Control Officer at Troikaa Pharmaceuticals, Dahej. Loving son of Mr. Hanuman &amp; Mrs. Geeta Soni.</span>
                  </span>
                ) : lang === 'en' ? (
                  <p>"M.Sc. Organic Chemistry, Quality Control Officer at Troikaa Pharmaceuticals, Dahej. Loving son of Mr. Hanuman & Mrs. Geeta Soni."</p>
                ) : (
                  <p>"एम.एससी (ऑर्गेनिक केमिस्ट्री), क्वालिटी कंट्रोल विभाग में ऑफिसर (Troikaa Pharmaceuticals). श्री हनुमान सोनी एवं श्रीमती गीता सोनी के सुपुत्र।"</p>
                )}
              </div>
            </div>

            <div className="mt-4 text-[10px] text-wedding-crimson font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              <span>
                {activeTab === 'groom' 
                  ? (lang === 'mix' ? '✕ विवरण बंद करें (Close)' : lang === 'en' ? '✕ Close Details' : '✕ विवरण बंद करें') 
                  : (lang === 'mix' ? '🤵 पूरा बायोडाटा देखें (Biodata)' : lang === 'en' ? '🤵 View Full Biodata' : '🤵 पूरा बायोडाटा देखें')
                }
              </span>
            </div>
          </motion.div>

          {/* Knot of Union Motif */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-4 md:py-0 relative">
            <motion.div 
              animate={{ 
                scale: [1, 1.12, 1],
                boxShadow: ["0px 4px 10px rgba(158,27,50,0.15)", "0px 6px 18px rgba(158,27,50,0.35)", "0px 4px 10px rgba(158,27,50,0.15)"]
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-wedding-crimson to-wedding-maroon text-bright-gold flex items-center justify-center border-2 border-royal-gold cursor-pointer z-10"
            >
              <Heart className="w-5 h-5 fill-bright-gold" />
            </motion.div>
            <div className="w-[1.5px] h-full bg-dashed border-l border-royal-gold/30 mt-1 hidden md:block absolute top-1/2 bottom-0 z-0" />
          </div>

          {/* Bride block */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => toggleTab('bride')}
            className={`md:col-span-5 p-6 rounded-3xl bg-white border cursor-pointer transition-all duration-300 flex flex-col justify-between relative group overflow-hidden ${
              activeTab === 'bride' 
                ? 'border-saffron ring-2 ring-saffron/30 shadow-xl' 
                : 'border-royal-gold/25 shadow-md hover:border-royal-gold hover:shadow-lg'
            }`}
          >
            {/* Background delicate shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-bright-gold/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-royal-gold/15 group-hover:border-royal-gold/40 transition-colors pointer-events-none rounded-tl-3xl" />

            <div>
              {/* Royal Bride Motif */}
              <div className="w-16 h-16 rounded-full bg-wedding-crimson/5 border border-wedding-crimson/20 flex items-center justify-center mx-auto mb-4 relative group-hover:bg-wedding-crimson/10 transition-all duration-300 shadow-sm">
                <svg viewBox="0 0 100 100" className="w-9 h-9 fill-wedding-crimson">
                  {/* Bride Nath (Nose-ring) and Maang Tikka outline */}
                  <circle cx="50" cy="18" r="3" fill="#D4AF37" />
                  <path d="M50 18 L50 35" stroke="#D4AF37" strokeWidth="1.5" />
                  <circle cx="50" cy="35" r="4.5" fill="#D4AF37" />
                  <circle cx="48" cy="55" r="14" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
                  <path d="M62 55 Q74 42 50 35" stroke="#D4AF37" strokeWidth="1" fill="none" strokeDasharray="1.5,1.5" />
                  <circle cx="34" cy="55" r="2.5" fill="#FF5722" />
                </svg>
              </div>

              <span className="text-saffron font-wedding-devanagari text-xs md:text-sm uppercase tracking-wider block font-bold">
                {lang === 'mix' ? 'वधू पक्ष (Bride)' : lang === 'en' ? 'वधू (Bride)' : 'वधू पक्ष (Bride)'}
              </span>
              <h4 className="text-3xl md:text-4xl font-wedding-script text-wedding-crimson mt-1 font-bold">
                Anchal Soni
              </h4>
              <span className="text-[10px] font-bold text-royal-gold font-wedding-display tracking-widest block mt-1">BADAGARIYA GOTRA</span>
              
              <div className="flex justify-center items-center gap-1.5 my-3">
                <div className="w-6 h-[1.5px] bg-gradient-to-r from-transparent to-wedding-crimson/30" />
                <span className="text-wedding-crimson text-[8px]">❀</span>
                <div className="w-6 h-[1.5px] bg-gradient-to-l from-transparent to-wedding-crimson/30" />
              </div>
              
              <div className="text-xs text-gray-500 font-wedding-serif leading-relaxed px-1">
                {lang === 'mix' ? (
                  <span className="block space-y-1 text-center">
                    <span className="block font-wedding-devanagari text-wedding-maroon font-bold text-xs leading-normal">बी.एससी (ZCB), बी.एड (प्रथम वर्ष - प्रगति पर)। सुशील एवं गुणवान सुपुत्री श्री मुन्ना सोनी एवं श्रीमती संगीता सोनी। जन्म स्थान - समदर खुर्द, गोरखपुर।</span>
                    <span className="block text-[10px] text-gray-400 font-medium leading-normal">B.Sc. (ZCB), B.Ed (1st year, running). Talented and graceful daughter of Mr. Munna &amp; Mrs. Sangeeta Soni. Born in Samdar Khurd, Gorakhpur.</span>
                  </span>
                ) : lang === 'en' ? (
                  <p>"B.Sc. (ZCB), B.Ed (1st year). Talented, graceful daughter of Mr. Munna & Mrs. Sangeeta Soni. Born in Samdar Khurd, Gorakhpur."</p>
                ) : (
                  <p>"बी.एससी (ZCB), बी.एड (प्रथम वर्ष)। सुशील एवं गुणवान सुपुत्री श्री मुन्ना सोनी एवं श्रीमती संगीता सोनी।"</p>
                )}
              </div>
            </div>

            <div className="mt-4 text-[10px] text-wedding-crimson font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              <span>
                {activeTab === 'bride' 
                  ? (lang === 'mix' ? '✕ विवरण बंद करें (Close)' : lang === 'en' ? '✕ Close Details' : '✕ विवरण बंद करें') 
                  : (lang === 'mix' ? '👰 पूरा बायोडाटा देखें (Biodata)' : lang === 'en' ? '👰 View Full Biodata' : '👰 पूरा बायोडाटा देखें')
                }
              </span>
            </div>
          </motion.div>

        </div>

        {/* DETAILED INTERACTIVE BIODATA EXPANSION DRAWER */}
        <AnimatePresence>
          {activeTab !== 'none' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 border-t-2 border-royal-gold/20 pt-6 text-left max-w-2xl mx-auto overflow-hidden bg-temple-cream/40 p-4 md:p-6 rounded-2xl relative"
            >
              <div className="absolute top-2 right-2 text-royal-gold/30 text-[10px] font-mono">CONFIDENTIAL &amp; AUTHENTIC</div>
              
              <h5 className="text-wedding-maroon font-wedding-display font-extrabold text-lg mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-saffron" />
                {activeTab === 'groom' ? (
                  lang === 'mix' 
                    ? 'वर का विस्तृत बायोडाटा / Groom Detailed Biodata' 
                    : lang === 'en' 
                      ? 'Groom Detailed Biodata' 
                      : 'वर का विस्तृत बायोडाटा (Rajesh Soni)'
                ) : (
                  lang === 'mix' 
                    ? 'वधू का विस्तृत बायोडाटा / Bride Detailed Biodata' 
                    : lang === 'en' 
                      ? 'Bride Detailed Biodata' 
                      : 'वधू का विस्तृत बायोडाटा (Anchal Soni)'
                )}
              </h5>

              {activeTab === 'groom' ? (
                <div className="space-y-4 text-xs md:text-sm">
                  {/* Personal details table */}
                  <div className="bg-white rounded-xl p-3 md:p-4 border border-royal-gold/15 shadow-sm space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'Full Name' : lang === 'mix' ? 'पूरा नाम (Name)' : 'पूरा नाम'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Soni Rajeshkumar Hanumanbhai</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'DOB / Age' : lang === 'mix' ? 'जन्म तिथि (DOB)' : 'जन्म तिथि / आयु'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">22 November 1999 (26 Years)</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'Gotra / Religion' : lang === 'mix' ? 'गोत्र (Gotra)' : 'गोत्र / धर्म'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Kashyap · Hindu (कश्यप · हिन्दू)</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'Height' : lang === 'mix' ? 'लंबाई (Height)' : 'लंबाई'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">5 Feet 9 Inches (5'9")</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'Birth Place' : lang === 'mix' ? 'जन्म स्थान (Birthplace)' : 'जन्म स्थान'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Mithabel, Chauri Chaura, Gorakhpur, UP</div>
                    </div>
                  </div>

                  {/* Education / Occupation */}
                  <div className="bg-white rounded-xl p-3 md:p-4 border border-royal-gold/15 shadow-sm space-y-2.5">
                    <h6 className="font-bold text-saffron flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wide">
                      <BookOpen className="w-4 h-4" /> {lang === 'en' ? 'Education & Profession' : lang === 'mix' ? 'शिक्षा एवं व्यवसाय (Education & Career)' : 'शिक्षा एवं व्यवसाय'}
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Education' : lang === 'mix' ? 'योग्यता (Education)' : 'योग्यता'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">
                        M.Sc. Organic Chemistry (2022) · B.Sc. Chemistry (2020)
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Current Role' : lang === 'mix' ? 'कार्यरत (Role)' : 'कार्यरत'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Officer – Quality Control Department</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Employer' : lang === 'mix' ? 'कंपनी (Employer)' : 'कंपनी'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Troikaa Pharmaceuticals Ltd., Dahej (Gujarat)</div>
                    </div>
                  </div>

                  {/* Family details */}
                  <div className="bg-white rounded-xl p-3 md:p-4 border border-royal-gold/15 shadow-sm space-y-2.5">
                    <h6 className="font-bold text-saffron flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wide">
                      <Users className="w-4 h-4" /> {lang === 'en' ? 'Family & Relatives' : lang === 'mix' ? 'पारिवारिक विवरण (Family Details)' : 'पारिवारिक विवरण'}
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Father' : lang === 'mix' ? 'पिताजी (Father)' : 'पिताजी'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-bold">
                        Mr. Hanuman Soni <span className="font-normal text-xs text-gray-500">{lang === 'mix' ? '(Self-Employed JCB Operator / स्व-व्यवसायी जेसीबी ऑपरेटर)' : '(Self-Employed JCB Operator)'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Mother' : lang === 'mix' ? 'माताजी (Mother)' : 'माताजी'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">
                        Mrs. Geeta Soni <span className="font-normal text-xs text-gray-500">{lang === 'mix' ? '(Housewife / गृहणी)' : '(Housewife)'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Siblings' : lang === 'mix' ? 'भाई-बहन (Siblings)' : 'भाई-बहन'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold space-y-1">
                        <div>• Radhika Soni <span className="text-gray-500 text-xs">{lang === 'mix' ? '(Elder Sister / बड़ी बहन - Pursuing MBA in London, UK)' : '(Elder Sister - Pursuing MBA in London, UK)'}</span></div>
                        <div>• Kanaiya Soni <span className="text-gray-500 text-xs">{lang === 'mix' ? '(Younger Brother / छोटा भाई - Pursuing B.E. in CSE, Final Year)' : '(Younger Brother - Pursuing B.E. in CSE, Final Year)'}</span></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 pb-2 border-b border-gray-100 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Permanent Residence' : lang === 'mix' ? 'स्थायी पता (Residence)' : 'स्थायी पता'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Adarsh Nagar – 2, Sayan, Ta. Olpad, Dist. Surat, Gujarat – 394130</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-green-600 shrink-0" /> {lang === 'en' ? 'Contact' : lang === 'mix' ? 'संपर्क (Contact)' : 'संपर्क नंबर'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-crimson font-extrabold">+91 9909161039</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs md:text-sm">
                  {/* Personal details table */}
                  <div className="bg-white rounded-xl p-3 md:p-4 border border-royal-gold/15 shadow-sm space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'Full Name' : lang === 'mix' ? 'पूरा नाम (Name)' : 'पूरा नाम'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Anchal Soni</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'DOB' : lang === 'mix' ? 'जन्म तिथि (DOB)' : 'जन्म तिथि'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">14 June 2003 (23 Years)</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'Gotra / Religion' : lang === 'mix' ? 'गोत्र (Gotra)' : 'गोत्र / धर्म'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Badagariya · Hindu (बड़गरिया · हिन्दू)</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'Height' : lang === 'mix' ? 'लंबाई (Height)' : 'लंबाई'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">5 Feet 6 Inches (5'6")</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-saffron shrink-0" /> {lang === 'en' ? 'Birth Place' : lang === 'mix' ? 'जन्म स्थान (Birthplace)' : 'जन्म स्थान'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Samdar Khurd, Gorakhpur, Uttar Pradesh</div>
                    </div>
                  </div>

                  {/* Education / Occupation */}
                  <div className="bg-white rounded-xl p-3 md:p-4 border border-royal-gold/15 shadow-sm space-y-2.5">
                    <h6 className="font-bold text-saffron flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wide">
                      <BookOpen className="w-4 h-4" /> {lang === 'en' ? 'Education' : lang === 'mix' ? 'शैक्षणिक विवरण (Education)' : 'शैक्षणिक विवरण'}
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Degree' : lang === 'mix' ? 'स्नातक (Degree)' : 'स्नातक'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">
                        B.Sc. (ZCB - Zoology, Chemistry, Botany)
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Professional' : lang === 'mix' ? 'प्रशिक्षण (Professional)' : 'प्रशिक्षण'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">B.Ed. (In Progress - 1st Year)</div>
                    </div>
                  </div>

                  {/* Family details */}
                  <div className="bg-white rounded-xl p-3 md:p-4 border border-royal-gold/15 shadow-sm space-y-2.5">
                    <h6 className="font-bold text-saffron flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wide">
                      <Users className="w-4 h-4" /> {lang === 'en' ? 'Family & Relatives' : lang === 'mix' ? 'पारिवारिक विवरण (Family Details)' : 'पारिवारिक विवरण'}
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Father' : lang === 'mix' ? 'पिताजी (Father)' : 'पिताजी'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-bold">
                        Mr. Munna Soni <span className="font-normal text-xs text-gray-500">{lang === 'mix' ? '(Worker in Roca Bathroom Products Pvt. Ltd. / रोका बाथरूम प्रोडक्ट्स में कार्यरत)' : '(Worker in Roca Bathroom Products Pvt. Ltd.)'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Mother' : lang === 'mix' ? 'माताजी (Mother)' : 'माताजी'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">
                        Mrs. Sangeeta Soni <span className="font-normal text-xs text-gray-500">{lang === 'mix' ? '(Housewife / गृहणी)' : '(Housewife)'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Siblings' : lang === 'mix' ? 'भाई-बहन (Siblings)' : 'भाई-बहन'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold space-y-1">
                        <div>• Akash Soni <span className="text-gray-500 text-xs">{lang === 'mix' ? '(Elder Brother / बड़ा भाई)' : '(Elder Brother)'}</span></div>
                        <div>• Khushi Soni &amp; Manshi Soni <span className="text-gray-500 text-xs">{lang === 'mix' ? '(Two Younger Sisters / दो छोटी बहनें)' : '(Two Younger Sisters)'}</span></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-gray-100 pb-2 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Present Residence' : lang === 'mix' ? 'वर्तमान निवास (Residence)' : 'वर्तमान निवास'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Near Jain Public School, Kamla Colony, Desoola, Alwar, Rajasthan</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                      <div className="col-span-1 sm:col-span-4 text-gray-400 font-medium">{lang === 'en' ? 'Permanent Address' : lang === 'mix' ? 'स्थायी पता (Permanent Addr)' : 'स्थायी पता'}</div>
                      <div className="col-span-1 sm:col-span-8 text-wedding-maroon font-semibold">Samdar Khurd, Gorakhpur, Uttar Pradesh</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Traditional Auspicious Wedding Mantra */}
        <div className="my-8 max-w-lg mx-auto p-5 bg-gradient-to-br from-temple-cream/90 to-white/95 border-2 border-dashed border-royal-gold/40 rounded-3xl relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-1 right-2 text-royal-gold/25 font-bold text-lg select-none">❀</div>
          <div className="absolute bottom-1 left-2 text-royal-gold/25 font-bold text-lg select-none">❀</div>

          <span className="text-wedding-crimson font-wedding-devanagari text-xs font-bold uppercase tracking-widest block mb-1.5">
            {lang === 'en' ? 'Auspicious Marriage Mantra' : 'पावन वैवाहिक श्लोक'}
          </span>
          <p className="text-wedding-maroon font-wedding-serif text-base md:text-lg italic font-bold leading-relaxed mb-1 tracking-wide">
            "धर्मेच अर्थेच कामेच मोक्षेच नातिचरामि।"
          </p>
          <p className="text-gray-400 font-wedding-serif text-[11px] leading-relaxed max-w-sm mx-auto">
            {lang === 'en' 
              ? '"I pledge to accompany you, honor you, and remain faithful in righteousness, prosperity, love, and spiritual salvation."'
              : '"धर्म, अर्थ, काम और मोक्ष के इस पावन मार्ग पर मैं सदैव आपके साथ रहूँगा/रहूँगी और आपके प्रति समर्पित रहूँगा/रहूँगी।"'
            }
          </p>
        </div>

        {/* Date, Location Callout */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 border-t border-royal-gold/30 pt-6"
        >
          <div className="inline-flex items-center gap-1.5 text-saffron font-wedding-devanagari text-xs uppercase tracking-widest mb-2 font-bold">
            <Star className="w-3.5 h-3.5 animate-pulse text-bright-gold" />
            <span>{lang === 'en' ? 'Auspicious Wedding Muhurat' : 'पावन लग्न मुहूर्त'}</span>
            <Star className="w-3.5 h-3.5 animate-pulse text-bright-gold" />
          </div>
          <p className="font-wedding-display text-xl md:text-3xl text-wedding-maroon font-extrabold tracking-widest uppercase drop-shadow-[0_1px_1px_rgba(212,175,55,0.1)]">
            {lang === 'en' ? 'Monday, February 22, 2027' : 'सोमवार, 22 फरवरी 2027'}
          </p>
          <p className="text-saffron font-wedding-serif text-sm md:text-base font-bold mt-1 tracking-wide">
            {lang === 'en' 
              ? 'Shehnai Marriage Lawn & Resort · Gorakhpur, Uttar Pradesh'
              : 'शहनाई मैरिज लॉन एवं रिसॉर्ट · गोरखपुर, उत्तर प्रदेश'
            }
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}
