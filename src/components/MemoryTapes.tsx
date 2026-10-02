import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Film,
  Heart,
  Tv,
  Camera,
  Loader2,
  Repeat,
  RotateCw
} from 'lucide-react';

interface MemoryTapesProps {
  videoPaths: string[];
}

// ════════════════════════════════════════════════════════════════════════════
// 🔄 VIDEO ROTATION MAP (Configure custom rotation per video: 90, -90, 180, etc.)
// Tape Number : Angle in degrees (e.g. 1: 90, 4: -90, 12: 90)
// ════════════════════════════════════════════════════════════════════════════
export const VIDEO_ROTATIONS: Record<number, number> = {
  // Yahan tape number aur angle likh sakte ho:
  // 1: 90,   // Video 1 -> +90°
  // 4: -90,  // Video 4 -> -90° (anti-clockwise)
  12: -90,
  13: -90,
  14: -90,
  15: -90,
  21: -90,
  33: -90,
  35 :-90,


};

// Romantic & aesthetic retro captions cycling for all memory clips
const MEMORY_CAPTIONS = [
  { title: "Pure Unfiltered Joy", subtitle: "Candid laughter that instantly brightens up everything ✨", tag: "CANDID" },
  { title: "The Sweetest Smile", subtitle: "Radiant, genuine, and impossibly cute 🌸", tag: "SWEET" },
  { title: "Golden Hour Glow", subtitle: "Sunlit memories that feel like a warm hug ☀️", tag: "GOLDEN" },
  { title: "Vintage Soul Reel", subtitle: "Some moments deserve to be played on repeat 📼", tag: "VINTAGE" },
  { title: "Chaos & Giggles", subtitle: "The funniest, most unscripted silly moment 😂", tag: "CHAOS" },
  { title: "Midnight Whispers", subtitle: "Quiet talks, shared secrets, and late-night smiles 🌙", tag: "MIDNIGHT" },
  { title: "Living Rent-Free", subtitle: "One of my absolute favorite memory tapes 💕", tag: "CORE" },
  { title: "Pure Magic Energy", subtitle: "That rare aura that makes the world softer 💫", tag: "MAGIC" },
  { title: "Nostalgic Polaroid", subtitle: "A little snippet of happiness frozen in time 📸", tag: "RETRO" },
  { title: "Sunflower Vibes", subtitle: "Bright, lively, and constantly bringing good energy 🌻", tag: "VIBES" },
  { title: "Forever Treasured", subtitle: "A timeless memory kept safe in the heart 🧸", tag: "TREASURE" },
  { title: "Soft Aesthetic Days", subtitle: "Gentle breeze, pretty light, and sweet moments 🌷", tag: "AESTHETIC" },
];

export interface TapeItem {
  id: number;
  path: string;
  title: string;
  subtitle: string;
  tag: string;
  styleType: number;
  rotationAngle: number;
}

// ════════════════════════════════════════════════════════════════════════════
// LAZY VIDEO COMPONENT (With 90°/-90° Video Rotation & Scaling)
// ════════════════════════════════════════════════════════════════════════════
interface LazyVideoProps {
  src: string;
  isMuted: boolean;
  className?: string;
  onVideoRef?: (el: HTMLVideoElement | null) => void;
  aspectRatioClass?: string;
  rotationDegree?: number;
}

