import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Sparkles, Shirt, Heart, Gift, Compass } from 'lucide-react';
import { WeddingEvent } from '../types';

interface EventTimelineProps {
  lang?: 'en' | 'hi' | 'mix';
}

const weddingEventsMix: WeddingEvent[] = [
  {
    id: 'haldi',
    name: 'शुभ हल्दी रस्म (Haldi Ceremony)',
    nameHindi: 'शुभ हल्दी',
    date: '21 फरवरी 2027 (Sun, 21-Feb)',
    time: 'सुबह 10:00 बजे से (10:00 AM onwards)',
    venue: 'सोनी निवास, अलवर (Soni Residence)',
    address: 'जैन पब्लिक स्कूल के पास, कमला कॉलोनी, देसुला, अलवर, राजस्थान / Near Jain Public School, Kamla Colony, Desoola, Alwar, Rajasthan',
    dressCode: 'Shades of Yellow & Saffron (पीला परिधान)',
    iconName: 'Sun',
    color: 'from-amber-400 to-yellow-500 text-yellow-950 border-yellow-300'
  },
  {
    id: 'wedding',
    name: 'शुभ विवाह संस्कार (Sacred Wedding)',
    nameHindi: 'शुभ विवाह',
    date: '22 फरवरी 2027 (Mon, 22-Feb)',
    time: 'पावन लग्न मुहूर्त अनुसार (Auspicious Muhurat)',
    venue: 'शहनाई मैरिज लॉन एवं रिसॉर्ट, गोरखपुर (Shehnai Lawn & Resort)',
    address: 'हाईवे क्रॉसिंग के पास, चौरी चौरा, गोरखपुर, उत्तर प्रदेश / Near Highway Crossing, Chauri Chaura, Gorakhpur, Uttar Pradesh',
    dressCode: 'Royal Traditional Red, Gold & Maroon (शाही लाल और सुनहरी)',
    iconName: 'Heart',
    color: 'from-wedding-crimson to-wedding-maroon text-white border-royal-gold'
  },
  {
    id: 'vidai',
    name: 'शुभ विदाई समारोह (Farewell Ceremony)',
    nameHindi: 'शुभ विदाई',
    date: '23 फरवरी 2027 (Tue, 23-Feb)',
    time: 'सुबह 09:00 AM से (09:00 AM onwards)',
    venue: 'शहनाई मैरिज लॉन एवं रिसॉर्ट, गोरखपुर (Shehnai Lawn & Resort)',
    address: 'चौरी चौरा, गोरखपुर, उत्तर प्रदेश / Chauri Chaura, Gorakhpur, Uttar Pradesh',
    dressCode: 'Sophisticated Traditional (पारंपरिक परिधान)',
    iconName: 'Compass',
    color: 'from-emerald-700 to-teal-800 text-teal-50 border-emerald-500'
  }
];

const weddingEventsEn: WeddingEvent[] = [
  {
    id: 'haldi',
    name: 'Haldi Ceremony',
    nameHindi: 'शुभ हल्दी',
    date: 'February 21, 2027 (Sunday)',
    time: '10:00 AM onwards',
    venue: 'Soni Residence, Alwar',
    address: 'Near Jain Public School, Kamla Colony, Desoola, Alwar, Rajasthan',
    dressCode: 'Shades of Yellow & Saffron (पीला परिधान)',
    iconName: 'Sun',
    color: 'from-amber-400 to-yellow-500 text-yellow-950 border-yellow-300'
  },
  {
    id: 'wedding',
    name: 'The Sacred Wedding (Shubh Vivah)',
    nameHindi: 'शुभ विवाह संस्कार',
    date: 'February 22, 2027 (Monday)',
    time: '11:00 AM onwards (Auspicious Muhurat)',
    venue: 'Shehnai Marriage Lawn & Resort, Gorakhpur',
    address: 'Near Highway Crossing, Chauri Chaura, Gorakhpur, Uttar Pradesh',
    dressCode: 'Royal Traditional Red, Gold & Maroon (शाही लाल और सुनहरी)',
    iconName: 'Heart',
    color: 'from-wedding-crimson to-wedding-maroon text-white border-royal-gold'
  },
  {
    id: 'vidai',
    name: 'Farewell Ceremony (Shubh Vidai)',
    nameHindi: 'शुभ विदाई',
    date: 'February 23, 2027 (Tuesday)',
    time: '09:00 AM onwards',
    venue: 'Shehnai Marriage Lawn & Resort, Gorakhpur',
    address: 'Chauri Chaura, Gorakhpur, Uttar Pradesh',
    dressCode: 'Formal Traditional (पारंपरिक वस्त्र)',
    iconName: 'Compass',
    color: 'from-emerald-700 to-teal-800 text-teal-50 border-emerald-500'
  }
];

