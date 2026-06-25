import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Bell, Play, Pause, ChevronUp, Disc, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  name: string;
  movie: string;
  artist: string;
  url: string;
  backupUrl?: string;
  type: 'audio' | 'synthesized';
}

const WEBBING_PLAYLIST: Track[] = [
  {
    name: "Vakratunda Mahakaya (Ganesh Shlok)",
    movie: "Auspicious Blessings Begin",
    artist: "Divine Sacred Chant",
    url: "music/Vakratunda Mahakaya - Ganpati Shlok_spotdown.org.mp3",
    type: 'audio'
  },
  {
    name: "Aaj Se Teri",
    movie: "Padman (Wedding Theme)",
    artist: "Arijit Singh & Amit Trivedi",
    url: "music/Amit Trivedi, Arijit Singh - Aaj Se Teri (SPOTISAVER).mp3",
    type: 'audio'
  },
  {
    name: "Rab Ne Milayi",
    movie: "Rab Ne Bana Di Jodi",
    artist: "Roop Kumar Rathod",
    url: "music/Devrath Sharma - Rab Ne Milayi Dhadkan (SPOTISAVER).mp3",
    type: 'audio'
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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onerror = null;
        audioRef.current = null;
      }

      const firstTrack = WEBBING_PLAYLIST[0];
      const audioInstance = new Audio(firstTrack.url);
      audioInstance.loop = true;
      audioInstance.volume = 0.55;

      const handleDirectError = () => {
        if (firstTrack.backupUrl && audioInstance.src !== firstTrack.backupUrl) {
          console.log("Direct play primary URL failed, playing backup:", firstTrack.backupUrl);
          audioInstance.src = firstTrack.backupUrl;
          audioInstance.play().catch((err) => {
            console.warn("Direct play backup failed:", err);
            if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
              setHasError(true);
              const droneIndex = WEBBING_PLAYLIST.findIndex(t => t.type === 'synthesized');
              if (droneIndex !== -1) setCurrentTrackIndex(droneIndex);
            } else if (err.name === 'NotAllowedError') {
              setIsPlaying(false);
            }
          });
        } else {
          setHasError(true);
          const droneIndex = WEBBING_PLAYLIST.findIndex(t => t.type === 'synthesized');
          if (droneIndex !== -1) setCurrentTrackIndex(droneIndex);
        }
      };

      audioInstance.onerror = handleDirectError;
      audioRef.current = audioInstance;

      const playPromise = audioInstance.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Direct play blocked, trying fallback:", error);
          if (error.name === 'NotAllowedError') {
            setIsPlaying(false);
          } else if (error.name === 'AbortError') {
            console.log("Direct play aborted normally.");
          } else {
            handleDirectError();
          }
        });
      }
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
    // If we are already playing audio from the direct window play trigger, we don't want to re-instantiate it here if it's already active and matches the URL
    if (audioRef.current && isPlaying && currentTrack.type === 'audio' && audioRef.current.src === currentTrack.url) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    if (currentTrack.type === 'audio' && isPlaying) {
      stopTanpura();
      const audioInstance = new Audio(currentTrack.url);
      audioInstance.loop = true;
      audioInstance.volume = 0.45;

      const handleAudioError = () => {
        if (currentTrack.backupUrl && audioInstance.src !== currentTrack.backupUrl) {
          console.log("Primary URL failed, playing backup:", currentTrack.backupUrl);
          audioInstance.src = currentTrack.backupUrl;
          audioInstance.play().catch((err) => {
            console.warn("Backup URL failed:", err);
            if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
              setHasError(true);
              fallbackToDrone();
            } else if (err.name === 'NotAllowedError') {
              setIsPlaying(false);
            }
          });
        } else {
          setHasError(true);
          fallbackToDrone();
        }
      };

      audioInstance.onerror = handleAudioError;
      audioRef.current = audioInstance;
      
      const playPromise = audioInstance.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Playback blocked or failed:", error);
          if (error.name === 'NotAllowedError') {
            setIsPlaying(false);
          } else if (error.name === 'AbortError') {
            console.log("Playback aborted normally.");
          } else {
            handleAudioError();
          }
        });
      }
    } else if (currentTrack.type === 'synthesized' && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
      startTanpura();
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
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="w-80 bg-white/95 backdrop-blur-md border-2 border-royal-gold rounded-2xl p-4 shadow-2xl text-left relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-saffron via-bright-gold to-saffron" />
            
            <div className="flex items-center justify-between border-b border-royal-gold/20 pb-2 mb-3">
              <span className="text-wedding-maroon font-wedding-display text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-wedding-crimson" />
                पावन विवाह संगीत / Wedding Music
              </span>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-gray-400 hover:text-wedding-crimson text-xs font-semibold px-1 cursor-pointer"
              >
                Close
              </button>
            </div>

            {hasError && (
              <div className="bg-amber-50/90 text-wedding-maroon p-2.5 rounded-xl text-[10px] flex flex-col gap-1.5 mb-3.5 border border-royal-gold/30">
                <div className="flex items-center gap-1.5 font-bold text-wedding-maroon text-[11px]">
                  <Bell className="w-3.5 h-3.5 flex-shrink-0 text-marigold-orange animate-bounce" />
                  <span>॥ पावन संगीतमय वातावरण ॥</span>
                </div>
                <p className="text-[9px] text-wedding-maroon/80 leading-relaxed font-wedding-serif">
                  Browser security blocked the streaming audio. The player has gracefully switched to our serene, live-synthesized Tanpura & temple bell drone.
                </p>
                <button
                  onClick={() => {
                    setHasError(false);
                    playTrack(0);
                  }}
                  className="mt-1 self-start bg-gradient-to-r from-wedding-crimson to-wedding-maroon hover:from-wedding-maroon hover:to-wedding-crimson text-bright-gold font-bold px-3 py-1 rounded-lg text-[9px] transition-all duration-300 cursor-pointer shadow-md uppercase tracking-wider border border-royal-gold/40 hover:scale-[1.02]"
                >
                  Retry Audio Stream / पुनः प्रयास करें ⟳
                </button>
              </div>
            )}

            {/* Quick-Change Wedding Songs Section */}
            <div className="mb-3.5 bg-gradient-to-br from-wedding-maroon/5 to-wedding-crimson/5 p-2.5 rounded-xl border border-royal-gold/25">
              <span className="text-[9px] text-wedding-maroon font-wedding-devanagari font-bold uppercase tracking-widest block mb-2 text-center">
                ॥ गीत बदलें / Switch Wedding Track ॥
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => playTrack(1)}
                  className={`py-2 px-1.5 rounded-lg text-center border transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                    currentTrackIndex === 1 && isPlaying
                      ? 'bg-gradient-to-r from-wedding-crimson to-wedding-maroon text-bright-gold border-bright-gold font-bold scale-[1.03] shadow-[0_4px_10px_rgba(158,27,50,0.2)]'
                      : 'bg-white text-wedding-maroon border-royal-gold/25 hover:border-wedding-crimson/50 hover:bg-wedding-crimson/[0.02]'
                  }`}
                >
                  <span className="text-[10px] font-bold">Aaj Se Teri</span>
                  <span className="text-[8px] opacity-80 mt-0.5">आज से तेरी</span>
                </button>

                <button
                  onClick={() => playTrack(2)}
                  className={`py-2 px-1.5 rounded-lg text-center border transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                    currentTrackIndex === 2 && isPlaying
                      ? 'bg-gradient-to-r from-wedding-crimson to-wedding-maroon text-bright-gold border-bright-gold font-bold scale-[1.03] shadow-[0_4px_10px_rgba(158,27,50,0.2)]'
                      : 'bg-white text-wedding-maroon border-royal-gold/25 hover:border-wedding-crimson/50 hover:bg-wedding-crimson/[0.02]'
                  }`}
                >
                  <span className="text-[10px] font-bold">Rab Ne Milayi</span>
                  <span className="text-[8px] opacity-80 mt-0.5">तुझमें रब दिखता है</span>
                </button>
              </div>
            </div>

            <span className="text-[8px] text-gray-400 font-bold tracking-widest uppercase block mb-1.5 pl-1">
              All Tracks / सभी संगीत विकल्प:
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {WEBBING_PLAYLIST.map((track, idx) => {
                if (track.type === 'synthesized') return null;
                const isActive = currentTrackIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => playTrack(idx)}
                    className={`w-full text-left p-2 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-wedding-crimson/5 border-wedding-crimson text-wedding-crimson font-medium'
                        : 'bg-transparent border-transparent hover:bg-gray-50 text-gray-600 hover:text-wedding-maroon'
                    }`}
                  >
                    <div className="overflow-hidden pr-2">
                      <div className="text-[11px] font-bold truncate group-hover:text-wedding-crimson transition-colors">
                        {track.name}
                      </div>
                      <div className="text-[9px] text-gray-400 truncate">
                        {track.artist} • <span className="italic">{track.movie}</span>
                      </div>
                    </div>
                    {isActive && isPlaying ? (
                      <span className="flex gap-0.5 items-end h-3 shrink-0">
                        <span className="w-0.75 bg-wedding-crimson animate-pulse h-3" />
                        <span className="w-0.75 bg-wedding-crimson animate-pulse h-2" style={{ animationDelay: '0.15s' }} />
                        <span className="w-0.75 bg-wedding-crimson animate-pulse h-4" style={{ animationDelay: '0.3s' }} />
                      </span>
                    ) : (
                      <Play className="w-3 h-3 text-gray-400 group-hover:text-wedding-crimson opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Widget Row */}
      <div className="flex items-center gap-2">
        {/* Floating Now Playing Text */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-wedding-maroon/95 backdrop-blur-md border border-royal-gold px-3 py-2 rounded-full text-[10px] text-bright-gold font-bold tracking-wide uppercase flex items-center gap-2 shadow-xl cursor-pointer hover:border-bright-gold transition-colors"
            onClick={() => setShowPlaylist(!showPlaylist)}
          >
            <Disc className="w-3.5 h-3.5 text-bright-gold animate-slow-spin" />
            <div className="max-w-28 truncate">
              {currentTrack.name}
            </div>
          </motion.div>
        )}

        {/* Playlist Toggle Trigger */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="w-10 h-10 rounded-full bg-white text-wedding-maroon border-2 border-royal-gold/60 hover:border-royal-gold shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
          title="Select Bollywood Wedding Song"
        >
          <ChevronUp className={`w-5 h-5 text-wedding-crimson transition-transform duration-300 ${showPlaylist ? 'rotate-180' : ''}`} />
        </button>

        {/* Main Play/Pause Button */}
        <button
          onClick={togglePlay}
          aria-label="Toggle traditional wedding audio"
          className="w-12 h-12 rounded-full bg-gradient-to-br from-wedding-crimson to-wedding-maroon text-bright-gold border-2 border-royal-gold shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 group"
        >
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.div>
          ) : (
            <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
}
