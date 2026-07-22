import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader, User, PhoneCall, Users, Heart, Sparkles, X } from 'lucide-react';
import { RSVP } from '../types';
import { submitRsvpToSheets } from '../googleSheets';

interface RsvpFormProps {
  lang?: 'en' | 'hi' | 'mix';
}

const ceremonyOptionsEn = [
  { id: 'Haldi', label: 'Shubh Haldi (February 21, 2027)' },
  { id: 'Wedding', label: 'Shubh Vivah (February 22, 2027)' },
  { id: 'Vidai', label: 'Shubh Vidai (February 23, 2027)' },
];

const ceremonyOptionsMix = [
  { id: 'Haldi', label: 'शुभ हल्दी (Haldi Ceremony - Feb 21)' },
  { id: 'Wedding', label: 'शुभ विवाह (Sacred Wedding - Feb 22)' },
  { id: 'Vidai', label: 'शुभ विदाई (Farewell Ceremony - Feb 23)' },
];

const ceremonyOptionsHi = [
  { id: 'Haldi', label: 'शुभ हल्दी (21 फरवरी 2027)' },
  { id: 'Wedding', label: 'शुभ विवाह (22 फरवरी 2027)' },
  { id: 'Vidai', label: 'शुभ विदाई (23 फरवरी 2027)' },
];

