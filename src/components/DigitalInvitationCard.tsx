import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share2, Palette, Languages, Sparkles, X, Heart, MapPin, Calendar, Users, Flower } from 'lucide-react';
import html2canvas from 'html2canvas';

interface DigitalInvitationCardProps {
  lang?: 'en' | 'hi' | 'mix';
  onClose?: () => void;
}

type CardTheme = 'crimson' | 'saffron' | 'emerald';
type CardLang = 'en' | 'hi' | 'mix';

export default function DigitalInvitationCard({ lang: initialLang = 'mix', onClose }: DigitalInvitationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<CardTheme>('crimson');
  const [cardLang, setCardLang] = useState<CardLang>(initialLang);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Theme styling configurations
  const themeStyles = {
    crimson: {
      bg: 'bg-gradient-to-b from-[#7A1221] to-[#4A0710]',
      innerBg: 'bg-[#FDF9F3]',
      textPrimary: 'text-[#7A1221]',
      textSecondary: 'text-[#8E7044]',
      borderGold: 'border-[#D4AF37]',
      accentColor: 'text-[#E5C158]',
      cardTitleBg: 'from-[#7A1221] to-[#4A0710]',
      cardTitleBorder: 'border-[#D4AF37]',
      cardTitleText: 'text-[#E5C158]',
      overlayText: 'text-[#FDF9F3]/90',
      tagBg: 'bg-[#7A1221]/10 text-[#7A1221] border-[#7A1221]/20',
    },
    saffron: {
      bg: 'bg-gradient-to-b from-[#C95B00] to-[#803100]',
      innerBg: 'bg-[#FEFAF4]',
      textPrimary: 'text-[#C95B00]',
      textSecondary: 'text-[#8B5E3C]',
      borderGold: 'border-[#D4AF37]',
      accentColor: 'text-[#E5C158]',
      cardTitleBg: 'from-[#C95B00] to-[#803100]',
      cardTitleBorder: 'border-[#E5C158]',
      cardTitleText: 'text-white',
      overlayText: 'text-white/90',
      tagBg: 'bg-[#C95B00]/10 text-[#C95B00] border-[#C95B00]/20',
    },
    emerald: {
      bg: 'bg-gradient-to-b from-[#0E5135] to-[#05291A]',
      innerBg: 'bg-[#FAFDFB]',
      textPrimary: 'text-[#0E5135]',
      textSecondary: 'text-[#786443]',
      borderGold: 'border-[#D4AF37]',
      accentColor: 'text-[#E5C158]',
      cardTitleBg: 'from-[#0E5135] to-[#05291A]',
      cardTitleBorder: 'border-[#D4AF37]',
      cardTitleText: 'text-[#E5C158]',
      overlayText: 'text-[#FAFDFB]/90',
      tagBg: 'bg-[#0E5135]/10 text-[#0E5135] border-[#0E5135]/20',
    }
  };

  const currentTheme = themeStyles[theme];

  // Helper translations for the card itself
  const t = {
    en: {
      shreeGanesh: "॥ Shree Ganeshaya Namah ॥",
      shubhVivah: "॥ SHUBH VIVAH ॥",
      cordialInvite: "With the divine blessings of Almighty, we cordially invite you to join the auspicious celebrations of the marriage union of",
      and: "&",
      sonOf: "Beloved Son of",
      daughterOf: "Beloved Daughter of",
      grandparentsGroom: "Grandson of Late Sri...",
      grandparentsBride: "Granddaughter of Late Sri...",
      parentsGroom: "Mr. Hanuman Soni & Mrs. Geeta Soni",
      parentsBride: "Mr. Munna Soni & Mrs. Sangeeta Soni",
      marriageMantra: '"Dharmecha Arthecha Kamecha Mokshecha Nati Charami"',
      dateText: "Monday, February 22, 2027",
      muhuratText: "Auspicious Muhurat: 11:00 AM onwards",
      venueTitle: "VENUE:",
      venueDetail: "Shehnai Marriage Lawn & Resort",
      venueAddress: "Near Highway Crossing, Chauri Chaura, Gorakhpur, UP",
      inviteFrom: "Invitation From: Soni & Family",
      bestWishes: "Best compliments from relatives & friends.",
      downloadNotice: "Saved to downloads! Share it with friends and family."
    },
    hi: {
      shreeGanesh: "॥ श्री गणेशाय नमः ॥",
      shubhVivah: "॥ शुभ विवाह ॥",
      cordialInvite: "परमेश्वर की असीम कृपा से, हमारे प्रिय बच्चों के मांगलिक विवाह संस्कार के पावन अवसर पर हम आपको सपरिवार सादर आमंत्रित करते हैं।",
      and: "एवं",
      sonOf: "सुपुत्र",
      daughterOf: "सुपुत्री",
      parentsGroom: "श्रीमती गीता सोनी एवं श्री हनुमान सोनी",
      parentsBride: "श्रीमती संगीता सोनी एवं श्री मुन्ना सोनी",
      marriageMantra: '"धर्मेच अर्थेच कामेच मोक्षेच नातिचरामि।"',
      dateText: "सोमवार, 22 फरवरी 2027",
      muhuratText: "पावन लग्न मुहूर्त: सुबह 11:00 बजे से",
      venueTitle: "विवाह स्थल:",
      venueDetail: "शहनाई मैरिज लॉन एवं रिसॉर्ट",
      venueAddress: "हाईवे क्रॉसिंग के पास, चौरी चौरा, गोरखपुर, उत्तर प्रदेश",
      inviteFrom: "दर्शनाभिलाषी: समस्त सोनी परिवार एवं मित्रगण",
      bestWishes: "बाल हठ: वर-वधू को आशीर्वाद देने जरूर पधारें।",
      downloadNotice: "कार्ड गैलरी में सेव हो गया है! इसे शेयर करें।"
    },
    mix: {
      shreeGanesh: "॥ श्री गणेशाय नमः / Shree Ganeshaya Namah ॥",
      shubhVivah: "॥ शुभ विवाह / SHUBH VIVAH ॥",
      cordialInvite: "श्रीमती गीता सोनी एवं श्री हनुमान सोनी (वर पक्ष) तथा श्रीमती संगीता सोनी एवं श्री मुन्ना सोनी (वधू पक्ष) अपने प्रिय बच्चों के पावन परिणय सूत्र के शुभ अवसर पर आपको सपरिवार सादर आमंत्रित करते हैं।",
      and: "संग (Weds)",
      sonOf: "सुपुत्र (Son of)",
      daughterOf: "सुपुत्री (Daughter of)",
      parentsGroom: "Mr. Hanuman & Mrs. Geeta Soni",
      parentsBride: "Mr. Munna & Mrs. Sangeeta Soni",
      marriageMantra: '"धर्मेच अर्थेच कामेच मोक्षेच नातिचरामि।"',
      dateText: "सोमवार, 22 फरवरी 2027 (Monday, Feb 22, 2027)",
      muhuratText: "शुभ मुहूर्त: 11:00 AM (Auspicious Muhurat)",
      venueTitle: "विवाह स्थल / Venue:",
      venueDetail: "शहनाई मैरिज लॉन एवं रिसॉर्ट (Shehnai Resort)",
      venueAddress: "चौरी चौरा, गोरखपुर, उत्तर प्रदेश / Chauri Chaura, Gorakhpur, UP",
      inviteFrom: "निमंत्रक: सोनी परिवार (Soni Families & Relatives)",
      bestWishes: "With best compliments from relatives & friends.",
      downloadNotice: "कार्ड डाउनलोड हो गया है! / Invitation card saved!"
    }
  }[cardLang];

  // Download logic using html2canvas
  const handleDownload = async () => {
    if (!cardRef.current || isGenerating) return;

    setIsGenerating(true);
    setIsSuccess(false);

    try {
      // Small delay to ensure rendering matches perfectly
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture options optimized for crisp text and graphics on high-DPI screens
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Double resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme === 'crimson' ? '#4A0710' : theme === 'saffron' ? '#803100' : '#05291A',
        logging: false,
        onclone: (clonedDoc) => {
          // Adjust cloned document styles if needed
          const clonedCard = clonedDoc.getElementById('invitation-card-capture');
          if (clonedCard) {
            clonedCard.style.transform = 'scale(1)';
            clonedCard.style.boxShadow = 'none';
            clonedCard.style.borderRadius = '0px';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Wedding_Invitation_Rajesh_and_Anchal_${theme}_${cardLang}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rajesh & Anchal Wedding Invitation",
          text: "You are cordially invited to celebrate the wedding ceremony of Rajesh & Anchal on Monday, Feb 22, 2027 in Gorakhpur, UP. Visit our digital card here!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback for desktop: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(cardLang === 'en' ? "Link copied to clipboard! Share it on WhatsApp." : "लिंक कॉपी हो गया है! व्हाट्सप्प पर शेयर करें।");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-md">
      {/* Outer Click Close Container */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-white border-2 border-royal-gold rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden z-10 flex flex-col lg:flex-row h-auto max-h-[90vh]"
      >
        
        {/* Left Side: Controls & Customizer */}
        <div className="p-5 md:p-8 lg:w-2/5 border-b lg:border-b-0 lg:border-r border-royal-gold/20 bg-temple-cream/30 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 text-wedding-crimson">
                <Flower className="w-5 h-5 text-marigold-orange animate-spin" />
                <h2 className="text-xl font-bold font-wedding-display tracking-wide">डिजिटल आमंत्रण पत्र</h2>
              </div>
              <button 
                onClick={onClose}
                className="lg:hidden p-1.5 hover:bg-wedding-maroon/5 rounded-full text-wedding-maroon border border-royal-gold/20"
                id="close-card-btn-mobile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 font-wedding-serif leading-relaxed mb-6">
              {initialLang === 'hi' 
                ? 'वर-वधू के विवाह का एक सुंदर एवं पारंपरिक डिजिटल कार्ड जनरेट करें। अपनी पसंद के अनुसार कलर थीम और भाषा चुनें, फिर इसे डाउनलोड कर अपने मित्रों और रिश्तेदारों के साथ शेयर करें।'
                : 'Generate a stunning traditional digital invitation card for Rajesh & Anchal\'s wedding. Choose your preferred royal color theme and language, then download it as an image to share directly.'}
            </p>

            {/* Language Selector */}
            <div className="mb-5">
              <label className="text-[10px] font-bold text-royal-gold uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5" /> भाषा चुनें / Select Language
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['mix', 'hi', 'en'] as CardLang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setCardLang(l)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      cardLang === l
                        ? 'bg-wedding-maroon text-bright-gold border-royal-gold shadow-sm'
                        : 'bg-white text-wedding-maroon border-royal-gold/20 hover:bg-wedding-maroon/5'
                    }`}
                  >
                    {l === 'mix' ? 'दोनों Mix' : l === 'hi' ? 'हिन्दी' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="mb-6">
              <label className="text-[10px] font-bold text-royal-gold uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" /> शाही कलर थीम / Choose Royal Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['crimson', 'saffron', 'emerald'] as CardTheme[]).map((tName) => (
                  <button
                    key={tName}
                    onClick={() => setTheme(tName)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      theme === tName
                        ? 'ring-2 ring-royal-gold/60 border-royal-gold shadow-sm font-extrabold scale-102'
                        : 'border-royal-gold/15 bg-white opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full shadow-inner ${
                      tName === 'crimson' ? 'bg-[#7A1221]' : tName === 'saffron' ? 'bg-[#C95B00]' : 'bg-[#0E5135]'
                    }`} />
                    <span className="text-[10px] tracking-wide capitalize">
                      {tName === 'crimson' ? 'Crimson' : tName === 'saffron' ? 'Saffron' : 'Emerald'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="p-3.5 bg-white rounded-xl border border-royal-gold/15 space-y-1.5 text-[11px] leading-relaxed text-gray-500 mb-6">
              <span className="font-bold text-wedding-maroon flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-saffron animate-pulse" /> उपयोगी निर्देश / Features:
              </span>
              <ul className="list-disc list-inside space-y-1 font-wedding-serif text-[10.5px]">
                <li><b>हाई-क्वालिटी डाउनलोड:</b> 2x रेजोल्यूशन में एकदम क्रिस्प और क्लीन इमेज डाउनलोड होगी।</li>
                <li><b>व्हाट्सप्प शेयरिंग:</b> आप सीधे इस इमेज को व्हाट्सप्प ग्रुप्स या स्टेटस पर पोस्ट कर सकते हैं।</li>
                <li><b>सदाबहार डिज़ाइन:</b> भगवान गणेश के पवित्र श्लोक, कलश जलमार्क एवं शाही तोरण से सुसज्जित।</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full relative px-6 py-3 bg-gradient-to-r from-wedding-crimson to-wedding-maroon hover:from-wedding-maroon hover:to-wedding-maroon text-bright-gold font-bold uppercase tracking-widest rounded-xl border-2 border-royal-gold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden flex items-center justify-center gap-2 text-sm disabled:opacity-75"
              id="download-card-image-btn"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-bright-gold" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>तैयार किया जा रहा है...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>कार्ड इमेज डाउनलोड करें</span>
                </>
              )}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 bg-white hover:bg-wedding-maroon/5 text-wedding-maroon border-2 border-royal-gold/30 hover:border-royal-gold rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                id="share-invite-link-btn"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>लिंक शेयर करें</span>
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400 rounded-xl text-xs font-bold transition-all cursor-pointer hidden lg:block"
                id="close-card-btn-desktop"
              >
                बंद करें
              </button>
            </div>

            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-2.5 bg-green-50 text-green-800 text-[11px] font-bold text-center border border-green-200 rounded-lg"
                >
                  🎉 {t.downloadNotice}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Invitation Live Preview (Scrollable wrapper to ensure perfect display on all screens) */}
        <div className="flex-1 p-4 md:p-8 bg-neutral-900/10 flex items-center justify-center overflow-y-auto max-h-[50vh] lg:max-h-full">
          
          {/* Outer alignment container representing the mobile phone viewport aspect ratio */}
          <div className="relative shadow-2xl border-4 border-royal-gold rounded-2xl overflow-hidden bg-white max-w-[420px] w-full aspect-[9/16] shrink-0">
            
            {/* The absolute container caught by html2canvas */}
            <div 
              ref={cardRef} 
              id="invitation-card-capture"
              className={`w-full h-full p-4 sm:p-6 ${currentTheme.bg} relative flex flex-col justify-between overflow-hidden select-none`}
              style={{ width: '420px', height: '746px', fontFamily: '"Georgia", serif' }}
            >
              
              {/* Traditional Toran at top */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-saffron via-marigold-yellow to-saffron z-10" />
              <div className="flex justify-around absolute w-full top-2 inset-x-0 z-10 pointer-events-none text-marigold-orange">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-[1px] h-3 bg-marigold-orange/30" />
                    <div className="w-2 h-2 rounded-full bg-marigold-yellow border border-marigold-orange flex items-center justify-center text-[3px] text-white">❀</div>
                  </div>
                ))}
              </div>

              {/* Decorative Corner Borders */}
              <div className={`absolute top-2.5 left-2.5 w-12 h-12 border-t-2 border-l-2 ${currentTheme.borderGold} rounded-tl-xl pointer-events-none`} />
              <div className={`absolute top-2.5 right-2.5 w-12 h-12 border-t-2 border-r-2 ${currentTheme.borderGold} rounded-tr-xl pointer-events-none`} />
              <div className={`absolute bottom-2.5 left-2.5 w-12 h-12 border-b-2 border-l-2 ${currentTheme.borderGold} rounded-bl-xl pointer-events-none`} />
              <div className={`absolute bottom-2.5 right-2.5 w-12 h-12 border-b-2 border-r-2 ${currentTheme.borderGold} rounded-br-xl pointer-events-none`} />

              {/* Inner container with light traditional royal background paper card */}
              <div className={`w-full h-full rounded-xl ${currentTheme.innerBg} p-3.5 border-2 ${currentTheme.borderGold} flex flex-col justify-between items-center text-center relative overflow-hidden`}>
                
                {/* Gold Inner Hairlines */}
                <div className={`absolute inset-1 border border-wedding-crimson/5 rounded-lg pointer-events-none`} />
                <div className={`absolute inset-2 border border-royal-gold/15 rounded-md pointer-events-none`} />

                {/* Mandala Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] w-72 h-72 pointer-events-none z-0">
                  <svg viewBox="0 0 100 100" className={`w-full h-full fill-[#7A1221]`}>
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                    <path d="M50,5 L52,20 L55,5 L57,20 M50,95 L48,80 L45,95 L43,80 M5,50 L20,52 L5,55 L20,57 M95,50 L80,48 L95,45 L80,43" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                </div>

                {/* Section 1: Sacred Shlok / Lord Ganesha */}
                <div className="relative z-10 w-full mt-1.5">
                  {/* Beautiful Handcrafted Ganesha Silhouette */}
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${currentTheme.cardTitleBg} border border-royal-gold/30 flex items-center justify-center mx-auto mb-1.5 shadow-sm`}>
                    <svg viewBox="0 0 100 100" className="w-7 h-7 fill-[#E5C158]">
                      <path d="M50 15 C42 15 36 21 36 29 C36 34 39 38 41 41 C42 42 41 43 40 44 C37 46 32 50 32 56 C32 63 38 69 45 69 C48 69 51 68 53 66 C54 65 56 65 57 66 C59 68 62 69 65 69 C72 69 78 63 78 56 C78 50 73 46 70 44 C69 43 68 42 69 41 C71 38 74 34 74 29 C74 21 68 15 60 15 Z" opacity="0.1" />
                      <path d="M50 20 Q40 20 40 32 Q40 40 48 45 Q40 48 38 56 Q38 65 50 65 Q62 65 62 56 Q60 48 52 45 Q60 40 60 32 Q60 20 50 20 Z" stroke="#E5C158" strokeWidth="2.5" fill="none" />
                      {/* Ganesha Trunk */}
                      <path d="M50 42 Q50 56 42 56 Q37 56 40 50" stroke="#E5C158" strokeWidth="2.5" fill="none" />
                      {/* Tusks and Tikka */}
                      <circle cx="50" cy="30" r="1.5" fill="#E5C158" />
                      <line x1="48" y1="28" x2="52" y2="28" stroke="#E5C158" strokeWidth="1" />
                      <line x1="47" y1="26" x2="53" y2="26" stroke="#E5C158" strokeWidth="1" />
                    </svg>
                  </div>
                  <span className={`text-[10px] tracking-widest font-bold ${currentTheme.textSecondary} uppercase block`}>
                    {t.shreeGanesh}
                  </span>
                </div>

                {/* Section 2: Header Badge */}
                <div className="relative z-10 my-1">
                  <div className={`inline-block bg-gradient-to-r ${currentTheme.cardTitleBg} border-2 ${currentTheme.cardTitleBorder} px-6 py-1 rounded-full shadow-md`}>
                    <span className={`text-xs sm:text-sm tracking-widest block font-bold ${currentTheme.cardTitleText}`}>
                      {t.shubhVivah}
                    </span>
                  </div>
                </div>

                {/* Section 3: Parent Names & Invitation */}
                <div className="relative z-10 px-2 my-1">
                  <span className={`text-[9.5px] uppercase tracking-wider block font-bold text-gray-400 mb-1`}>
                    {cardLang === 'en' ? "With Best Compliments From:" : "परम आदरणीय अतिथी महोदय,"}
                  </span>
                  
                  {/* Dynamic Invitation text */}
                  <p className={`text-[10px] italic leading-relaxed text-gray-500 max-w-xs mx-auto`}>
                    {t.cordialInvite}
                  </p>
                </div>

                {/* Section 4: Bride & Groom Details (Vertical stacked with design) */}
                <div className="relative z-10 w-full px-2 my-1">
                  
                  {/* Groom block */}
                  <div className="flex flex-col items-center">
                    <span className={`text-[9.5px] font-bold ${currentTheme.textSecondary} tracking-widest uppercase`}>
                      {cardLang === 'en' ? "🤵 THE GROOM" : cardLang === 'mix' ? "वर / GROOM" : "॥ सुयोग्य वर ॥"}
                    </span>
                    <h3 className={`text-2xl font-bold tracking-wide mt-0.5 ${currentTheme.textPrimary}`} style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                      Rajesh Soni
                    </h3>
                    <span className="text-[8px] font-bold text-gray-400 tracking-wider">
                      {cardLang === 'en' ? "KASHYAP GOTRA" : "गोत्र - कश्यप (सुपुत्र श्री हनुमान सोनी)"}
                    </span>
                  </div>

                  {/* Knot of Union / Holy symbol */}
                  <div className="flex items-center justify-center gap-1.5 my-1.5">
                    <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
                    <span className="text-[#7A1221] text-xs">❤️</span>
                    <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
                  </div>

                  {/* Bride block */}
                  <div className="flex flex-col items-center">
                    <span className={`text-[9.5px] font-bold ${currentTheme.textSecondary} tracking-widest uppercase`}>
                      {cardLang === 'en' ? "👰 THE BRIDE" : cardLang === 'mix' ? "वधू / BRIDE" : "॥ सुशीला वधू ॥"}
                    </span>
                    <h3 className={`text-2xl font-bold tracking-wide mt-0.5 ${currentTheme.textPrimary}`} style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                      Anchal Soni
                    </h3>
                    <span className="text-[8px] font-bold text-gray-400 tracking-wider">
                      {cardLang === 'en' ? "BADAGARIYA GOTRA" : "गोत्र - बड़गरिया (सुपुत्री श्री मुन्ना सोनी)"}
                    </span>
                  </div>

                </div>

                {/* Section 5: Auspicious Marriage Mantra */}
                <div className={`relative z-10 w-full py-1.5 px-3 bg-[#7A1221]/5 border border-dashed ${currentTheme.borderGold}/50 rounded-xl my-1`}>
                  <p className={`text-[10px] leading-relaxed font-bold italic ${currentTheme.textPrimary}`}>
                    {t.marriageMantra}
                  </p>
                </div>

                {/* Section 6: Auspicious Muhurat / Date */}
                <div className="relative z-10 w-full my-1 border-t border-b border-royal-gold/20 py-2">
                  <div className="flex items-center justify-center gap-1 text-[#C95B00] text-[9px] uppercase tracking-wider font-bold mb-0.5">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    <span>{cardLang === 'en' ? "SAVE THE DATE" : "पावन मंगल तिथि"}</span>
                  </div>
                  <h4 className={`text-base font-extrabold tracking-wide uppercase ${currentTheme.textPrimary}`}>
                    {t.dateText}
                  </h4>
                  <p className={`text-[10px] font-bold mt-0.5 ${currentTheme.textSecondary}`}>
                    {t.muhuratText}
                  </p>
                </div>

                {/* Section 7: Venue details */}
                <div className="relative z-10 w-full px-2 my-1">
                  <span className={`text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-0.5`}>
                    {t.venueTitle}
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className={`w-3.5 h-3.5 ${currentTheme.textPrimary} shrink-0`} />
                    <span className={`text-xs font-bold ${currentTheme.textPrimary}`}>
                      {t.venueDetail}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-500 max-w-xs mx-auto leading-relaxed mt-0.5">
                    {t.venueAddress}
                  </p>
                </div>

                {/* Section 8: RSVP Footnote */}
                <div className="relative z-10 w-full mt-1 pt-1 border-t border-royal-gold/10 flex justify-between items-center text-[8.5px] text-gray-400 font-medium font-mono px-1">
                  <span>{t.inviteFrom}</span>
                  <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5 text-wedding-crimson fill-wedding-crimson" /> {t.bestWishes}</span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