const weddingEventsHi: WeddingEvent[] = [
  {
    id: 'haldi',
    name: 'शुभ हल्दी रस्म',
    nameHindi: 'शुभ हल्दी',
    date: '21 फरवरी 2027 (रविवार)',
    time: 'सुबह 10:00 बजे से निरंतर',
    venue: 'सोनी निवास, अलवर',
    address: 'जैन पब्लिक स्कूल के पास, कमला कॉलोनी, देसुला, अलवर, राजस्थान',
    dressCode: 'पीले और सुनहरे रंग के पारंपरिक वस्त्र',
    iconName: 'Sun',
    color: 'from-amber-400 to-yellow-500 text-yellow-950 border-yellow-300'
  },
  {
    id: 'wedding',
    name: 'शुभ पाणिग्रहण संस्कार (विवाह)',
    nameHindi: 'शुभ विवाह',
    date: '22 फरवरी 2027 (सोमवार)',
    time: 'पावन लग्न मुहूर्त अनुसार',
    venue: 'शहनाई मैरिज लॉन एवं रिसॉर्ट, गोरखपुर',
    address: 'हाईवे क्रॉसिंग के पास, चौरी चौरा, गोरखपुर, उत्तर प्रदेश',
    dressCode: 'शाही पारंपरिक लाल, सुनहरी और मरून वस्त्र',
    iconName: 'Heart',
    color: 'from-wedding-crimson to-wedding-maroon text-white border-royal-gold'
  },
  {
    id: 'vidai',
    name: 'शुभ विदाई समारोह',
    nameHindi: 'शुभ विदाई',
    date: '23 फरवरी 2027 (मंगलवार)',
    time: 'सुबह 09:00 बजे से',
    venue: 'शहनाई मैरिज लॉन एवं रिसॉर्ट, गोरखपुर',
    address: 'चौरी चौरा, गोरखपुर, उत्तर प्रदेश',
    dressCode: 'सोम्य एवं पारंपरिक परिधान',
    iconName: 'Compass',
    color: 'from-emerald-700 to-teal-800 text-teal-50 border-emerald-500'
  }
];

