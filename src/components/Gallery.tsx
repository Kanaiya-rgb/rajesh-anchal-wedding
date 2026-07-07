import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Camera, Upload, Trash2, Heart, Sparkles, RefreshCw, X, Maximize2 } from 'lucide-react';

interface GalleryProps {
  lang: 'en' | 'hi' | 'mix';
}

interface GalleryItem {
  id: string;
  url: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'sagai-1',
    url: '/sagai/DSC_7010.JPG.jpeg',
    titleEn: 'Groom’s Father',
    titleHi: 'वर के पूजनीय पिताजी',
    descEn: 'Mr. Hanuman Soni showering his loving blessings during the auspicious ceremony.',
    descHi: 'वर के पूजनीय पिताजी श्री हनुमान जी सोनी सगाई उत्सव के मांगलिक अवसर पर अपना स्नेहिल आशीर्वाद प्रदान करते हुए।'
  },
  {
    id: 'sagai-3',
    url: '/sagai/DSC_7025.JPG.jpeg',
    titleEn: 'Moments of Joy',
    titleHi: 'मुस्कुराते पल',
    descEn: 'Celebrating the first of many beautiful chapters of our love story.',
    descHi: 'खुशियों का आगमन - हमारे सुंदर और सुखद वैवाहिक जीवन की सुनहरी यादें।'
  },
  {
    id: 'sagai-4',
    url: '/sagai/DSC_7029.JPG.jpeg',
    titleEn: 'Sweet Traditions',
    titleHi: 'मंगनी की रस्में',
    descEn: 'Authentic moments captured during the sweet traditional engagement ceremony.',
    descHi: 'पारंपरिक मांगलिक रीति-रिवाज - दो दिलों के पावन बंधन की मधुर झलकियां।'
  },
  {
    id: 'sagai-5',
    url: '/sagai/DSC_7034.JPG.jpeg',
    titleEn: 'Beautiful Smiles',
    titleHi: 'स्नेह और उमंग',
    descEn: 'The beginning of our forever, framed with smiles and joy.',
    descHi: 'अमृतमयी मुस्कान - जीवनसाथी के रूप में एक-दूसरे को स्वीकारने की खुशी।'
  },
  {
    id: 'sagai-6',
    url: '/sagai/DSC_7037.JPG.jpeg',
    titleEn: 'Royal Engagement',
    titleHi: 'शाही सगाई समारोह',
    descEn: 'A golden milestone on our path to the grand wedding day.',
    descHi: 'एक खूबसूरत शुरुआत - विवाह के पावन पथ पर सगाई की अमूल्य स्मृतियां।'
  },
  {
    id: 'sagai-7',
    url: '/sagai/DSC_7040.JPG.jpeg',
    titleEn: 'Groom & Bride Happiness',
    titleHi: 'वर-वधू का पावन मिलन',
    descEn: 'Dressed in absolute elegance, radiating love and modern style.',
    descHi: 'पारंपरिक परिधानों में सजे - खुशियों और सपनों से ओतप्रोत हमारा विशेष दिन।'
  },
  {
    id: 'sagai-8',
    url: '/sagai/DSC_7042.JPG.jpeg',
    titleEn: 'Sacred Rituals',
    titleHi: 'मंगल पूजा एवं शगुन',
    descEn: 'Commencing the celebration with traditional prayers for a blessed life ahead.',
    descHi: 'मांगलिक पूजा अर्चना - सुख, शांति और सौभाग्य के लिए बड़ों का आशीर्वाद।'
  },
  {
    id: 'sagai-9',
    url: '/sagai/DSC_7047.JPG.jpeg',
    titleEn: 'Treasured Family Moments',
    titleHi: 'पारिवारिक उल्लास',
    descEn: 'A magical day when family became one, sharing laughter and love.',
    descHi: 'पारिवारिक उत्सव - प्रियजनों के प्यार, हंसी और स्नेह से सजी मंगनी की सुंदर शाम।'
  },
  {
    id: 'sagai-10',
    url: '/sagai/DSC_7051.JPG.jpeg',
    titleEn: 'Love & Warmth',
    titleHi: 'प्रेम और आदर',
    descEn: 'The quiet, beautiful promise of a life together, full of care.',
    descHi: 'एक सुंदर विश्वास - एक-दूसरे के सम्मान और जीवन भर साथ निभाने का संकल्प।'
  },
  {
    id: 'sagai-12',
    url: '/sagai/20260616_185857.jpg.jpeg',
    titleEn: 'Sacred Rings Exchange',
    titleHi: 'शुभ सगाई एवं अंगूठी रस्म',
    descEn: 'Exchanging rings of love, beginning our beautiful journey of together-forever.',
    descHi: 'अंगूठी रस्म - एक दूसरे का हाथ थामकर जीवन के नए सफर की पावन शुरुआत।'
  },
  {
    id: 'sagai-13',
    url: '/sagai/20260616_185903.jpg.jpeg',
    titleEn: 'Sweet Engagement Smiles',
    titleHi: 'मधुर मंगनी क्षण',
    descEn: 'Hearts full of dreams and excitement as we officially take our first step.',
    descHi: 'सगाई उत्सव - मुस्कुराहटों और उमंगों के साथ हमारे पावन गठबंधन का शुभ आरंभ।'
  }
];

