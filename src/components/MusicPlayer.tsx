import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Bell, Play, Pause, ChevronUp, SkipForward, SkipBack, Sliders } from 'lucide-react';
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
    name: "Vakratunda Mahakaya",
    movie: "Ganesh Vandana & Blessings",
    artist: "Divine Sacred Shlok",
    url: "/music/Vakratunda Mahakaya.mp3",
    type: 'audio'
  },
  {
    name: "Aaj Se Teri",
    movie: "Padman (Wedding Anthem)",
    artist: "Arijit Singh & Amit Trivedi",
    url: "/music/Aaj_Se_Teri.mp3",
    type: 'audio'
  },
  {
    name: "Rab Ne Milayi",
    movie: "Rab Ne Bana Di Jodi",
    artist: "Roop Kumar Rathod",
    url: "/music/Rab_Ne_Milayi_Dhadkan.mp3",
    type: 'audio'
  },
  {
    name: "Sacred Tanpura & Bell",
    movie: "Live Wedding Drone",
    artist: "Ambient Sacred Aura",
    url: "",
    type: 'synthesized'
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Audio elements & Synthesis Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const bellIntervalRef = useRef<any>(null);

  const currentTrack = WEBBING_PLAYLIST[currentTrackIndex];

  // Initialize event listeners & direct synchronous play trigger on window
  useEffect(() => {
    const handlePlayOnEnter = () => {
      // Triggered when Diya is lit
      playTrack(0);
    };

    // Expose synchronous trigger to capture user gesture directly in click handler
    (window as any).playWeddingMusicDirectly = () => {
      setHasError(false);
      setIsPlaying(true);
      setCurrentTrackIndex(0);

      stopTanpura();
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const firstTrack = WEBBING_PLAYLIST[0];
      const audio = audioRef.current;
      audio.src = firstTrack.url;
      audio.volume = isMuted ? 0 : volume;

      audio.onended = () => {
        // Auto advance to next song seamlessly
        playNext();
      };

      audio.onerror = () => {
        console.warn("Direct play failed, falling back to Next track");
        playNext();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name === 'NotAllowedError') {
            setIsPlaying(false);
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
  }, [volume, isMuted]);

  // Volume & Mute Updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio tag control
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    if (currentTrack.type === 'audio') {
      stopTanpura();
      if (isPlaying) {
        // Check if src is different
        const decodedSrc = decodeURIComponent(audio.src);
        if (!decodedSrc.endsWith(currentTrack.url)) {
          audio.src = currentTrack.url;
        }

        audio.volume = isMuted ? 0 : volume;

        audio.onended = () => {
          // Continuous loop across the playlist
          setCurrentTrackIndex((prev) => {
            let next = prev + 1;
            if (next >= WEBBING_PLAYLIST.length - 1) { // Skip synthesized in auto flow
              next = 0;
            }
            return next;
          });
        };

        audio.onerror = () => {
          console.warn("Track error, switching to next or synthesized drone");
          setHasError(true);
          fallbackToDrone();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            if (err.name === 'NotAllowedError') {
              setIsPlaying(false);
            }
          });
        }
      } else {
        if (!audio.paused) {
          audio.pause();
        }
      }
    } else if (currentTrack.type === 'synthesized') {
      if (audio && !audio.paused) {
        audio.pause();
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
    setHasError(false);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    setHasError(false);
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = WEBBING_PLAYLIST.length - 2; // skip synthesized
    }
    if (WEBBING_PLAYLIST[prevIndex].type === 'synthesized') {
      prevIndex = Math.max(0, prevIndex - 1);
    }
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const playNext = () => {
    setHasError(false);
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= WEBBING_PLAYLIST.length - 1) {
      nextIndex = 0;
    }
    if (WEBBING_PLAYLIST[nextIndex].type === 'synthesized') {
      nextIndex = 0;
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Synthesized Tanpura Drone (Fallback & Sacred Ambiance)
  const startTanpura = () => {
    try {
      stopTanpura();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.2, ctx.currentTime);
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
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
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
    <div className="flex flex-col items-end font-wedding-serif">
      {/* Compact, Sleek Mini Player Overlay */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="w-[220px] sm:w-[235px] bg-white/95 backdrop-blur-xl border-2 border-royal-gold/70 rounded-2xl p-3 shadow-2xl text-left relative overflow-hidden mb-2"
          >
            {/* Top gold accent line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-saffron via-bright-gold to-saffron" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-royal-gold/20 pb-1.5 mb-2">
              <span className="text-wedding-maroon font-wedding-display text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-wedding-crimson animate-pulse" />
                संगीत / Music
              </span>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-gray-400 hover:text-wedding-crimson text-[10px] font-semibold px-1 py-0.5 rounded cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Compact Current Track Card */}
            <div className="bg-gradient-to-br from-temple-cream via-white to-temple-cream/60 p-2.5 rounded-xl border border-royal-gold/30 mb-2 relative shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                {/* Mini Rotating Vinyl */}
                <div className="relative w-9 h-9 rounded-full bg-neutral-900 border border-royal-gold/60 shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                  <motion.div 
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-royal-gold to-saffron flex items-center justify-center"
                  >
                    <div className="w-1 h-1 rounded-full bg-wedding-maroon" />
                  </motion.div>
                </div>

                {/* Track Info */}
                <div className="overflow-hidden flex-1">
                  <h4 className="text-[11px] font-extrabold text-wedding-maroon truncate leading-tight">
                    {currentTrack.name}
                  </h4>
                  <p className="text-[9px] text-gray-500 truncate mt-0.5">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Mini Audio Equalizer Bar */}
              <div className="flex items-center justify-center gap-0.5 h-3.5 bg-white/80 rounded py-0.5 px-2 mb-2 border border-royal-gold/15">
                {[...Array(9)].map((_, i) => (
                  <motion.span
                    key={i}
                    animate={isPlaying ? {
                      height: [2, i % 2 === 0 ? 10 : 7, 2],
                    } : { height: 2 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.4 + (i % 3) * 0.15,
                      ease: "easeInOut",
                      repeatType: "reverse",
                      delay: i * 0.05
                    }}
                    className="w-0.75 bg-wedding-crimson rounded-full"
                  />
                ))}
              </div>

              {/* Compact Playback Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={playPrevious}
                  className="w-6 h-6 rounded-full bg-white hover:bg-amber-50 text-wedding-maroon border border-royal-gold/40 flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105 active:scale-95 transition-all"
                  title="Previous"
                >
                  <SkipBack className="w-3 h-3" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-wedding-crimson to-wedding-maroon text-bright-gold border border-royal-gold shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-bright-gold" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-bright-gold translate-x-0.5" />
                  )}
                </button>

                <button
                  onClick={playNext}
                  className="w-6 h-6 rounded-full bg-white hover:bg-amber-50 text-wedding-maroon border border-royal-gold/40 flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105 active:scale-95 transition-all"
                  title="Next"
                >
                  <SkipForward className="w-3 h-3" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-royal-gold/15 px-0.5">
                <button 
                  onClick={toggleMute} 
                  className="text-gray-400 hover:text-wedding-crimson cursor-pointer transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3 h-3 text-red-500" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-wedding-maroon" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-wedding-crimson"
                />
              </div>
            </div>

            {/* Track List */}
            <span className="text-[8px] text-gray-400 font-bold tracking-wider uppercase block mb-1 pl-0.5">
              Playlist:
            </span>

            <div className="space-y-1">
              {WEBBING_PLAYLIST.map((track, idx) => {
                if (track.type === 'synthesized') return null;
                const isActive = currentTrackIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => playTrack(idx)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg border transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-wedding-crimson/10 border-wedding-crimson/40 text-wedding-crimson font-bold shadow-2xs'
                        : 'bg-transparent border-transparent hover:bg-gray-100 text-gray-600 hover:text-wedding-maroon'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className="text-[10px] truncate leading-tight">
                        {idx + 1}. {track.name}
                      </div>
                      <div className="text-[8px] text-gray-400 truncate">
                        {track.movie}
                      </div>
                    </div>
                    {isActive && isPlaying ? (
                      <span className="w-2 h-2 rounded-full bg-wedding-crimson animate-ping shrink-0" />
                    ) : (
                      <Play className="w-2.5 h-2.5 text-gray-400 group-hover:text-wedding-crimson opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Controls */}
      <div className="flex items-center gap-2">
        {/* Playlist Toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-wedding-maroon border border-royal-gold/60 hover:border-royal-gold shadow-md flex items-center justify-center cursor-pointer transition-all duration-200"
          title="Wedding Music Playlist"
        >
          <ChevronUp className={`w-4 h-4 text-wedding-crimson transition-transform duration-300 ${showPlaylist ? 'rotate-180' : ''}`} />
        </motion.button>

        {/* Main Floating Play/Pause Pill Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          aria-label="Toggle wedding music"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-wedding-crimson via-wedding-maroon to-wedding-crimson text-bright-gold border-2 border-royal-gold shadow-xl cursor-pointer relative overflow-hidden group"
        >
          {isPlaying && (
            <span className="absolute inset-0 bg-bright-gold/15 animate-pulse" />
          )}
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            >
              <Volume2 className="w-4 h-4 text-bright-gold shrink-0" />
            </motion.div>
          ) : (
            <VolumeX className="w-4 h-4 text-bright-gold shrink-0" />
          )}
          <span className="text-[10px] md:text-xs font-bold tracking-wider font-wedding-display uppercase">
            {isPlaying ? 'Playing' : 'Music'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
