import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Bell, Play, Pause, ChevronUp, Disc, AlertTriangle, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  name: string;
  movie: string;
  artist: string;
  url: string;
  backupUrl?: string;
  type: 'audio' | 'synthesized';
  loop?: boolean;
}

const WEBBING_PLAYLIST: Track[] = [
  {
    name: "Vakratunda Mahakaya (Ganesh Shlok)",
    movie: "Auspicious Blessings Begin",
    artist: "Divine Sacred Chant",
    url: "/music/Vakratunda Mahakaya.mp3",
    type: 'audio',
    loop: false
  },
  {
    name: "Aaj Se Teri",
    movie: "Padman (Wedding Theme)",
    artist: "Arijit Singh & Amit Trivedi",
    url: "/music/Aaj_Se_Teri.mp3",
    type: 'audio',
    loop: true
  },
  {
    name: "Rab Ne Milayi",
    movie: "Rab Ne Bana Di Jodi",
    artist: "Roop Kumar Rathod",
    url: "/music/Rab_Ne_Milayi_Dhadkan.mp3",
    type: 'audio',
    loop: true
  },
  {
    name: "Traditional Tanpura & Bell",
    movie: "Live Wedding Drone Synthesis",
    artist: "Ambient Sacred Aura",
    url: "",
    type: 'synthesized'
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasManuallySelected, setHasManuallySelected] = useState(false);
  const [lastAutoTriggeredSection, setLastAutoTriggeredSection] = useState<'ganesha' | 'other'>('ganesha');

  // Audio elements & Synthesis Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const bellIntervalRef = useRef<any>(null);

  const currentTrack = WEBBING_PLAYLIST[currentTrackIndex];

  // Scroll listener for automatic track transition between sections
  useEffect(() => {
    const handleScroll = () => {
      // If the user manually paused, stopped, or clicked a specific song, respect their choice
      if (hasManuallySelected) return;

      const threshold = 400; // Scroll past the Lord Ganesha Header / Welcome section
      const currentScroll = window.scrollY;

      if (currentScroll > threshold && lastAutoTriggeredSection === 'ganesha') {
        setLastAutoTriggeredSection('other');
        // Transition from Ganesha Shlok to first wedding song ("Aaj Se Teri" is index 1 now)
        setCurrentTrackIndex(1);
        setIsPlaying(true);
      } else if (currentScroll <= threshold && lastAutoTriggeredSection === 'other') {
        setLastAutoTriggeredSection('ganesha');
        // Transition back to Ganesha Shlok when near the top
        setCurrentTrackIndex(0);
        setIsPlaying(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasManuallySelected, lastAutoTriggeredSection]);

  // Initialize event listeners & direct synchronous play trigger on window
  useEffect(() => {
    const handlePlayOnEnter = () => {
      // Triggered when Diya is lit
      playTrack(0);
    };

    // Expose synchronous trigger to capture user gesture directly in click handler
    (window as any).playWeddingMusicDirectly = () => {
      console.log("Synchronous play trigger received under user gesture context");
      setHasError(false);
      setIsPlaying(true);
      setCurrentTrackIndex(0);

      // Instantly start audio synchronously!
      stopTanpura();
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const firstTrack = WEBBING_PLAYLIST[0];
      const candidates = [
        "/music/Vakratunda Mahakaya.mp3",
        firstTrack.backupUrl
      ].filter(Boolean) as string[];

      let attemptIndex = 0;

      const tryDirectPlay = () => {
        if (attemptIndex >= candidates.length) {
          console.warn("All audio play attempts failed.");
          setHasError(true);
          const droneIndex = WEBBING_PLAYLIST.findIndex(t => t.type === 'synthesized');
          if (droneIndex !== -1) setCurrentTrackIndex(droneIndex);
          return;
        }

        const currentUrl = candidates[attemptIndex];
        console.log("Direct play: attempting candidate", attemptIndex, currentUrl);

        if (audioRef.current) {
          audioRef.current.onerror = null;
          audioRef.current.onended = null;
          audioRef.current.src = currentUrl;
          audioRef.current.loop = firstTrack.loop !== false;
          audioRef.current.volume = 0.55;

          audioRef.current.onended = () => {
            if (firstTrack.loop === false) {
              console.log("First track (Ganesha Shlok) ended. Advancing to Aaj Se Teri.");
              setCurrentTrackIndex(1);
              setIsPlaying(true);
            }
          };

          const handleAttemptError = () => {
            console.warn("Direct play candidate failed:", currentUrl);
            attemptIndex++;
            tryDirectPlay();
          };

          audioRef.current.onerror = handleAttemptError;

          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              if (error.name === 'NotAllowedError') {
                setIsPlaying(false);
              } else if (error.name === 'AbortError') {
                console.log("Direct play aborted normally.");
              } else {
                handleAttemptError();
              }
            });
          }
        }
      };

      tryDirectPlay();
    };

    window.addEventListener('play-wedding-music', handlePlayOnEnter);
    return () => {
      window.removeEventListener('play-wedding-music', handlePlayOnEnter);
      delete (window as any).playWeddingMusicDirectly;
      stopTanpura();
    };
  }, [currentTrackIndex]);

  // Audio tag control
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const decodedSrc = audioRef.current ? decodeURIComponent(audioRef.current.src) : '';
    const hasCorrectSrc = audioRef.current && (
      decodedSrc.endsWith(currentTrack.url) ||
      (currentTrack.backupUrl && decodedSrc.endsWith(currentTrack.backupUrl)) ||
      (currentTrackIndex === 0 && (
        decodedSrc.endsWith("/music/Vakratunda Mahakaya.mp3") ||
        decodedSrc.includes("Vakratunda") ||
        decodedSrc.includes("Ganpati")
      ))
    );

    if (currentTrack.type === 'audio') {
      if (isPlaying) {
        stopTanpura();
        
        if (hasCorrectSrc && audioRef.current) {
          if (audioRef.current.paused) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                if (error.name === 'NotAllowedError') {
                  setIsPlaying(false);
                }
              });
            }
          }
          return;
        }

        const candidates = currentTrackIndex === 0 ? [
          "/music/Vakratunda Mahakaya.mp3",
          currentTrack.backupUrl
        ].filter(Boolean) as string[] : [
          currentTrack.url,
          currentTrack.backupUrl
        ].filter(Boolean) as string[];

        let attemptIndex = 0;

        const tryPlayTrack = () => {
          if (attemptIndex >= candidates.length) {
            setHasError(true);
            fallbackToDrone();
            return;
          }

          const currentUrl = candidates[attemptIndex];
          console.log("General playback: attempting candidate", attemptIndex, currentUrl);

          if (audioRef.current) {
            audioRef.current.onerror = null;
            audioRef.current.onended = null;
            audioRef.current.src = currentUrl;
            audioRef.current.loop = currentTrack.loop !== false;
            audioRef.current.volume = 0.45;

            const handleAudioError = () => {
              console.warn("General playback candidate failed:", currentUrl);
              attemptIndex++;
              tryPlayTrack();
            };

            audioRef.current.onended = () => {
              if (currentTrackIndex === 0) {
                console.log("Track index 0 (Ganesha Shlok) ended. Auto-advancing to Aaj Se Teri.");
                setCurrentTrackIndex(1);
                setIsPlaying(true);
              }
            };

            audioRef.current.onerror = handleAudioError;
            
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                if (error.name === 'NotAllowedError') {
                  setIsPlaying(false);
                } else if (error.name === 'AbortError') {
                  console.log("Playback aborted normally.");
                } else {
                  handleAudioError();
                }
              });
            }
          }
        };

        tryPlayTrack();
      } else {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
      }
    } else if (currentTrack.type === 'synthesized') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (isPlaying) {
        startTanpura();
      } else {
        stopTanpura();
      }
    }
  }, [currentTrackIndex, isPlaying]);

  const fallbackToDrone = () => {
    const droneIndex = WEBBING_PLAYLIST.findIndex(t => t.type === 'synthesized');
    if (droneIndex !== -1) {
      setCurrentTrackIndex(droneIndex);
    }
  };

  const playTrack = (index: number) => {
    setHasManuallySelected(true);
    setHasError(false);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    setHasManuallySelected(true);
    setHasError(false);
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = WEBBING_PLAYLIST.length - 1;
    }
    // Skip synthesized track type internally unless manual selection
    if (WEBBING_PLAYLIST[prevIndex].type === 'synthesized') {
      prevIndex = prevIndex - 1;
      if (prevIndex < 0) prevIndex = WEBBING_PLAYLIST.length - 2;
    }
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const playNext = () => {
    setHasManuallySelected(true);
    setHasError(false);
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= WEBBING_PLAYLIST.length) {
      nextIndex = 0;
    }
    // Skip synthesized track type internally unless manual selection
    if (WEBBING_PLAYLIST[nextIndex].type === 'synthesized') {
      nextIndex = nextIndex + 1;
      if (nextIndex >= WEBBING_PLAYLIST.length) nextIndex = 0;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopTanpura();
    } else {
      setIsPlaying(true);
    }
  };

  // Synthesized Tanpura Drone
  const startTanpura = () => {
    try {
      stopTanpura();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const droneFreqs = [130.81, 131.2, 196.0, 261.63]; 
      const volumeFactors = [0.4, 0.3, 0.25, 0.15];

      droneFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        osc.connect(gainNode);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        gainNode.connect(filter);
        filter.connect(masterGain);

        osc.start(ctx.currentTime);

        const swellInterval = 4.5 + idx * 0.6;
        const scheduleSwells = () => {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
          const now = ctx.currentTime;
          gainNode.gain.setValueAtTime(0.01, now);
          gainNode.gain.exponentialRampToValueAtTime(volumeFactors[idx] * 0.18, now + 1.5);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + swellInterval - 0.5);
        };

        scheduleSwells();
        const timer = setInterval(scheduleSwells, swellInterval * 1000);

        oscillatorsRef.current.push(osc);
        gainNodesRef.current.push(gainNode);
        (gainNode as any).swellTimer = timer;
      });

      // Temple bell ringer
      const scheduleBell = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); 
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        
        osc.connect(gainNode);
        gainNode.connect(masterGain);
        
        osc.start(now);
        osc.stop(now + 3.2);
      };

      bellIntervalRef.current = setInterval(scheduleBell, 7000);
    } catch (e) {
      console.error("Web Audio synthesis error:", e);
    }
  };

  const stopTanpura = () => {
    if (bellIntervalRef.current) {
      clearInterval(bellIntervalRef.current);
      bellIntervalRef.current = null;
    }

    oscillatorsRef.current.forEach((osc) => {
      try { osc.stop(); } catch (e) {}
    });
    oscillatorsRef.current = [];

    gainNodesRef.current.forEach((gainNode) => {
      if ((gainNode as any).swellTimer) {
        clearInterval((gainNode as any).swellTimer);
      }
    });
    gainNodesRef.current = [];

    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3 font-wedding-serif">
      {/* Expanded Playlist Selector */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 25, scale: 0.95, filter: 'blur(2px)' }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="w-[260px] bg-white/95 backdrop-blur-md border-2 border-royal-gold rounded-2xl p-3 shadow-2xl text-left relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-saffron via-bright-gold to-saffron" />
            
            {/* Elegant Corner Decorative Ornaments (Royal Indian Wedding Style) */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-royal-gold/40 rounded-tl" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-royal-gold/40 rounded-tr" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-royal-gold/40 rounded-bl" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-royal-gold/40 rounded-br" />
            
            <div className="flex items-center justify-between border-b border-royal-gold/20 pb-1.5 mb-2.5 relative">
              <span className="text-wedding-maroon font-wedding-display text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                <Music className="w-3 h-3 text-wedding-crimson animate-pulse" />
                विवाह संगीत / Wedding Music
              </span>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-gray-400 hover:text-wedding-crimson text-[10px] font-semibold px-1 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>

            {hasError && (
              <div className="bg-amber-50/90 text-wedding-maroon p-2 rounded-xl text-[9px] flex flex-col gap-1 mb-2.5 border border-royal-gold/30">
                <div className="flex items-center gap-1 font-bold text-wedding-maroon text-[10px]">
                  <Bell className="w-3 h-3 flex-shrink-0 text-marigold-orange animate-bounce" />
                  <span>॥ पावन संगीतमय वातावरण ॥</span>
                </div>
                <p className="text-[8px] text-wedding-maroon/80 leading-relaxed font-wedding-serif">
                  Switched to live-synthesized traditional Tanpura drone.
                </p>
                <button
                  onClick={() => {
                    setHasError(false);
                    playTrack(0);
                  }}
                  className="mt-0.5 self-start bg-gradient-to-r from-wedding-crimson to-wedding-maroon text-bright-gold font-bold px-2 py-0.5 rounded-md text-[8px] cursor-pointer shadow-sm uppercase tracking-wider border border-royal-gold/40"
                >
                  Retry Stream
                </button>
              </div>
            )}

            {/* Premium Interactive Now Playing Dashboard - Elegant Shubh Vivah styling */}
            <div className="mb-2.5 bg-gradient-to-br from-wedding-maroon/20 via-wedding-crimson/5 to-wedding-maroon/20 p-2.5 rounded-xl border-2 border-royal-gold/45 text-center relative shadow-inner overflow-hidden">
              {/* Background elegant watermark lines and traditional mandala vector pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#d4af37_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-[0.08] pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full border border-royal-gold/15 pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-royal-gold/10" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full border border-royal-gold/15 pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-royal-gold/10" />
              </div>

              {/* Royal Wooden/Golden Turntable Base visualizer - Compact */}
              <div className="flex justify-center mb-2.5 relative z-10">
                <div className="relative w-24 h-24 bg-gradient-to-br from-wedding-maroon/25 via-wedding-crimson/15 to-wedding-maroon/30 rounded-xl border border-royal-gold/40 flex items-center justify-center shadow-md overflow-hidden">
                  {/* Subtle wood grain background */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#d4af37_1px,transparent_1px)] [background-size:8px_8px] opacity-[0.05]" />
                  
                  {/* Radial golden pulse ripples when playing */}
                  {isPlaying && (
                    <>
                      <motion.div
                        animate={{ scale: [0.8, 1.4], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
                        className="absolute w-14 h-14 rounded-full border border-royal-gold/50"
                      />
                      <motion.div
                        animate={{ scale: [0.8, 1.7], opacity: [0.4, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, delay: 0.7, ease: "easeOut" }}
                        className="absolute w-14 h-14 rounded-full border border-saffron/30"
                      />
                    </>
                  )}

                  {/* Floating Elements (Notes + Petals) rising from vinyl */}
                  {isPlaying && (
                    <>
                      {/* Floating Note 1 */}
                      <motion.span
                        initial={{ opacity: 0, y: 10, x: -5, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 0], y: [-10, -45], x: [-10, -30], scale: [0.5, 1, 0.7], rotate: [-10, 20] }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: "easeOut" }}
                        className="absolute text-saffron text-[10px] font-bold pointer-events-none select-none z-20"
                        style={{ left: '12%', bottom: '18%' }}
                      >
                        ♪
                      </motion.span>
                      {/* Floating Petal 1 */}
                      <motion.span
                        initial={{ opacity: 0, y: 10, x: 5, scale: 0.4 }}
                        animate={{ opacity: [0, 0.8, 0], y: [-8, -50], x: [8, 25], scale: [0.4, 0.9, 0.5], rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 3.4, delay: 0.5, ease: "easeOut" }}
                        className="absolute text-wedding-crimson text-[8px] pointer-events-none select-none z-20"
                        style={{ right: '12%', bottom: '18%' }}
                      >
                        🌸
                      </motion.span>
                      {/* Floating Note 2 */}
                      <motion.span
                        initial={{ opacity: 0, y: 15, x: 0, scale: 0.4 }}
                        animate={{ opacity: [0, 0.9, 0], y: [-5, -55], x: [-5, 15], scale: [0.4, 1, 0.5], rotate: [5, -25] }}
                        transition={{ repeat: Infinity, duration: 3.1, delay: 1.4, ease: "easeOut" }}
                        className="absolute text-bright-gold text-[8px] font-bold pointer-events-none select-none z-20"
                        style={{ left: '38%', bottom: '18%' }}
                      >
                        ♬
                      </motion.span>
                    </>
                  )}

                  {/* Spinning Record / Vinyl - Compact */}
                  <div className="relative w-18 h-18 rounded-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 border-2 border-royal-gold/60 shadow-md overflow-hidden">
                    {/* Vinyl specular shiny gloss overlays */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                    
                    {/* Concentric groove rings */}
                    <div className="absolute inset-1.5 border border-neutral-700/50 rounded-full" />
                    <div className="absolute inset-3 border border-neutral-800 rounded-full" />
                    <div className="absolute inset-4.5 border border-neutral-700/30 rounded-full" />
                    
                    {/* Central Gold Record Label (Rotates) */}
                    <motion.div 
                      animate={isPlaying ? { rotate: 360 } : {}}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      className="absolute inset-6 bg-gradient-to-br from-royal-gold via-bright-gold to-saffron rounded-full border border-wedding-maroon flex items-center justify-center shadow-sm shadow-wedding-maroon/40"
                    >
                      <Music className="w-2.5 h-2.5 text-wedding-maroon" />
                    </motion.div>
                  </div>

                  {/* Elegant Golden Stylus Needle / Tone-Arm - Scaled and Repositioned */}
                  <div className="absolute top-1 right-1 pointer-events-none z-10 scale-[0.6] origin-top-right">
                    <motion.div
                      initial={{ rotate: -25 }}
                      animate={{ rotate: isPlaying ? 14 : -25 }}
                      transition={{ type: "spring", stiffness: 90, damping: 14 }}
                      style={{ originX: "80%", originY: "15%" }}
                      className="relative w-16 h-16"
                    >
                      {/* Pivot mount cap */}
                      <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-gradient-to-br from-royal-gold via-bright-gold to-royal-gold border border-wedding-maroon/40 shadow-md flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-wedding-maroon to-wedding-crimson border border-royal-gold/20" />
                      </div>
                      {/* Stylus arm path vector */}
                      <svg className="absolute right-2.5 top-3.5 w-12 h-14 overflow-visible" viewBox="0 0 50 60">
                        <path 
                          d="M 43,4 L 33,26 L 19,41 L 14,48" 
                          fill="none" 
                          stroke="url(#armGoldGradient)" 
                          strokeWidth="2.8" 
                          strokeLinecap="round" 
                          className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                        />
                        {/* Needle cartridge */}
                        <rect 
                          x="9" 
                          y="46" 
                          width="11" 
                          height="7" 
                          rx="1.5" 
                          fill="#1c1c1c" 
                          stroke="#d4af37" 
                          strokeWidth="0.75" 
                          transform="rotate(-15, 14, 49)" 
                        />
                        {/* Tiny diamond tip indicator */}
                        <line x1="11" y1="52" x2="9" y2="56" stroke="#fbf5b7" strokeWidth="1.2" />
                        
                        <defs>
                          <linearGradient id="armGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#aa771c" />
                            <stop offset="35%" stopColor="#fbf5b7" />
                            <stop offset="70%" stopColor="#d4af37" />
                            <stop offset="100%" stopColor="#b38728" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Traditional Shloka subtitle indicator */}
              <div className="text-[8px] text-saffron/90 font-bold tracking-widest uppercase mb-1 animate-pulse">
                ॥ शुभ विवाह संगीत ॥
              </div>

              {/* Track Title & Artist Info */}
              <div className="px-1 mb-2 relative z-10">
                <h4 className="text-[11px] font-black text-wedding-maroon tracking-wide line-clamp-1 font-wedding-serif drop-shadow-sm">
                  {currentTrack.name}
                </h4>
                <p className="text-[9px] text-wedding-maroon/75 font-semibold truncate mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Pulsing Audio Wave Visualizer - Compact */}
              <div className="flex items-center justify-center gap-0.5 h-5 mb-2.5 bg-wedding-maroon/5 rounded-lg py-1 px-2 border border-royal-gold/15">
                {[...Array(12)].map((_, i) => {
                  const animDuration = 0.5 + (i % 3) * 0.15;
                  const maxHeight = i % 2 === 0 ? 15 : 10;
                  return (
                    <motion.span
                      key={i}
                      animate={isPlaying ? {
                        height: [3, maxHeight, 3],
                      } : { height: 3 }}
                      transition={{
                        repeat: Infinity,
                        duration: animDuration,
                        ease: "easeInOut",
                        repeatType: "reverse",
                        delay: i * 0.04
                      }}
                      className="w-0.75 bg-gradient-to-t from-wedding-crimson via-saffron to-marigold-yellow rounded-full shadow-[0_0_3px_rgba(230,81,0,0.3)]"
                    />
                  );
                })}
              </div>

              {/* Premium Controls Row - Compact */}
              <div className="flex items-center justify-center gap-3.5">
                <motion.button
                  whileHover={{ scale: 1.15, x: -1 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={playPrevious}
                  className="w-7 h-7 rounded-full bg-white hover:bg-amber-50 text-wedding-maroon border border-royal-gold/50 shadow-sm flex items-center justify-center cursor-pointer transition-all duration-150"
                  title="Previous Track"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-wedding-crimson via-wedding-maroon to-wedding-crimson text-bright-gold border border-royal-gold shadow-md flex items-center justify-center cursor-pointer transition-all duration-150 relative overflow-hidden group"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-bright-gold text-bright-gold relative z-10" />
                  ) : (
                    <Play className="w-4 h-4 fill-bright-gold text-bright-gold translate-x-0.5 relative z-10" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.15, x: 1 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={playNext}
                  className="w-7 h-7 rounded-full bg-white hover:bg-amber-50 text-wedding-maroon border border-royal-gold/50 shadow-sm flex items-center justify-center cursor-pointer transition-all duration-150"
                  title="Next Track"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            <span className="text-[8px] text-gray-400 font-bold tracking-widest uppercase block mb-1 pl-1">
              Select Track / संगीत चुनें:
            </span>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.06,
                    delayChildren: 0.08
                  }
                }
              }}
              className="space-y-1 max-h-36 overflow-y-auto pr-1"
            >
              {WEBBING_PLAYLIST.map((track, idx) => {
                if (track.type === 'synthesized') return null;
                const isActive = currentTrackIndex === idx;
                const itemVariants = {
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
                };
                return (
                  <motion.button
                    variants={itemVariants}
                    key={idx}
                    onClick={() => playTrack(idx)}
                    className={`w-full text-left p-1.5 rounded-lg border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-wedding-crimson/5 border-wedding-crimson text-wedding-crimson font-medium shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-gray-50/80 text-gray-600 hover:text-wedding-maroon'
                    }`}
                  >
                    <div className="overflow-hidden pr-2">
                      <div className="text-[10px] font-bold truncate group-hover:text-wedding-crimson transition-colors">
                        {track.name}
                      </div>
                      <div className="text-[8px] text-gray-400 truncate">
                        {track.artist}
                      </div>
                    </div>
                    {isActive && isPlaying ? (
                      <span className="flex gap-0.5 items-end h-2.5 shrink-0">
                        <span className="w-0.5 bg-wedding-crimson animate-pulse h-2" />
                        <span className="w-0.5 bg-wedding-crimson animate-pulse h-1.5" style={{ animationDelay: '0.15s' }} />
                        <span className="w-0.5 bg-wedding-crimson animate-pulse h-3" style={{ animationDelay: '0.3s' }} />
                      </span>
                    ) : (
                      <Play className="w-2.5 h-2.5 text-gray-400 group-hover:text-wedding-crimson opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Widget Row */}
      <div className="flex items-center gap-2">
        {/* Playlist Toggle Trigger */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="w-10 h-10 rounded-full bg-white text-wedding-maroon border-2 border-royal-gold/60 hover:border-royal-gold shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
          title="Select Bollywood Wedding Song"
        >
          <ChevronUp className={`w-5 h-5 text-wedding-crimson transition-transform duration-300 ${showPlaylist ? 'rotate-180' : ''}`} />
        </button>

        {/* Main Play/Pause Button */}
        <div className="relative">
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-saffron via-bright-gold to-wedding-crimson opacity-75 blur-sm animate-pulse" />
          )}
          <button
            onClick={togglePlay}
            aria-label="Toggle traditional wedding audio"
            className="relative w-12 h-12 rounded-full bg-gradient-to-br from-wedding-crimson via-wedding-maroon to-wedding-crimson text-bright-gold border-2 border-royal-gold shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 group z-10"
          >
            {isPlaying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              >
                <Volume2 className="w-5 h-5 text-bright-gold" />
              </motion.div>
            ) : (
              <VolumeX className="w-5 h-5 text-bright-gold group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