export default function Gallery({ lang }: GalleryProps) {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, activeIndex, items.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as File[];
      addFilesToGallery(newFiles);
    }
  };

  const addFilesToGallery = (files: File[]) => {
    const newItems = files.map((file, idx) => {
      const localUrl = URL.createObjectURL(file);
      return {
        id: `custom-${Date.now()}-${idx}`,
        url: localUrl,
        titleEn: `My Sagai Memory ${items.filter(item => item.id.startsWith('custom')).length + idx + 1}`,
        titleHi: `सगाई की मधुर स्मृति ${items.filter(item => item.id.startsWith('custom')).length + idx + 1}`,
        descEn: 'Treasured moment from our beautiful engagement ceremony.',
        descHi: 'हमारी शुभ सगाई एवं मंगनी उत्सव के कुछ अत्यंत खूबसूरत और यादगार पल।'
      };
    });

    // Replace or append
    setItems((prev) => {
      // If we only have default items, replace them with user uploaded items
      const hasCustom = prev.some(item => item.id.startsWith('custom'));
      if (!hasCustom) {
        return newItems;
      }
      return [...prev, ...newItems];
    });
    setActiveIndex(0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files) as File[];
      addFilesToGallery(droppedFiles);
    }
  };

  const handleRemovePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (items.length <= 1) {
      alert(lang === 'en' ? 'You must keep at least one photograph!' : 'कम से कम एक तस्वीर रखनी आवश्यक है!');
      return;
    }
    
    setItems((prev) => prev.filter(item => item.id !== id));
    setActiveIndex((prev) => {
      if (prev >= items.length - 1) {
        return 0;
      }
      return prev;
    });
  };

  const handleReset = () => {
    if (confirm(lang === 'en' ? 'Reset to beautiful default illustrations?' : 'क्या आप डिफ़ॉल्ट सुंदर चित्रों पर वापस जाना चाहते हैं?')) {
      setItems(DEFAULT_GALLERY);
      setActiveIndex(0);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const currentItem = items[activeIndex] || DEFAULT_GALLERY[0];

  return (
    <div id="gallery-section" className="bg-white border border-royal-gold/15 rounded-3xl p-5 md:p-8 shadow-md relative overflow-hidden">
      {/* Decorative Ornate Corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-royal-gold/40" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-royal-gold/40" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-royal-gold/40" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-royal-gold/40" />

      {/* Title */}
      <div className="text-center mb-8 relative">
        <span className="text-saffron font-wedding-devanagari text-xs md:text-sm uppercase tracking-widest block mb-1 font-bold">
          {lang === 'mix' ? '॥ सगाई संस्मरण (Sagai Memories) ॥' : lang === 'en' ? '॥ Engagement Memories ॥' : '॥ सगाई संस्मरण ॥'}
        </span>
        <h2 className="text-2xl md:text-4.5xl font-wedding-display font-extrabold text-wedding-crimson">
          {lang === 'mix' ? 'सगाई की मधुर यादें' : lang === 'en' ? 'Our Ring Ceremony Gallery' : 'सगाई की मधुर यादें'}
        </h2>
        {lang === 'mix' && (
          <p className="text-xs font-wedding-serif text-gray-500 font-bold mt-1">(Our Sweet Engagement Ceremony Moments)</p>
        )}
        <div className="w-24 h-0.5 bg-royal-gold mx-auto mt-3" />
      </div>

      {/* Main Frame Container */}
      <div className="max-w-3xl mx-auto relative">
        {/* Main Frame Border and Palace Arch Shape */}
        <div className="relative bg-[#faf7f2] border-4 border-royal-gold/30 p-3 md:p-4 rounded-2xl shadow-xl overflow-hidden aspect-[4/3] sm:aspect-[4/3] flex flex-col justify-between">
          
          {/* Royal Rajasthani Arch SVG Overlay to frame the active image */}
          <div className="absolute inset-0 pointer-events-none z-10 border-8 border-[#faf7f2]" />
          <div className="absolute inset-2 pointer-events-none z-10 border border-royal-gold/20 rounded-lg" />
          
          {/* Main Visual Display */}
          <div 
            className="relative flex-1 w-full h-full overflow-hidden rounded-lg bg-black/5 flex items-center justify-center cursor-zoom-in group"
            onClick={() => setIsModalOpen(true)}
            title={lang === 'en' ? 'Click to view full screen' : 'बड़ा देखने के लिए क्लिक करें'}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={currentItem.url}
                  alt={lang === 'en' ? currentItem.titleEn : currentItem.titleHi}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Traditional Warm Gold Aesthetic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

                {/* Hover zoom hint overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2 pointer-events-none z-10">
                  <div className="p-2.5 bg-wedding-crimson/90 rounded-full border border-royal-gold/40 shadow-lg">
                    <Maximize2 className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 bg-black/40 rounded">
                    {lang === 'mix' ? 'बड़ा देखें (Click to Expand)' : lang === 'en' ? 'Click to Zoom' : 'बड़ा देखने के लिए क्लिक करें'}
                  </span>
                </div>

                {/* Remove button for user-uploaded custom pictures */}
                {currentItem.id.startsWith('custom') && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemovePhoto(currentItem.id, e); }}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-wedding-crimson hover:bg-wedding-maroon text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 border border-royal-gold/50 cursor-pointer"
                    title={lang === 'en' ? 'Remove this photo' : 'यह फोटो हटाएं'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Custom Navigation Overlay Buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-3 z-20 p-2 md:p-3 rounded-full bg-white/80 hover:bg-white text-wedding-maroon shadow-lg hover:scale-110 active:scale-90 transition-all border border-royal-gold/30 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-3 z-20 p-2 md:p-3 rounded-full bg-white/80 hover:bg-white text-wedding-maroon shadow-lg hover:scale-110 active:scale-90 transition-all border border-royal-gold/30 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Micro heart decoration */}
            <div className="absolute top-4 left-4 z-20 bg-white/80 text-wedding-crimson p-1.5 rounded-full border border-royal-gold/30 shadow-md">
              <Heart className="w-4 h-4 fill-wedding-crimson animate-pulse" />
            </div>
          </div>


        </div>

        {/* Thumbnail Dots/Images row */}
        <div className="flex justify-center items-center gap-2 mt-4 px-4 overflow-x-auto py-1">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`relative rounded-md overflow-hidden h-10 w-14 shrink-0 transition-all border-2 ${
                index === activeIndex 
                  ? 'border-wedding-crimson scale-110 shadow-md' 
                  : 'border-royal-gold/30 hover:border-royal-gold opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Live Photos Customizer Panel - Allows dragging and dropping or selecting actual Sagai pictures */}
      <div className="mt-8 max-w-xl mx-auto bg-gradient-to-br from-temple-cream/50 to-white border border-royal-gold/20 p-4 md:p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-5 text-saffron">
          <Camera className="w-full h-full" />
        </div>

        <h3 className="text-xs md:text-sm font-extrabold text-wedding-maroon uppercase tracking-wider mb-2 flex items-center gap-1.5 justify-center md:justify-start">
          <Sparkles className="w-4 h-4 text-saffron shrink-0" />
          <span>
            {lang === 'mix' 
              ? 'अपनी सगाई की फोटो यहाँ जोड़ें (Add Your Sagai Photos)' 
              : lang === 'en' 
                ? 'Add Your Sagai Photographs' 
                : 'अपनी सगाई की फोटो जोड़ें'
            }
          </span>
        </h3>

        <p className="text-[10px] md:text-xs text-gray-500 mb-4 text-center md:text-left leading-relaxed">
          {lang === 'mix' ? (
            <span>
              <span className="block font-wedding-devanagari font-bold text-gray-600">दूल्हा-दुल्हन अपनी सगाई के खूबसूरत असली फोटो यहाँ जोड़कर लाइव देख सकते हैं! ये तुरंत ऊपर सुंदर फ्रेम में दिखने लगेंगी।</span>
              <span className="block text-[9px] text-gray-400 italic">"Groom & Bride can add their actual beautiful Sagai photos here to preview live instantly inside the royal frame above!"</span>
            </span>
          ) : lang === 'en' ? (
            'You can upload your actual Sagai (engagement) photos here to preview them instantly in the royal frame layout!'
          ) : (
            'वर-वधू अपनी सगाई की वास्तविक तस्वीरें यहाँ जोड़कर सुंदर फ्रेम में लाइव देख सकते हैं।'
          )}
        </p>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-wedding-crimson bg-wedding-crimson/5 scale-[0.98]' 
              : 'border-royal-gold/30 hover:border-royal-gold/80 hover:bg-royal-gold/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
              <Upload className="w-5 h-5" />
            </div>
            
            <div className="text-xs">
              <span className="font-bold text-wedding-maroon">
                {lang === 'mix' ? 'फ़ाइल चुनें' : lang === 'en' ? 'Click to upload' : 'फ़ाइल चुनें'}
              </span>
              <span className="text-gray-400">
                {lang === 'mix' ? ' या यहाँ ड्रैग करें (or Drag & Drop here)' : lang === 'en' ? ' or drag and drop photos' : ' या यहाँ खींचकर रखें'}
              </span>
            </div>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
              PNG, JPG, JPEG (Multiple allowed)
            </p>
          </div>
        </div>

        {/* Reset / Customize Controls */}
        {items.some(item => item.id.startsWith('custom')) && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-wedding-crimson/30 hover:border-wedding-crimson text-wedding-crimson hover:bg-wedding-crimson/5 rounded-full shadow-sm text-[10px] md:text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>
                {lang === 'mix' ? 'डिफ़ॉल्ट रिसेट करें (Reset Defaults)' : lang === 'en' ? 'Reset Defaults' : 'डिफ़ॉल्ट रिसेट करें'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Full-screen Immersive Modal Gallery */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 select-none"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
              <div className="text-white/85 text-xs md:text-sm font-semibold tracking-wider bg-black/50 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10 font-mono">
                {activeIndex + 1} / {items.length}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 bg-black/50 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 cursor-pointer hover:scale-110 active:scale-95"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Interactive Modal Image Container */}
            <div 
              className="relative w-full max-w-5xl h-[80vh] md:h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-50 p-3 rounded-full bg-black/50 hover:bg-white hover:text-black text-white transition-all border border-white/10 cursor-pointer hover:scale-110 active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Central Expanded Image Display */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-2">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentItem.id}
                    src={currentItem.url}
                    alt={lang === 'en' ? currentItem.titleEn : currentItem.titleHi}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-royal-gold/20"
                  />
                </AnimatePresence>
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-50 p-3 rounded-full bg-black/50 hover:bg-white hover:text-black text-white transition-all border border-white/10 cursor-pointer hover:scale-110 active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>


          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