function LazyVideo({
  src,
  isMuted,
  className = "",
  onVideoRef,
  aspectRatioClass = "aspect-video",
  rotationDegree = 0
}: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        }
      },
      { rootMargin: '300px 0px', threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { });
      }
    }
  }, [isInView, isMuted]);

  // If rotated by 90 or 270 (-90), scale up to fill container smoothly without black bars
  const isPerpendicular = Math.abs(rotationDegree) % 180 !== 0;
  const transformStyle = {
    transform: `rotate(${rotationDegree}deg) scale(${isPerpendicular ? 1.42 : 1})`,
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <div ref={containerRef} className={`relative w-full ${aspectRatioClass} bg-black/80 overflow-hidden`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm z-10">
          <Loader2 className="w-6 h-6 text-dusty-rose animate-spin opacity-70" />
        </div>
      )}

      {isInView ? (
        <video
          ref={(el) => {
            videoRef.current = el;
            if (onVideoRef) onVideoRef(el);
          }}
          src={src}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          style={transformStyle}
          onEnded={(e) => {
            e.currentTarget.play().catch(() => { });
          }}
          onLoadedData={() => {
            setIsLoaded(true);
            if (videoRef.current) {
              videoRef.current.play().catch(() => { });
            }
          }}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        />
      ) : (
        <div className="w-full h-full bg-stone-950 flex items-center justify-center">
          <Film className="w-8 h-8 text-stone-700 animate-pulse" />
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// INDIVIDUAL VIDEO CARD RENDERER
// ════════════════════════════════════════════════════════════════════════════
interface VideoCardProps {
  tape: TapeItem;
  isTall?: boolean;
  isMuted: boolean;
  isLiked: boolean;
  rotationDegree: number;
  onToggleMute: (e: React.MouseEvent, id: number) => void;
  onToggleLike: (e: React.MouseEvent, id: number) => void;
  onRotate: (e: React.MouseEvent, id: number) => void;
  onOpenModal: (tapeIndex: number) => void;
  onVideoRef: (id: number, el: HTMLVideoElement | null) => void;
}

function VideoCard({
  tape,
  isTall = false,
  isMuted,
  isLiked,
  rotationDegree,
  onToggleMute,
  onToggleLike,
  onRotate,
  onOpenModal,
  onVideoRef,
}: VideoCardProps) {
  const aspectClass = isTall ? "aspect-[3/4] sm:aspect-[4/5]" : "aspect-video sm:aspect-[16/10]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotate: `${tape.rotationAngle}deg` }}
      whileHover={{
        scale: 1.02,
        rotate: 0,
        zIndex: 30,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      className="group relative rounded-2xl transition-all duration-300 w-full h-full flex flex-col justify-between"
    >
      {/* ── STYLE 0: 🎞️ RETRO 35MM FILMSTRIP REEL ── */}
      {tape.styleType === 0 && (
        <div className="bg-[#121115] text-amber-100/90 rounded-xl p-3.5 shadow-xl border border-amber-900/30 overflow-hidden relative flex flex-col justify-between h-full">
          <div className="flex items-center justify-between px-1 pb-2.5 mb-1.5 border-b border-amber-900/40 text-[10px] tracking-widest uppercase font-mono text-amber-400/70">
            <div className="flex gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-2.5 h-3 bg-black rounded-[2px] border border-amber-500/30" />
              ))}
            </div>
            <span className="font-bold">#TAPE-0{tape.id}</span>
          </div>

          <div
            onClick={() => onOpenModal(tape.id - 1)}
            className="relative rounded-lg overflow-hidden cursor-pointer group/screen border border-amber-500/20 shadow-inner flex-1 flex flex-col"
          >
            <LazyVideo
              src={tape.path}
              isMuted={isMuted}
              rotationDegree={rotationDegree}
              aspectRatioClass={aspectClass}
              onVideoRef={(el) => onVideoRef(tape.id, el)}
              className="filter sepia-[0.10] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-amber-400/40 text-[9px] font-mono text-amber-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              REEL 0{tape.id}
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
              <div className="p-3 rounded-full bg-amber-500 text-black shadow-xl transform scale-90 group-hover/screen:scale-100 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => onToggleMute(e, tape.id)}
                  className="p-1.5 rounded-full bg-black/75 hover:bg-amber-500 hover:text-black text-amber-200 backdrop-blur-md transition-all border border-amber-500/30 cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                </button>
                <button
                  onClick={(e) => onRotate(e, tape.id)}
                  className="p-1.5 rounded-full bg-black/75 hover:bg-amber-500 hover:text-black text-amber-200 backdrop-blur-md transition-all border border-amber-500/30 cursor-pointer"
                  title="Rotate Video 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={(e) => onToggleLike(e, tape.id)}
                className={`p-1.5 rounded-full backdrop-blur-md transition-all border cursor-pointer ${isLiked ? 'bg-rose-600 text-white border-rose-500' : 'bg-black/75 text-amber-200 hover:bg-rose-500/30 border-amber-500/30'
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 pt-2.5 mt-1.5 border-t border-amber-900/40 text-[10px] tracking-wider font-mono text-amber-400/70">
            <div className="flex gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-2.5 h-3 bg-black rounded-[2px] border border-amber-500/30" />
              ))}
            </div>
            <span className="italic font-sans text-amber-200/90 text-xs font-medium truncate max-w-[150px]">{tape.title}</span>
          </div>
        </div>
      )}

      {/* ── STYLE 1: 📹 90s CAMCORDER VHS VIEWFINDER ── */}
      {tape.styleType === 1 && (
        <div className="bg-[#0b0f14] rounded-2xl p-3.5 shadow-2xl border border-cyan-950/50 relative overflow-hidden flex flex-col justify-between h-full">
          <div className="flex items-center justify-between px-1 py-1 mb-1.5 text-[10px] font-mono font-bold text-cyan-400/80 tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-bold">● REC</span>
              <span className="text-cyan-200/60 ml-1.5">SP 0:0{tape.id}:18</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40 text-cyan-300">
              VHS HI-FI
            </span>
          </div>

          <div
            onClick={() => onOpenModal(tape.id - 1)}
            className="relative rounded-xl overflow-hidden cursor-pointer group/screen border border-cyan-500/20 flex-1 flex flex-col"
          >
            <LazyVideo
              src={tape.path}
              isMuted={isMuted}
              rotationDegree={rotationDegree}
              aspectRatioClass={aspectClass}
              onVideoRef={(el) => onVideoRef(tape.id, el)}
            />
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 bg-black/45 backdrop-blur-[2px]">
              <div className="px-3.5 py-1.5 rounded-full bg-cyan-500 text-black font-mono font-bold text-xs shadow-lg flex items-center gap-1.5 transform scale-90 group-hover/screen:scale-100 transition-transform">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY</span>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => onToggleMute(e, tape.id)}
                  className="p-1.5 rounded-full bg-black/75 hover:bg-cyan-500 hover:text-black text-cyan-200 backdrop-blur-md transition-all border border-cyan-500/30 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <button
                  onClick={(e) => onRotate(e, tape.id)}
                  className="p-1.5 rounded-full bg-black/75 hover:bg-cyan-500 hover:text-black text-cyan-200 backdrop-blur-md transition-all border border-cyan-500/30 cursor-pointer"
                  title="Rotate Video 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={(e) => onToggleLike(e, tape.id)}
                className={`p-1.5 rounded-full backdrop-blur-md transition-all border cursor-pointer ${isLiked ? 'bg-red-500 text-white border-red-400' : 'bg-black/75 text-cyan-200 hover:bg-red-500/30 border-cyan-500/30'
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="mt-2.5 px-1 flex items-center justify-between">
            <p className="text-xs font-mono font-medium text-cyan-200/90 truncate max-w-[180px]">
              {tape.title}
            </p>
            <span className="text-[9px] font-mono text-cyan-400/60">STEREO</span>
          </div>
        </div>
      )}

      {/* ── STYLE 2: 🌸 POLAROID & WASHI TAPE SCRAPBOOK ── */}
      {tape.styleType === 2 && (
        <div className="bg-[#FFFDF9] text-stone-800 rounded-xl p-3.5 pt-5 shadow-xl border border-stone-200/80 relative overflow-hidden flex flex-col justify-between h-full">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-rose-200/85 backdrop-blur-sm border-y border-rose-300/60 -rotate-1 shadow-sm z-10 pointer-events-none rounded-[1px] flex items-center justify-center">
            <span className="text-[8px] font-mono text-rose-800/80 tracking-wider">♥ MEMORY TAPE ♥</span>
          </div>
          <div className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md border border-white z-10" />

          <div
            onClick={() => onOpenModal(tape.id - 1)}
            className="relative rounded-lg overflow-hidden cursor-pointer group/screen shadow-inner border border-stone-300/60 mt-1 flex-1 flex flex-col"
          >
            <LazyVideo
              src={tape.path}
              isMuted={isMuted}
              rotationDegree={rotationDegree}
              aspectRatioClass={aspectClass}
              onVideoRef={(el) => onVideoRef(tape.id, el)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 bg-rose-950/30 backdrop-blur-[2px]">
              <div className="p-3 rounded-full bg-white text-rose-600 shadow-xl transform scale-90 group-hover/screen:scale-100 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => onToggleMute(e, tape.id)}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-white hover:text-stone-900 text-white backdrop-blur-md transition-all border border-white/20 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-rose-300" />}
                </button>
                <button
                  onClick={(e) => onRotate(e, tape.id)}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-white hover:text-stone-900 text-white backdrop-blur-md transition-all border border-white/20 cursor-pointer"
                  title="Rotate Video 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={(e) => onToggleLike(e, tape.id)}
                className={`p-1.5 rounded-full backdrop-blur-md transition-all border cursor-pointer ${isLiked ? 'bg-rose-500 text-white border-rose-400' : 'bg-black/60 text-white hover:bg-rose-500/40 border-white/20'
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="pt-2.5 pb-0.5 text-center">
            <p className="font-serif italic font-semibold text-sm sm:text-base text-stone-800 tracking-tight">
              {tape.title}
            </p>
            <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 font-sans line-clamp-1">
              {tape.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* ── STYLE 3: 👑 LUXURY NOIR & CHAMPAGNE GOLD ── */}
      {tape.styleType === 3 && (
        <div className="bg-gradient-to-br from-[#17141f] via-[#100d16] to-[#1f1728] text-white rounded-2xl p-3.5 shadow-2xl border border-amber-400/30 relative overflow-hidden flex flex-col justify-between h-full group/lux">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover/lux:bg-amber-400/20 transition-all" />

          <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-amber-400/20">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span className="tracking-wide uppercase text-[9px] font-bold">Special Moment</span>
            </div>
            <span className="text-[9px] font-mono text-amber-300/80 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30">
              HD REEL 0{tape.id}
            </span>
          </div>

          <div
            onClick={() => onOpenModal(tape.id - 1)}
            className="relative rounded-xl overflow-hidden cursor-pointer group/screen border border-amber-400/25 shadow-2xl flex-1 flex flex-col"
          >
            <LazyVideo
              src={tape.path}
              isMuted={isMuted}
              rotationDegree={rotationDegree}
              aspectRatioClass={aspectClass}
              onVideoRef={(el) => onVideoRef(tape.id, el)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
              <div className="p-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 text-black shadow-2xl transform scale-90 group-hover/screen:scale-100 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => onToggleMute(e, tape.id)}
                  className="p-1.5 rounded-full bg-black/75 hover:bg-amber-400 hover:text-black text-amber-200 backdrop-blur-md transition-all border border-amber-400/30 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
                </button>
                <button
                  onClick={(e) => onRotate(e, tape.id)}
                  className="p-1.5 rounded-full bg-black/75 hover:bg-amber-400 hover:text-black text-amber-200 backdrop-blur-md transition-all border border-amber-400/30 cursor-pointer"
                  title="Rotate Video 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={(e) => onToggleLike(e, tape.id)}
                className={`p-1.5 rounded-full backdrop-blur-md transition-all border cursor-pointer ${isLiked ? 'bg-rose-500 text-white border-rose-400' : 'bg-black/75 text-amber-200 hover:bg-rose-500/30 border-amber-400/30'
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="mt-2.5">
            <h4 className="text-xs sm:text-sm font-display font-semibold text-amber-100 truncate">
              {tape.title}
            </h4>
            <p className="text-[10px] sm:text-xs text-amber-200/60 line-clamp-1 mt-0.5">
              {tape.subtitle}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN MEMORY TAPES SECTION COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export function MemoryTapes({ videoPaths }: MemoryTapesProps) {
  const tapes: TapeItem[] = useMemo(() => {
    return videoPaths.slice(1).map((path, index) => {
      const captionData = MEMORY_CAPTIONS[index % MEMORY_CAPTIONS.length];
      const styleType = index % 4;
      const rotationAngle = index % 2 === 0 ? (index % 4 === 0 ? -1.0 : 1.2) : (index % 3 === 0 ? -0.8 : 0.9);

      return {
        id: index + 1,
        path,
        title: captionData.title,
        subtitle: captionData.subtitle,
        tag: captionData.tag,
        styleType,
        rotationAngle,
      };
    });
  }, [videoPaths]);

  // States
  const [activeFilter, setActiveFilter] = useState<'all' | 'film' | 'vhs' | 'polaroid' | 'luxury'>('all');
  const [selectedTapeIndex, setSelectedTapeIndex] = useState<number | null>(null);
  const [mutedStates, setMutedStates] = useState<{ [key: number]: boolean }>({});
  const [likedTapes, setLikedTapes] = useState<{ [key: number]: boolean }>({});
  const [rotationDegrees, setRotationDegrees] = useState<{ [key: number]: number }>({});
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [globalMute, setGlobalMute] = useState<boolean>(true);

  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  // Helper to get effective rotation angle (Config map + Live state)
  const getRotation = (id: number) => {
    if (rotationDegrees[id] !== undefined) {
      return rotationDegrees[id];
    }
    return VIDEO_ROTATIONS[id] || 0;
  };

  // Toggle/advance rotation (+90deg)
  const handleRotate = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const current = getRotation(id);
    const nextRotation = (current + 90) % 360;
    setRotationDegrees(prev => ({ ...prev, [id]: nextRotation }));
  };

  // Filtered tapes
  const filteredTapes = useMemo(() => {
    if (activeFilter === 'film') return tapes.filter(t => t.styleType === 0);
    if (activeFilter === 'vhs') return tapes.filter(t => t.styleType === 1);
    if (activeFilter === 'polaroid') return tapes.filter(t => t.styleType === 2);
    if (activeFilter === 'luxury') return tapes.filter(t => t.styleType === 3);
    return tapes;
  }, [tapes, activeFilter]);

  const displayedTapes = useMemo(() => {
    return filteredTapes.slice(0, visibleCount);
  }, [filteredTapes, visibleCount]);

  // Bento Clusters of 3: [Tall, StackTop, StackBottom]
  const bentoClusters = useMemo(() => {
    const clusters: {
      type: 'left-tall' | 'right-tall' | 'duo' | 'single';
      tallTape: TapeItem;
      stackedTapes: TapeItem[];
      allTapes: TapeItem[];
    }[] = [];

    for (let i = 0; i < displayedTapes.length; i += 3) {
      const chunk = displayedTapes.slice(i, i + 3);
      if (chunk.length === 3) {
        const isLeftTall = (Math.floor(i / 3) % 2 === 0);
        clusters.push({
          type: isLeftTall ? 'left-tall' : 'right-tall',
          tallTape: chunk[0],
          stackedTapes: [chunk[1], chunk[2]],
          allTapes: chunk,
        });
      } else if (chunk.length === 2) {
        clusters.push({
          type: 'duo',
          tallTape: chunk[0],
          stackedTapes: [chunk[1]],
          allTapes: chunk,
        });
      } else if (chunk.length === 1) {
        clusters.push({
          type: 'single',
          tallTape: chunk[0],
          stackedTapes: [],
          allTapes: chunk,
        });
      }
    }
    return clusters;
  }, [displayedTapes]);

  const toggleMute = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const vid = videoRefs.current[id];
    if (vid) {
      const newMuted = !vid.muted;
      vid.muted = newMuted;
      setMutedStates(prev => ({ ...prev, [id]: newMuted }));
    }
  };

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setLikedTapes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Keyboard controls for Lightbox (Circular Loop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedTapeIndex === null) return;
      if (e.key === 'Escape') setSelectedTapeIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedTapeIndex(prev => (prev !== null && prev < tapes.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedTapeIndex(prev => (prev !== null && prev > 0 ? prev - 1 : tapes.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTapeIndex, tapes.length]);

  if (tapes.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-surface-container-low/30 via-surface-container/20 to-surface-container-low/40">
      {/* Ambient Background Gradients */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-dusty-rose/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-subtle-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dusty-rose/10 border border-dusty-rose/25 text-dusty-rose text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm backdrop-blur-sm"
          >
            <Repeat className="w-3.5 h-3.5 animate-spin-slow text-dusty-rose" />
            <span>Continuous Motion Archive & Tapes</span>
            <Sparkles className="w-3.5 h-3.5 text-subtle-gold" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl lg:text-6xl text-on-background font-bold tracking-tight mb-4"
          >
            Our Motion Archive 
          </motion.h2>

          <p className="font-note text-on-surface-variant text-base md:text-lg leading-relaxed italic max-w-xl mx-auto font-light">
            Because some memories are too alive to stay still — every candid laugh, sweet glance, and joyful moment frozen in motion forever. 🌷
          </p>

          {/* Filter Pills */}
          {/* <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
            {[
              { id: 'all', label: `All Tapes (${tapes.length})` },
              { id: 'film', label: '🎞️ 35mm Film' },
              { id: 'vhs', label: '📹 Camcorder VHS' },
              { id: 'polaroid', label: '🌸 Polaroid Tapes' },
              { id: 'luxury', label: '👑 Golden Noir' },
            ].map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id as any);
                    setVisibleCount(12);
                  }}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${active
                      ? 'bg-dusty-rose text-white shadow-lg shadow-dusty-rose/25 scale-105'
                      : 'bg-surface-container-lowest/80 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/60 border border-surface-variant/40'
                    }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div> */}
        </div>

        {/* ════════════════════════════════════════════════════════════
            BENTO CLUSTERS (Left Tall + Right 2 Stacked Cards)
        ════════════════════════════════════════════════════════════ */}
        <div className="space-y-8 md:space-y-10">
          {bentoClusters.map((cluster, clusterIdx) => {
            if (cluster.type === 'left-tall') {
              return (
                <div key={clusterIdx} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  <div className="md:col-span-6 lg:col-span-7 flex">
                    <VideoCard
                      tape={cluster.tallTape}
                      isTall={true}
                      isMuted={mutedStates[cluster.tallTape.id] ?? globalMute}
                      isLiked={likedTapes[cluster.tallTape.id] ?? false}
                      rotationDegree={getRotation(cluster.tallTape.id)}
                      onToggleMute={toggleMute}
                      onToggleLike={toggleLike}
                      onRotate={handleRotate}
                      onOpenModal={setSelectedTapeIndex}
                      onVideoRef={(id, el) => { videoRefs.current[id] = el; }}
                    />
                  </div>
                  <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between gap-6">
                    {cluster.stackedTapes.map((tape) => (
                      <div key={tape.id} className="flex-1 flex">
                        <VideoCard
                          tape={tape}
                          isTall={false}
                          isMuted={mutedStates[tape.id] ?? globalMute}
                          isLiked={likedTapes[tape.id] ?? false}
                          rotationDegree={getRotation(tape.id)}
                          onToggleMute={toggleMute}
                          onToggleLike={toggleLike}
                          onRotate={handleRotate}
                          onOpenModal={setSelectedTapeIndex}
                          onVideoRef={(id, el) => { videoRefs.current[id] = el; }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (cluster.type === 'right-tall') {
              return (
                <div key={clusterIdx} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between gap-6 order-2 md:order-1">
                    {cluster.stackedTapes.map((tape) => (
                      <div key={tape.id} className="flex-1 flex">
                        <VideoCard
                          tape={tape}
                          isTall={false}
                          isMuted={mutedStates[tape.id] ?? globalMute}
                          isLiked={likedTapes[tape.id] ?? false}
                          rotationDegree={getRotation(tape.id)}
                          onToggleMute={toggleMute}
                          onToggleLike={toggleLike}
                          onRotate={handleRotate}
                          onOpenModal={setSelectedTapeIndex}
                          onVideoRef={(id, el) => { videoRefs.current[id] = el; }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="md:col-span-6 lg:col-span-7 flex order-1 md:order-2">
                    <VideoCard
                      tape={cluster.tallTape}
                      isTall={true}
                      isMuted={mutedStates[cluster.tallTape.id] ?? globalMute}
                      isLiked={likedTapes[cluster.tallTape.id] ?? false}
                      rotationDegree={getRotation(cluster.tallTape.id)}
                      onToggleMute={toggleMute}
                      onToggleLike={toggleLike}
                      onRotate={handleRotate}
                      onOpenModal={setSelectedTapeIndex}
                      onVideoRef={(id, el) => { videoRefs.current[id] = el; }}
                    />
                  </div>
                </div>
              );
            }

            if (cluster.type === 'duo') {
              return (
                <div key={clusterIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {cluster.allTapes.map((tape) => (
                    <div key={tape.id} className="flex">
                      <VideoCard
                        tape={tape}
                        isTall={false}
                        isMuted={mutedStates[tape.id] ?? globalMute}
                        isLiked={likedTapes[tape.id] ?? false}
                        rotationDegree={getRotation(tape.id)}
                        onToggleMute={toggleMute}
                        onToggleLike={toggleLike}
                        onRotate={handleRotate}
                        onOpenModal={setSelectedTapeIndex}
                        onVideoRef={(id, el) => { videoRefs.current[id] = el; }}
                      />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div key={clusterIdx} className="max-w-xl mx-auto flex">
                <VideoCard
                  tape={cluster.tallTape}
                  isTall={false}
                  isMuted={mutedStates[cluster.tallTape.id] ?? globalMute}
                  isLiked={likedTapes[cluster.tallTape.id] ?? false}
                  rotationDegree={getRotation(cluster.tallTape.id)}
                  onToggleMute={toggleMute}
                  onToggleLike={toggleLike}
                  onRotate={handleRotate}
                  onOpenModal={setSelectedTapeIndex}
                  onVideoRef={(id, el) => { videoRefs.current[id] = el; }}
                />
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredTapes.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-14"
          >
            <button
              onClick={() => setVisibleCount(prev => Math.min(prev + 12, filteredTapes.length))}
              className="px-8 py-4 rounded-full bg-surface-container-lowest text-on-surface hover:bg-dusty-rose hover:text-white border border-dusty-rose/30 shadow-lg hover:shadow-xl hover:shadow-dusty-rose/20 transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 cursor-pointer group"
            >
              <Film className="w-4 h-4 text-dusty-rose group-hover:text-white transition-colors" />
              <span>Unlock More Memory Tapes (+{filteredTapes.length - visibleCount} remaining)</span>
              <Sparkles className="w-4 h-4 text-subtle-gold group-hover:rotate-12 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════
          FULLSCREEN CINEMA THEATER MODAL
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedTapeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedTapeIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-stone-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-stone-900/80 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <h3 className="text-white font-display font-semibold text-base md:text-lg">
                      {tapes[selectedTapeIndex].title}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono">
                      REEL #{tapes[selectedTapeIndex].id} OF {tapes.length} • {tapes[selectedTapeIndex].tag}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* <button
                    onClick={(e) => handleRotate(e, tapes[selectedTapeIndex].id)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs px-3"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Rotate 90°</span>
                  </button> */}

                  <button
                    onClick={() => setSelectedTapeIndex(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Theater Video with Circular Auto-Advance & Rotation */}
              <div
                onClick={() => {
                  if (modalVideoRef.current) {
                    if (modalVideoRef.current.paused) {
                      modalVideoRef.current.play();
                    } else {
                      modalVideoRef.current.pause();
                    }
                  }
                }}
                className="relative aspect-video max-h-[65vh] bg-black flex items-center justify-center overflow-hidden cursor-pointer"
              >
                <video
                  ref={modalVideoRef}
                  key={tapes[selectedTapeIndex].path}
                  src={tapes[selectedTapeIndex].path}
                  autoPlay
                  playsInline
                  style={{
                    transform: `rotate(${getRotation(tapes[selectedTapeIndex].id)}deg) scale(${Math.abs(getRotation(tapes[selectedTapeIndex].id)) % 180 !== 0 ? 1.45 : 1})`,
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onEnded={() => {
                    setSelectedTapeIndex(prev => (prev !== null && prev < tapes.length - 1 ? prev + 1 : 0));
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="px-6 py-4 bg-stone-900/90 border-t border-white/10 flex items-center justify-between">
                <p className="text-sm text-stone-300 italic font-serif max-w-md hidden sm:block">
                  "{tapes[selectedTapeIndex].subtitle}"
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={() => setSelectedTapeIndex(prev => (prev !== null && prev > 0 ? prev - 1 : tapes.length - 1))}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-xs font-mono text-stone-400">
                    {selectedTapeIndex + 1} / {tapes.length}
                  </span>

                  <button
                    onClick={() => setSelectedTapeIndex(prev => (prev !== null && prev < tapes.length - 1 ? prev + 1 : 0))}
                    className="px-4 py-2 rounded-lg bg-dusty-rose hover:bg-dusty-rose/90 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