export default function EventTimeline({ lang = 'hi' }: EventTimelineProps) {
  const [activeEvent, setActiveEvent] = useState<string>('wedding');

  const events = lang === 'en' ? weddingEventsEn : lang === 'mix' ? weddingEventsMix : weddingEventsHi;
  const activeEvt = events.find(e => e.id === activeEvent) || events[1];

  return (
    <div className="py-8 px-2 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-saffron font-wedding-devanagari text-sm md:text-base tracking-widest block mb-1 font-bold">
          {lang === 'mix' 
            ? '॥ मंगल उत्सव कार्यक्रम (Ceremonies Schedule) ॥' 
            : lang === 'en' 
              ? '॥ Ceremonies Schedule ॥' 
              : '॥ मंगल उत्सव कार्यक्रम पत्रिका ॥'
          }
        </span>
        <h2 className="text-wedding-maroon font-wedding-display text-2xl md:text-3xl font-extrabold tracking-wide">
          {lang === 'mix' 
            ? 'उत्सव समय सारणी / Celebration Timeline' 
            : lang === 'en' 
              ? 'Celebration Timeline' 
              : 'उत्सव समय सारणी'
          }
        </h2>
        <p className="text-gray-500 font-wedding-serif text-xs md:text-sm mt-2 max-w-md mx-auto leading-relaxed px-4">
          {lang === 'mix' ? (
            <span className="block space-y-1">
              <span className="block font-wedding-devanagari text-wedding-maroon text-[13px] font-semibold leading-relaxed">
                वर-वधू को अपने स्नेह और मंगल आशीर्वाद से अनुगृहीत करने के लिए आप सभी सादर आमंत्रित हैं।
              </span>
              <span className="block text-[11px] text-gray-400 font-medium italic leading-normal">
                "We invite you to grace each ceremony with your love and blessings. Here is our schedule."
              </span>
            </span>
          ) : lang === 'en' ? (
            'We invite you to grace each ceremony with your love and blessings. Here is our schedule of wedding festivities.'
          ) : (
            'वर-वधू को अपने स्नेह और मंगल आशीर्वाद से अनुगृहीत करने के लिए आप सभी सादर आमंत्रित हैं। उत्सव का समय विवरण इस प्रकार है:'
          )}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-royal-gold to-transparent mx-auto mt-3" />
      </div>

      {/* Colorful Event Buttons for Selection */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
        {events.map((evt) => {
          const isActive = activeEvent === evt.id;
          return (
            <button
              key={evt.id}
              onClick={() => setActiveEvent(evt.id)}
              className={`px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold border transition-all duration-300 shadow-sm flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-wedding-maroon text-white border-royal-gold scale-105 shadow-md shadow-wedding-maroon/20'
                  : 'bg-white hover:bg-wedding-crimson hover:text-white text-wedding-maroon border-royal-gold/30 hover:border-royal-gold'
              }`}
            >
              <span className="font-wedding-devanagari text-[10px] opacity-85 font-bold">
                ❀ {evt.nameHindi}
              </span>
              {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-bright-gold" />}
            </button>
          );
        })}
      </div>

      {/* Detailed Selected Event Detail Panel */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEvt.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`bg-gradient-to-br ${activeEvt.color} rounded-2xl p-5 md:p-8 border-2 shadow-2xl relative overflow-hidden`}
          >
            {/* Traditional Background Mandala watermark */}
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10 pointer-events-none w-80 h-80">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M50,10 A40,40 0 0,0 90,50 A40,40 0 0,0 50,90 A40,40 0 0,0 10,50 A40,40 0 0,0 50,10" />
              </svg>
            </div>

            {/* Event header with Devanagari */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-4 mb-6">
              <div>
                <span className="text-bright-gold font-wedding-devanagari text-base md:text-lg tracking-wide block mb-1">
                  🌺 {activeEvt.nameHindi} 🌺
                </span>
                <h3 className="text-xl md:text-2xl font-wedding-display font-bold tracking-wide text-white">
                  {activeEvt.name}
                </h3>
              </div>
              
              {/* Decorative tag */}
              <div className="self-start md:self-auto bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[10px] md:text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-white">
                <Sparkles className="w-3.5 h-3.5 text-bright-gold" />
                {lang === 'mix' ? 'पावन उत्सव (Auspicious Ceremony)' : lang === 'en' ? 'Auspicious Ceremony' : 'मंगल पावन बेला'}
              </div>
            </div>

            {/* Event key details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-white">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/10 rounded-lg shrink-0 mt-0.5">
                    <Calendar className="w-5 h-5 text-bright-gold" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-75 block">{lang === 'en' ? 'Date' : lang === 'mix' ? 'दिनांक (Date)' : 'दिनांक (Date)'}</span>
                    <span className="text-base md:text-lg font-bold font-wedding-serif">{activeEvt.date}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/10 rounded-lg shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-bright-gold" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-75 block">{lang === 'en' ? 'Auspicious Time' : lang === 'mix' ? 'शुभ मुहूर्त (Time)' : 'शुभ मुहूर्त (Time)'}</span>
                    <span className="text-base md:text-lg font-bold font-wedding-serif">{activeEvt.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/10 rounded-lg shrink-0 mt-0.5">
                    <Shirt className="w-5 h-5 text-bright-gold" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-75 block">{lang === 'en' ? 'Dress Code' : lang === 'mix' ? 'परिधान निर्देश (Dress Code)' : 'परिधान निर्देश (Dress Code)'}</span>
                    <span className="text-sm md:text-base font-semibold text-bright-gold">{activeEvt.dressCode}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:border-l md:border-white/10 md:pl-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-white/10 rounded-lg shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-bright-gold" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-75 block">{lang === 'en' ? 'Sacred Venue' : lang === 'mix' ? 'कार्यक्रम स्थान (Venue)' : 'कार्यक्रम स्थान (Venue)'}</span>
                    <span className="text-base md:text-lg font-extrabold block">{activeEvt.venue}</span>
                    <p className="text-xs md:text-sm opacity-85 mt-1 leading-relaxed">{activeEvt.address}</p>
                  </div>
                </div>

                {/* Navigation assistance */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeEvt.venue + ', ' + activeEvt.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-wedding-maroon hover:bg-bright-gold hover:text-wedding-maroon px-4 py-2 rounded-lg text-xs font-bold transition-colors duration-300 shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {lang === 'mix' ? 'गूगल मैप्स पर मार्ग देखें (Google Maps)' : lang === 'en' ? 'Navigate on Google Maps' : 'गूगल मैप्स पर मार्ग देखें'}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Traditional Border Footnote */}
      <div className="mt-8 text-center p-5 bg-wedding-maroon/5 border border-royal-gold/20 rounded-2xl max-w-2xl mx-auto flex flex-col items-center gap-2">
        <span className="text-royal-gold text-xs font-bold tracking-wider font-wedding-devanagari uppercase">
          {lang === 'mix' 
            ? '॥ शुभ मंगल विवाह (Shubh Vivah) ॥' 
            : lang === 'en' 
              ? '॥ Shubh Mangal Vivah ॥' 
              : '॥ मांगलिक कार्यक्रम आमंत्रण ॥'
          }
        </span>
        <p className="text-wedding-maroon font-wedding-serif text-sm md:text-base italic font-semibold leading-relaxed px-2">
          {lang === 'mix' ? (
            <span className="block space-y-2">
              <span className="block font-wedding-devanagari text-wedding-maroon font-bold leading-relaxed">
                "वर-वधू के पावन परिणय सूत्र के शुभ अवसर पर आपकी गरिमामयी उपस्थिति एवं पावन स्नेह-आशीर्वाद सादर प्रार्थनीय है।"
              </span>
              <span className="block text-xs text-gray-500 font-medium italic leading-normal">
                "Your esteemed presence and heartwarming blessings at the sacred matrimony of our children are cordially requested."
              </span>
            </span>
          ) : lang === 'en' ? (
            '"Your esteemed presence and heartwarming blessings at the sacred matrimony of our children are cordially requested."'
          ) : (
            '"वर-वधू के पावन परिणय सूत्र के शुभ अवसर पर आपकी गरिमामयी उपस्थिति एवं पावन स्नेह-आशीर्वाद सादर प्रार्थनीय है।"'
          )}
        </p>
        <p className="text-gray-400 font-wedding-serif text-[10px] md:text-xs font-medium">
          {lang === 'mix' ? (
            '॥ सोनी परिवार की ओर से गरिमामयी आमंत्रण (Personal invitation from Soni Families) ॥'
          ) : lang === 'en' ? (
            '(Please treat this website invitation as personal invitation from Soni Families.)'
          ) : (
            '(इसे सोनी परिवार की ओर से व्यक्तिगत आमंत्रण पत्र स्वीकार करें।)'
          )}
        </p>
      </div>
    </div>
  );
}