// Beautiful rotating Golden Mandala component
const GoldenMandala = ({ className = '', duration = 25 }) => (
  <motion.svg
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration, ease: "linear" }}
    className={`text-bright-gold/15 pointer-events-none select-none ${className}`}
    viewBox="0 0 100 100"
    fill="currentColor"
  >
    {/* Inner circle */}
    <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
    {/* Lotus petals */}
    {[...Array(12)].map((_, i) => (
      <path
        key={i}
        d="M50 35 C47 42, 47 48, 50 50 C53 48, 53 42, 50 35"
        transform={`rotate(${i * 30} 50 50)`}
      />
    ))}
    {/* Outer circle */}
    <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" />
    {/* Outer pointy elements */}
    {[...Array(24)].map((_, i) => (
      <path
        key={i}
        d="M50 15 L48 20 L52 20 Z"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.25" />
  </motion.svg>
);

// Floating Auspicious Marigold/Flower particles
const ShubhParticle = ({ delay = 0, xOffset = 0 }) => (
  <motion.div
    initial={{ y: '110vh', x: `${xOffset}vw`, opacity: 0, scale: 0.4, rotate: 0 }}
    animate={{ 
      y: '-10vh', 
      opacity: [0, 0.7, 0.7, 0], 
      scale: [0.4, 0.9, 0.9, 0.5],
      rotate: 360,
      x: [`${xOffset}vw`, `${xOffset + 4}vw`, `${xOffset - 4}vw`]
    }}
    transition={{ 
      repeat: Infinity, 
      duration: 7 + Math.random() * 5, 
      delay, 
      ease: "easeInOut" 
    }}
    className="absolute pointer-events-none text-marigold-yellow/30 text-lg select-none"
  >
    ❀
  </motion.div>
);

export default function RsvpForm({ lang = 'hi' }: RsvpFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneOrEmail: '',
    attendingEvents: [] as string[],
    guestsCount: 1,
    foodPreference: 'veg' as 'veg' | 'non-veg' | 'jain',
    specialMessage: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; guestsCount?: string }>({});

  const ceremonyOptions = lang === 'en' ? ceremonyOptionsEn : lang === 'mix' ? ceremonyOptionsMix : ceremonyOptionsHi;

  const toggleEvent = (eventId: string) => {
    setFormData((prev) => {
      const attending = prev.attendingEvents.includes(eventId)
        ? prev.attendingEvents.filter((id) => id !== eventId)
        : [...prev.attendingEvents, eventId];
      return { ...prev, attendingEvents: attending };
    });
  };

  const validateForm = () => {
    const errors: { fullName?: string; guestsCount?: string } = {};

    // 1. Full Name Validation
    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      errors.fullName = lang === 'en' 
        ? 'Please provide your auspicious name.' 
        : lang === 'mix' 
          ? 'कृपया अपना शुभ नाम दर्ज करें (Please enter your name)' 
          : 'कृपया अपना शुभ नाम दर्ज करें।';
    } else if (trimmedName.length < 3) {
      errors.fullName = lang === 'en'
        ? 'Your auspicious name should be at least 3 characters long.'
        : lang === 'mix'
          ? 'आपका शुभ नाम कम से कम 3 अक्षरों का होना चाहिए (Name must be at least 3 chars)'
          : 'आपका शुभ नाम कम से कम 3 अक्षरों का होना चाहिए।';
    } else if (/^[0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/|\\~`]+$/.test(trimmedName)) {
      errors.fullName = lang === 'en'
        ? 'Please enter a valid name (letters and spaces only).'
        : lang === 'mix'
          ? 'कृपया एक सही नाम दर्ज करें (Letters only)'
          : 'कृपया एक सही नाम दर्ज करें (अक्षरों का प्रयोग करें)।';
    }

    // 2. Guests Count Validation
    const count = Number(formData.guestsCount);
    if (isNaN(count) || count < 1) {
      errors.guestsCount = lang === 'en'
        ? 'Total guests must be at least 1.'
        : lang === 'mix'
          ? 'अतिथियों की संख्या कम से कम 1 होनी चाहिए (Guests must be at least 1)'
          : 'अतिथियों की संख्या कम से कम 1 होनी चाहिए।';
    } else if (count > 15) {
      errors.guestsCount = lang === 'en'
        ? 'Maximum allowed guests is 15.'
        : lang === 'mix'
          ? 'अतिथियों की अधिकतम सीमा 15 है (Max 15 guests)'
          : 'अतिथियों की अधिकतम संख्या 15 ही हो सकती है।';
    } else if (!Number.isInteger(count)) {
      errors.guestsCount = lang === 'en'
        ? 'Guests count must be a whole number.'
        : lang === 'mix'
          ? 'संख्या एक पूर्णांक होनी चाहिए (Must be a whole number)'
          : 'अतिथियों की संख्या पूर्णांक होनी चाहिए।';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNameChange = (val: string) => {
    setFormData(prev => ({ ...prev, fullName: val }));
    if (fieldErrors.fullName) {
      setFieldErrors(prev => ({ ...prev, fullName: undefined }));
    }
  };

  const handleGuestsChange = (val: string) => {
    // Keep it as a raw string or empty while typing so users can backspace easily,
    // but validate and parse it correctly.
    const num = val === '' ? '' : Number(val);
    setFormData(prev => ({ ...prev, guestsCount: num as any }));
    if (fieldErrors.guestsCount) {
      setFieldErrors(prev => ({ ...prev, guestsCount: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields first
    const isValid = validateForm();
    if (!isValid) {
      setError(
        lang === 'en' 
          ? 'Please correct the highlighted validation errors.' 
          : lang === 'mix'
            ? 'कृपया नीचे दिए गए त्रुटि संदेशों को सुधारें (Please fix the errors below)'
            : 'कृपया नीचे दिए गए लाल रंग के त्रुटि संदेशों को सुधारें।'
      );
      return;
    }

    if (formData.attendingEvents.length === 0) {
      setError(
        lang === 'en' 
          ? 'Please select at least one ceremony you will bless with your presence.' 
          : lang === 'mix'
            ? 'कृपया कम से कम एक समारोह चुनें जिसमें आप सम्मिलित होंगे (Please select a ceremony)'
            : 'कृपया कम से कम एक समारोह चुनें जिसमें आप सम्मिलित होंगे।'
      );
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const rsvpData: RSVP = {
        fullName: formData.fullName,
        phoneOrEmail: formData.phoneOrEmail,
        attendingEvents: formData.attendingEvents,
        guestsCount: Number(formData.guestsCount),
        foodPreference: formData.foodPreference,
        specialMessage: formData.specialMessage,
        submittedAt: new Date(),
      };

      await submitRsvpToSheets(rsvpData);

      setSuccess(true);
    } catch (err: any) {
      console.error('Error saving RSVP to Sheets:', err);
      setError(lang === 'en' ? 'A minor obstacle occurred. Please try again.' : lang === 'mix' ? 'त्रुटि हुई। कृपया पुनः प्रयास करें (Error. Please retry)' : 'त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 45, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="py-8 px-2 max-w-xl mx-auto relative z-10">
      {/* 1. Persistent Royal Card with "RSVP Now" Call to Action */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="bg-white/90 backdrop-blur-md border-4 border-royal-gold rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-center group hover:border-saffron transition-colors duration-500"
      >
        {/* Decorative marigold flowers hanging design */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-marigold-orange via-marigold-yellow to-marigold-orange" />
        <div className="absolute top-3 inset-x-0 flex justify-around pointer-events-none text-marigold-orange opacity-60">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-1 h-3 bg-marigold-orange/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-marigold-yellow border border-marigold-orange" />
            </div>
          ))}
        </div>

        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-wedding-crimson w-28 h-28">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full animate-slow-spin">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
            <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <motion.span variants={itemVariants} className="text-saffron font-wedding-devanagari text-base md:text-lg tracking-widest block mb-2 font-bold animate-pulse">
          {lang === 'mix' ? '॥ उपस्थिति सूचना / RSVP ॥' : lang === 'en' ? '॥ RSVP NOW ॥' : '॥ उपस्थिति सूचना ॥'}
        </motion.span>
        
        <motion.h3 variants={itemVariants} className="text-wedding-maroon font-wedding-display text-2xl md:text-3xl font-extrabold tracking-wide">
          {lang === 'mix' ? 'क्या आप पधार रहे हैं?' : lang === 'en' ? 'Are You Joining Us?' : 'क्या आप पधार रहे हैं?'}
        </motion.h3>
        
        <motion.p variants={itemVariants} className="text-royal-gold font-wedding-script text-2xl mt-1.5 font-semibold">
          {lang === 'mix' ? 'हम आपके आगमन की प्रतीक्षा कर रहे हैं' : lang === 'en' ? 'We request your auspicious presence' : 'हम आपके आगमन की प्रतीक्षा कर रहे हैं'}
        </motion.p>

        <motion.div variants={itemVariants} className="text-gray-500 font-wedding-serif text-xs md:text-sm mt-3.5 leading-relaxed px-4 max-w-md mx-auto space-y-1">
          {lang === 'mix' ? (
            <>
              <p className="font-wedding-devanagari font-bold text-wedding-maroon text-[13px]">
                हमारे पावन विवाह उत्सव में सम्मिलित होने के लिए और स्वागत सत्कार की समुचित व्यवस्था हेतु कृपया अपनी उपस्थिति दर्ज कराएं।
              </p>
              <p className="text-[11px] text-gray-400 font-semibold italic">
                "Kindly confirm your presence by February 10, 2027 to help us coordinate the royal feast."
              </p>
            </>
          ) : lang === 'en' ? (
            <p className="font-medium">Kindly confirm your presence by February 10, 2027 to help us coordinate the grand royal arrangements and hospitality.</p>
          ) : (
            <p className="font-wedding-devanagari font-bold text-wedding-maroon text-[13px]">
              हमारे पावन विवाह उत्सव में सम्मिलित होने के लिए और स्वागत सत्कार की समुचित व्यवस्था हेतु कृपया अपनी उपस्थिति दर्ज कराएं।
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="w-16 h-0.5 bg-royal-gold/50 mx-auto my-5" />

        {/* Elegant pulsing CTA Button to open Modal */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(122,18,33,0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setFieldErrors({});
            setError(null);
            setIsModalOpen(true);
          }}
          className="px-8 py-4 bg-gradient-to-r from-wedding-crimson via-wedding-maroon to-wedding-crimson hover:from-wedding-maroon hover:to-wedding-crimson text-bright-gold font-bold font-wedding-display text-xs md:text-sm uppercase tracking-widest rounded-full border-2 border-royal-gold shadow-lg cursor-pointer flex items-center justify-center gap-2.5 mx-auto relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          <Sparkles className="w-4.5 h-4.5 text-bright-gold animate-pulse shrink-0" />
          <span>
            {lang === 'mix' ? 'उपस्थिति दर्ज करें (RSVP Now)' : lang === 'en' ? 'RSVP Now' : 'उपस्थिति दर्ज करें (RSVP)'}
          </span>
          <Sparkles className="w-4.5 h-4.5 text-bright-gold animate-pulse shrink-0" />
        </motion.button>
      </motion.div>

      {/* 2. CENTERED MODAL OVERLAY WITH "SHUBH" BACKGROUND ANIMATION */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-wedding-maroon/90 backdrop-blur-xl"
            onClick={handleBackdropClick}
          >
            {/* Shubh Decorative Background Animation Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
              
              {/* Spinning Golden Mandalas (Colorful & Festive) */}
              <GoldenMandala className="absolute -left-16 -top-16 w-80 h-80 opacity-20" duration={30} />
              <GoldenMandala className="absolute -right-16 -bottom-16 w-96 h-96 opacity-20" duration={40} />
              <GoldenMandala className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] opacity-[0.08]" duration={70} />

              {/* Auspicious Calligraphy elements pulsating and glowing in the background */}
              <motion.div 
                animate={{ opacity: [0.12, 0.28, 0.12], scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute top-16 left-12 md:left-28 text-bright-gold/15 font-wedding-devanagari text-6xl md:text-8xl font-black"
              >
                शुभ
              </motion.div>
              
              <motion.div 
                animate={{ opacity: [0.12, 0.28, 0.12], scale: [1.05, 0.95, 1.05] }}
                transition={{ repeat: Infinity, duration: 8, delay: 4, ease: "easeInOut" }}
                className="absolute bottom-16 right-12 md:right-28 text-bright-gold/15 font-wedding-devanagari text-6xl md:text-8xl font-black"
              >
                लाभ
              </motion.div>
              
              <motion.div 
                animate={{ opacity: [0.06, 0.18, 0.06] }}
                transition={{ repeat: Infinity, duration: 10, delay: 2, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 text-bright-gold/10 font-wedding-devanagari text-5xl md:text-7xl font-bold"
              >
                विवाह
              </motion.div>
              
              <motion.div 
                animate={{ opacity: [0.06, 0.18, 0.06] }}
                transition={{ repeat: Infinity, duration: 10, delay: 7, ease: "easeInOut" }}
                className="absolute bottom-1/4 left-1/4 text-bright-gold/10 font-wedding-devanagari text-5xl md:text-7xl font-bold"
              >
                मंगलम
              </motion.div>

              {/* Glowing Warm Color Ambiance Rays */}
              <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-saffron/15 blur-[80px]" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-marigold-yellow/15 blur-[100px]" />

              {/* Soft floating traditional particles (Marigold petals) */}
              <ShubhParticle delay={0} xOffset={8} />
              <ShubhParticle delay={2} xOffset={25} />
              <ShubhParticle delay={4} xOffset={48} />
              <ShubhParticle delay={1} xOffset={72} />
              <ShubhParticle delay={3} xOffset={90} />

              {/* Royal sparkle stars */}
              <motion.div 
                animate={{ opacity: [0, 0.8, 0], scale: [0.6, 1.3, 0.6], y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 0.8 }}
                className="absolute top-1/6 right-1/3 text-bright-gold/40 text-xl"
              >
                ✦
              </motion.div>
              <motion.div 
                animate={{ opacity: [0, 0.8, 0], scale: [0.6, 1.3, 0.6], y: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 4.2, delay: 2.3 }}
                className="absolute bottom-1/6 left-1/3 text-bright-gold/40 text-xl"
              >
                ✦
              </motion.div>
            </div>

            {/* Centered Modal Content Card */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-xl bg-white border-4 border-royal-gold rounded-3xl p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 my-8 overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Traditional hanging marigold flowers garland detail at top of card */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-marigold-orange via-marigold-yellow to-marigold-orange" />
              <div className="absolute top-3 inset-x-0 flex justify-around pointer-events-none text-marigold-orange opacity-60">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-1 h-3 bg-marigold-orange/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-marigold-yellow border border-marigold-orange" />
                  </div>
                ))}
              </div>

              {/* Close Button at top-right */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-wedding-maroon text-bright-gold border border-royal-gold flex items-center justify-center cursor-pointer shadow-md hover:bg-wedding-crimson transition-colors duration-200"
                aria-label="Close RSVP Form"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </motion.button>

              {/* Scrollable Form Area */}
              <div className="overflow-y-auto pr-1 md:pr-2 custom-scrollbar flex-1 pt-6 pb-2">
                
                <div className="text-center mb-6">
                  <span className="text-saffron font-wedding-devanagari text-base tracking-widest block mb-1 font-bold">
                    {lang === 'mix' ? '॥ आर एस वी पी / उपस्थिति सूचना ॥' : lang === 'en' ? 'आर एस वी पी' : '॥ आमंत्रण उत्तर ॥'}
                  </span>
                  <h3 className="text-wedding-maroon font-wedding-display text-2xl md:text-3xl font-extrabold tracking-wide">
                    {lang === 'mix' ? 'उपस्थिति स्वीकृति / RSVP Response' : lang === 'en' ? 'Response & RSVP' : 'उपस्थिति स्वीकृति (RSVP)'}
                  </h3>
                  <p className="text-gray-500 font-wedding-serif text-xs md:text-sm mt-1.5 leading-relaxed px-4">
                    {lang === 'mix' ? (
                      <span className="block space-y-1">
                        <span className="block font-wedding-devanagari text-wedding-maroon text-[13px] font-semibold leading-relaxed">
                          भोजन एवं सत्कार व्यवस्था की सुगमता हेतु कृपया 10 फरवरी 2027 से पहले अपनी स्वीकृति दर्ज करें।
                        </span>
                        <span className="block text-[11px] text-gray-400 font-medium italic leading-normal">
                          "Please respond before February 10, 2027 so we may arrange the feast."
                        </span>
                      </span>
                    ) : lang === 'en' ? (
                      'Please respond before February 10, 2027 so we may arrange the feast.'
                    ) : (
                      'भोजन एवं सत्कार व्यवस्था की सुगमता हेतु कृपया 10 फरवरी 2027 से पहले अपनी स्वीकृति दर्ज करें।'
                    )}
                  </p>
                  <div className="w-16 h-0.5 bg-royal-gold/50 mx-auto mt-3" />
                </div>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6 px-4"
                  >
                    <div className="w-14 h-14 bg-wedding-maroon text-bright-gold rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-royal-gold shadow-lg animate-bounce">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>
                    <h4 className="text-wedding-maroon font-wedding-display text-lg md:text-xl font-bold">
                      {lang === 'mix' ? 'धन्यवाद! (Thank You!)' : lang === 'en' ? 'Thank You!' : 'धन्यवाद! सादर धन्यवाद!'}
                    </h4>
                    <p className="text-gray-600 font-wedding-serif text-xs md:text-sm mt-3 leading-relaxed px-2">
                      {lang === 'mix' ? (
                        <span className="block space-y-2">
                          <span className="block font-wedding-devanagari text-wedding-maroon font-bold">
                            "आपकी उपस्थिति स्वीकृति सफलतापूर्वक दर्ज कर ली गई है। हम आदर के साथ मांगलिक उत्सव में आपका स्वागत करने के लिए उत्सुक हैं!"
                          </span>
                          <span className="block text-xs text-gray-500 font-medium italic">
                            "Your respectful RSVP has been securely registered. We are eagerly looking forward to welcoming you with a warm heart!"
                          </span>
                        </span>
                      ) : lang === 'en' ? (
                        'Your respectful RSVP has been securely registered. We are eagerly looking forward to welcoming you to the royal celebrations with a warm heart!'
                      ) : (
                        'आपकी उपस्थिति स्वीकृति सफलतापूर्वक दर्ज कर ली गई है। हम अत्यंत हर्ष और आदर के साथ मांगलिक उत्सव में आपका स्वागत करने के लिए उत्सुक हैं!'
                      )}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsModalOpen(false)}
                      className="mt-6 px-6 py-2.5 bg-gradient-to-r from-wedding-crimson to-wedding-maroon text-white font-bold rounded-full text-xs uppercase tracking-wider border border-royal-gold shadow-md cursor-pointer"
                    >
                      {lang === 'en' ? 'Close Window' : 'खिड़की बंद करें'}
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium text-center">
                        {error}
                      </div>
                    )}

                    {/* Guest Name */}
                    <div>
                      <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-royal-gold" />
                        {lang === 'en' ? 'Auspicious Name *' : lang === 'mix' ? 'आपका शुभ नाम (Auspicious Name) *' : 'आपका शुभ नाम (Name) *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'en' ? 'Enter your full name' : lang === 'mix' ? 'अपना शुभ नाम दर्ज करें (Enter full name)' : 'अपना शुभ नाम दर्ज करें'}
                        value={formData.fullName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none text-xs md:text-sm transition-all duration-200 ${
                          fieldErrors.fullName 
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                            : 'border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20'
                        }`}
                      />
                      <AnimatePresence>
                        {fieldErrors.fullName && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-red-600 text-[11px] font-semibold mt-1"
                          >
                            {fieldErrors.fullName}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5 text-royal-gold" />
                        {lang === 'en' ? 'Phone Number / Email *' : lang === 'mix' ? 'मोबाइल नंबर / ईमेल (Contact) *' : 'मोबाइल नंबर / ईमेल (Contact) *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'en' ? 'Enter phone number or email' : lang === 'mix' ? 'मोबाइल नंबर अथवा ईमेल दर्ज करें (Enter phone/email)' : 'मोबाइल नंबर अथवा ईमेल दर्ज करें'}
                        value={formData.phoneOrEmail}
                        onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20 outline-none text-xs md:text-sm transition-all duration-200"
                      />
                    </div>

                    {/* Attending Events */}
                    <div>
                      <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-royal-gold" />
                        {lang === 'en' ? 'Select Ceremonies to Attend *' : lang === 'mix' ? 'सम्मिलित होने वाले समारोह (Ceremonies) *' : 'सम्मिलित होने वाले समारोह *'}
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {ceremonyOptions.map((option) => {
                          const isChecked = formData.attendingEvents.includes(option.id);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleEvent(option.id)}
                              className={`px-3 py-2.5 rounded-xl text-xs font-bold border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                                isChecked
                                  ? 'bg-wedding-maroon text-white border-royal-gold'
                                  : 'bg-gray-50 text-wedding-maroon border-gray-200 hover:bg-temple-cream'
                              }`}
                            >
                              <span>{option.label}</span>
                              {isChecked ? (
                                <div className="w-4 h-4 rounded-full bg-bright-gold text-wedding-maroon flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Guests Count & Food preference */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-royal-gold" />
                          {lang === 'en' ? 'Total Guests attending *' : lang === 'mix' ? 'कुल सदस्य संख्या (Total Guests) *' : 'कुल सदस्य संख्या *'}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="15"
                          required
                          value={formData.guestsCount}
                          onChange={(e) => handleGuestsChange(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none text-xs md:text-sm transition-all duration-200 ${
                            fieldErrors.guestsCount 
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                              : 'border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20'
                          }`}
                        />
                        <AnimatePresence>
                          {fieldErrors.guestsCount && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-red-600 text-[11px] font-semibold mt-1"
                            >
                              {fieldErrors.guestsCount}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-royal-gold" />
                          {lang === 'en' ? 'Feast Preference *' : lang === 'mix' ? 'भोजन वरीयता (Feast Preference) *' : 'भोजन व्यवस्था वरीयता *'}
                        </label>
                        <select
                          value={formData.foodPreference}
                          onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value as any })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20 outline-none text-xs md:text-sm transition-all duration-200 bg-white"
                        >
                          <option value="veg">{lang === 'en' ? 'Pure Vegetarian' : lang === 'mix' ? 'शुद्ध शाकाहारी (Pure Veg)' : 'शुद्ध शाकाहारी (Veg)'}</option>
                          <option value="jain">{lang === 'en' ? 'Jain Feast' : lang === 'mix' ? 'जैन भोजन (Jain Feast)' : 'जैन भोजन (Jain)'}</option>
                          <option value="non-veg">{lang === 'en' ? 'Non-Vegetarian' : lang === 'mix' ? 'सामान्य भोजन (Standard Feast)' : 'सामान्य (Non-Veg)'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Special Message */}
                    <div className="mt-4">
                      <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Blessing / Dietary Notes' : lang === 'mix' ? 'दंपत्ति को शुभकामनाएं / विशिष्ट निर्देश (Blessings / Notes)' : 'दंपत्ति को शुभकामनाएं / विशिष्ट निर्देश'}
                      </label>
                      <textarea
                        rows={2}
                        placeholder={lang === 'en' ? 'Write a loving note for the couple...' : lang === 'mix' ? 'नव-दंपत्ति के लिए संदेश लिखें... (Write a loving note...)' : 'नव-दंपत्ति के लिए अपना स्नेहपूर्ण संदेश लिखें...'}
                        value={formData.specialMessage}
                        onChange={(e) => setFormData({ ...formData, specialMessage: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20 outline-none text-xs md:text-sm transition-all duration-200"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 bg-gradient-to-r from-wedding-crimson to-wedding-maroon hover:from-wedding-maroon hover:to-wedding-maroon text-white py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 border border-royal-gold shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin text-bright-gold" />
                          {lang === 'en' ? 'Submitting RSVP...' : lang === 'mix' ? 'स्वीकृति भेजी जा रही है (Submitting RSVP)...' : 'स्वीकृति दर्ज की जा रही है...'}
                        </>
                      ) : (
                        lang === 'en' ? 'Accept Invitation (RSVP)' : lang === 'mix' ? 'आमंत्रण स्वीकारें (Accept RSVP)' : 'आमंत्रण स्वीकारें (दर्ज करें)'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
