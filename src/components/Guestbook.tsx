import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Star, Sparkles, Send, Gift } from 'lucide-react';
import { BlessingMessage } from '../types';
import { fetchBlessingsFromSheets, submitBlessingToSheets } from '../googleSheets';

interface GuestbookProps {
  lang?: 'en' | 'hi' | 'mix';
}

const stylePresets = [
  { id: 0, bgClass: 'bg-wedding-crimson text-white border-bright-gold', accentText: 'text-bright-gold', label: 'Crimson Shadi', labelHindi: 'शाही लाल' },
  { id: 1, bgClass: 'bg-saffron text-wedding-maroon border-wedding-maroon', accentText: 'text-wedding-maroon', label: 'Saffron Utsav', labelHindi: 'केसरिया' },
  { id: 2, bgClass: 'bg-marigold-yellow text-wedding-maroon border-marigold-orange', accentText: 'text-marigold-orange', label: 'Genda Yellow', labelHindi: 'गेंदा पीला' },
  { id: 3, bgClass: 'bg-henna-green text-emerald-50 border-emerald-300', accentText: 'text-bright-gold', label: 'Mehendi Green', labelHindi: 'मेहंदी हरा' },
];

export default function Guestbook({ lang = 'hi' }: GuestbookProps) {
  const [messages, setMessages] = useState<BlessingMessage[]>([]);
  const [senderName, setSenderName] = useState('');
  const [relation, setRelation] = useState('Well Wisher');
  const [messageText, setMessageText] = useState('');
  const [activeStyle, setActiveStyle] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch blessings
  useEffect(() => {
    const loadBlessings = async () => {
      const fetched = await fetchBlessingsFromSheets();
      setMessages(fetched);
    };

    loadBlessings();
    
    // Poll for new blessings every 15 seconds to keep it live!
    const interval = setInterval(loadBlessings, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !messageText.trim()) return;

    setLoading(true);
    try {
      const successSent = await submitBlessingToSheets({
        senderName,
        relation,
        message: messageText,
        cardStyle: activeStyle,
      });

      if (successSent) {
        setSenderName('');
        setMessageText('');
        setSuccess(true);
        // Refresh local view immediately
        const updated = await fetchBlessingsFromSheets();
        setMessages(updated);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error saving blessing:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-2 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-saffron font-wedding-devanagari text-sm md:text-base tracking-widest block mb-1 font-bold">
          {lang === 'mix' ? '॥ मंगल आशीर्वाद (Guest Blessings) ॥' : lang === 'en' ? '॥ Guest Blessings ॥' : '॥ मंगल आशीर्वाद एवं शुभकामनाएं ॥'}
        </span>
        <h2 className="text-wedding-maroon font-wedding-display text-2xl md:text-3xl font-extrabold tracking-wide">
          {lang === 'mix' ? 'डिजिटल बधाई पत्र / Greetings Guestbook' : lang === 'en' ? 'Blessings Guestbook' : 'डिजिटल बधाई पत्र (Guestbook)'}
        </h2>
        <p className="text-gray-500 font-wedding-serif text-xs md:text-sm mt-2 max-w-md mx-auto leading-relaxed px-4">
          {lang === 'mix' ? (
            <span className="block space-y-1">
              <span className="block font-wedding-devanagari text-wedding-maroon text-[13px] font-semibold leading-relaxed">
                वर-वधू राजेश एवं आंचल के सुखी वैवाहिक जीवन हेतु अपनी पावन शुभकामनाएं, बधाई संदेश अथवा आशीर्वाद यहाँ अंकित करें।
              </span>
              <span className="block text-[11px] text-gray-400 font-medium italic leading-normal">
                "Leave a beautiful digital blessing or traditional Shubhkaamna for Rajesh & Anchal to cherish forever."
              </span>
            </span>
          ) : lang === 'en' ? (
            'Leave a beautiful digital blessing or traditional Shubhkaamna for Rajesh & Anchal to cherish forever.'
          ) : (
            'वर-वधू राजेश एवं आंचल के सुखी वैवाहिक जीवन हेतु अपनी पावन शुभकामनाएं, बधाई संदेश अथवा आशीर्वाद यहाँ अंकित करें।'
          )}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-royal-gold to-transparent mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Send Blessing Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 md:p-6 border-2 border-royal-gold/30 shadow-xl relative text-left">
          <div className="absolute top-0 right-0 p-3 text-wedding-crimson opacity-15">
            <Gift className="w-12 h-12" />
          </div>

          <h3 className="text-base md:text-lg font-wedding-display font-bold text-wedding-maroon mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Heart className="w-4 h-4 text-wedding-crimson fill-wedding-crimson" />
            {lang === 'mix' ? 'शुभकामना संदेश (Write Shubhkaamna)' : lang === 'en' ? 'Write Shubhkaamna' : 'शुभकामना संदेश लिखें'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
            <div>
              <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Your Name' : lang === 'mix' ? 'आपका शुभ नाम (Your Name)' : 'आपका शुभ नाम'}
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'en' ? 'E.g., Rajesh Soni, Soni Family' : lang === 'mix' ? 'उदा. कन्हैया सोनी, सोनी परिवार (Your Name)' : 'उदा. कन्हैया सोनी, सोनी परिवार'}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold outline-none text-xs md:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Relation / Connection' : lang === 'mix' ? 'संबंध (Relation / Connection)' : 'वर/वधू से संबंध'}
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold outline-none text-xs md:text-sm bg-white"
              >
                <option value="Groom's Family">{lang === 'mix' ? "वर पक्ष (Groom's Family)" : lang === 'en' ? "Groom's Family / Friend" : "वर पक्ष (Family/Friend)"}</option>
                <option value="Bride's Family">{lang === 'mix' ? "वधू पक्ष (Bride's Family)" : lang === 'en' ? "Bride's Family / Friend" : "वधू पक्ष (Family/Friend)"}</option>
                <option value="Well Wisher">{lang === 'mix' ? "शुभचिंतक (Well Wisher)" : lang === 'en' ? "Well Wisher" : "शुभचिंतक (Well Wisher)"}</option>
              </select>
            </div>

            {/* Blessing Card Style Preset Selector */}
            <div>
              <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-2">
                {lang === 'en' ? 'Choose Card Theme' : lang === 'mix' ? 'पत्र का रंग चुनें (Choose Card Theme)' : 'बधाई पत्र का रंग चुनें'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {stylePresets.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setActiveStyle(style.id)}
                    className={`h-9 rounded-lg border text-[10px] font-bold text-center transition-all duration-150 cursor-pointer ${style.bgClass} ${
                      activeStyle === style.id ? 'scale-105 ring-2 ring-royal-gold font-extrabold' : 'opacity-65 hover:opacity-100'
                    }`}
                  >
                    {lang === 'en' ? style.label.split(' ')[0] : style.labelHindi}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Your Blessing Message' : lang === 'mix' ? 'आशीर्वाद संदेश (Your Blessing Message)' : 'आशीर्वाद / बधाई संदेश'}
              </label>
              <textarea
                rows={3}
                required
                placeholder={lang === 'en' ? 'May God bless the couple with lifelong joy...' : lang === 'mix' ? 'ईश्वर नव-दंपत्ति को सुख, समृद्धि एवं अटूट प्रेम प्रदान करें... (May God bless the couple...)' : 'ईश्वर नव-दंपत्ति को सुख, समृद्धि एवं अटूट प्रेम प्रदान करें...'}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-royal-gold outline-none text-xs md:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !senderName.trim() || !messageText.trim()}
              className="w-full bg-wedding-maroon text-bright-gold hover:bg-wedding-crimson py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-royal-gold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {loading 
                ? (lang === 'en' ? 'Sending...' : 'भेजा जा रहा है...') 
                : (lang === 'mix' ? 'शुभ आशीर्वाद भेजें (Send Blessing)' : lang === 'en' ? 'Send Auspicious Blessing' : 'शुभ आशीर्वाद भेजें')
              }
            </button>
          </form>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-wedding-crimson font-wedding-serif text-center font-bold"
            >
              ✨ {lang === 'mix' ? 'आपका बधाई संदेश अंकित हुआ! (Your blessing is posted!)' : lang === 'en' ? 'Your blessing is posted!' : 'आपका बधाई संदेश आशीर्वाद पटल पर अंकित हुआ!'}
            </motion.div>
          )}
        </div>

        {/* Live Blessings Wall Feed */}
        <div className="lg:col-span-7">
          <div className="bg-temple-cream/50 rounded-3xl p-5 md:p-6 border border-royal-gold/20 min-h-[400px] text-left">
            <h3 className="text-base md:text-lg font-wedding-display font-bold text-wedding-maroon mb-4 flex items-center justify-between border-b border-royal-gold/10 pb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-royal-gold animate-spin" />
                {lang === 'mix' ? 'मंगल बधाई पत्र पटल (Greetings Wall)' : lang === 'en' ? 'Auspicious Greetings Wall' : 'मंगल बधाई पत्र पटल (Live)'}
              </span>
              <span className="text-xs bg-wedding-maroon text-bright-gold px-2.5 py-1 rounded-full border border-royal-gold">
                {messages.length} {lang === 'en' ? 'Wishes' : lang === 'mix' ? 'बधाई संदेश (Wishes)' : 'शुभकामनाएं'}
              </span>
            </h3>

            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-wedding-serif italic">
                  {lang === 'mix' ? 'कोई संदेश नहीं मिला। पहला मंगल संदेश आप लिखें! (Be the first to wish!)' : lang === 'en' ? 'No blessings posted yet. Be the first!' : 'कोई संदेश नहीं मिला। पहला मंगल संदेश आप लिखें!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-2">
                <AnimatePresence>
                  {messages.map((msg, index) => {
                    const preset = stylePresets[msg.cardStyle] || stylePresets[0];
                    return (
                      <motion.div
                        key={msg.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className={`p-4 rounded-2xl border-2 shadow-md relative overflow-hidden flex flex-col justify-between ${preset.bgClass}`}
                      >
                        {/* Decorative background heart */}
                        <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none text-white w-16 h-16">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-xs font-wedding-serif italic leading-relaxed opacity-95">
                            "{msg.message}"
                          </p>
                        </div>

                        <div className="mt-4 border-t border-white/20 pt-2 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-extrabold tracking-wide">
                              {msg.senderName}
                            </h4>
                            <span className="text-[9px] opacity-80 uppercase tracking-wider block font-semibold">
                              {msg.relation}
                            </span>
                          </div>
                          <Heart className="w-3.5 h-3.5 text-bright-gold fill-bright-gold shrink-0" />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
