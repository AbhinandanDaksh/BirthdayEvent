import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { FaHeart, FaStar, FaArrowUp, FaImages, FaSeedling, FaArrowRight, FaFilm, FaWhatsapp, FaCopy, FaCheck, FaPaperPlane, FaCalendarAlt, FaTimes, FaSearchPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import './App.css';

function FadeIn({ children, delay = 0, className = "", style = {}, viewportMargin = "-100px", as = "div", ...props }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}

// Configurable content for the birthday letter
const birthdayConfig = {
  name: "Diva",
  wishes: [
    "Peaceful mornings filled with sunshine",
    "Genuine smiles that light up your day",
    "Exciting new adventures and success",
    "Heartfelt appreciation from people around you",
    "A year that feels uniquely and beautifully YOU"
  ],
  envelopes: [
    { type: "Happy", message: "Keep glowing! Your joy and laughter are truly contagious." },
    { type: "Smile", message: "You have the kind of radiant smile that brightens up the entire room." },
    { type: "Motivation", message: "You are stronger, braver, and far more capable than you will ever know." },
    { type: "Curious", message: "Never lose that wonderful spark of curiosity and childish wonder." }
  ],
  finalMessage: "Happy Birthday. 🌷"
};

// Dynamically import all images and videos from src/assets/images
const imageModules = import.meta.glob<{ default: string }>('./assets/images/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true });
const imagePaths: string[] = Object.values(imageModules).map(mod => mod.default);

const videoModules = import.meta.glob<{ default: string }>('./assets/images/*.mp4', { eager: true });
const videoPaths: string[] = Object.values(videoModules).map(mod => mod.default);

const audioModules = import.meta.glob<{ default: string }>('./assets/images/*.mp3', { eager: true });
const audioPaths: string[] = Object.values(audioModules).map(mod => mod.default);

function App() {
  // Page states
  const [introOpen, setIntroOpen] = useState(true);
  const [introFade, setIntroFade] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const scrapbookCaptions = useMemo(() => [
    "A cherished moment ✨",
    "Smiles that brighten my day 🌷",
    "Unfiltered happiness 💫",
    "A memory worth holding onto 📸",
    "Pure sunshine & laughter ☀️",
    "The quiet, beautiful moments 🌸",
    "One of my absolute favorites 💕",
    "Forever special in my heart 🧸"
  ], []);

  // Movie Carousel States (Multi-Card 100% Width Circular Strip)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const movieCarouselRef = useRef(null);

  const movieChapters = useMemo(() => [
    { num: "01", title: "The Quiet Beginning", text: "A fresh sheet of paper, filled with silent potential and hopes waiting to take root." },
    { num: "02", title: "Unexpected Twists", text: "The beautiful surprises, laughter at midnight, and spontaneous trips that made it all worthwhile." },
    { num: "03", title: "Stitched Memories", text: "The milestones achieved, lessons learned, and the connections that became even tighter." },
    { num: "04", title: "The Golden Days", text: "Warm afternoons, sunny conversations, and memories that stay permanently engraved in our hearts." },
    { num: "05", title: "Full Circle", text: "The people, places, and little rituals that made this journey feel like coming home." },
    { num: "06", title: "What Lies Ahead", text: "The next unwritten pages, filled with endless adventures and stories waiting for you to live them." },
  ], []);

  // Seamless Multi-Card Circular Auto-Advance
  useEffect(() => {
    if (isCarouselPaused) return;

    const interval = setInterval(() => {
      if (movieCarouselRef.current) {
        const container = movieCarouselRef.current;
        const card = container.children[0];
        if (!card) return;
        const step = card.offsetWidth + 24; // card width + gap-6
        const singleSetWidth = movieChapters.length * step;

        // If reached or past the first set of 6 cards, seamlessly reset to start
        if (container.scrollLeft >= singleSetWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setActiveChapterIndex(0);
        } else {
          container.scrollBy({ left: step, behavior: 'smooth' });
          setActiveChapterIndex((prev) => (prev + 1) % movieChapters.length);
        }
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isCarouselPaused, movieChapters.length]);

  const handleCarouselScroll = () => {
    if (movieCarouselRef.current) {
      const container = movieCarouselRef.current;
      const card = container.children[0];
      if (!card) return;
      const step = card.offsetWidth + 24;
      const rawIndex = Math.round(container.scrollLeft / step);
      const normalizedIndex = rawIndex % movieChapters.length;
      if (normalizedIndex !== activeChapterIndex) {
        setActiveChapterIndex(normalizedIndex);
      }
    }
  };

  const scrollToChapter = (index) => {
    setActiveChapterIndex(index);
    if (movieCarouselRef.current) {
      const container = movieCarouselRef.current;
      const card = container.children[0];
      if (!card) return;
      const step = card.offsetWidth + 24;
      container.scrollTo({ left: index * step, behavior: 'smooth' });
    }
  };

  const scrollPrevChapter = () => {
    if (movieCarouselRef.current) {
      const container = movieCarouselRef.current;
      const card = container.children[0];
      if (!card) return;
      const step = card.offsetWidth + 24;
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: (movieChapters.length - 1) * step, behavior: 'smooth' });
        setActiveChapterIndex(movieChapters.length - 1);
      } else {
        container.scrollBy({ left: -step, behavior: 'smooth' });
        setActiveChapterIndex((prev) => (prev - 1 + movieChapters.length) % movieChapters.length);
      }
    }
  };

  const scrollNextChapter = () => {
    if (movieCarouselRef.current) {
      const container = movieCarouselRef.current;
      const card = container.children[0];
      if (!card) return;
      const step = card.offsetWidth + 24;
      const singleSetWidth = movieChapters.length * step;
      if (container.scrollLeft >= singleSetWidth - step - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setActiveChapterIndex(0);
      } else {
        container.scrollBy({ left: step, behavior: 'smooth' });
        setActiveChapterIndex((prev) => (prev + 1) % movieChapters.length);
      }
    }
  };

  // Envelopes states
  const [openedEnvelopes, setOpenedEnvelopes] = useState({});

  // Stars (Wish) states
  const [clickedStars, setClickedStars] = useState({});
  const [wishMessage, setWishMessage] = useState("");
  const [showWishMessage, setShowWishMessage] = useState(false);

  // Final surprise sequence
  const [surpriseStep, setSurpriseStep] = useState(0);
  const [surpriseEnded, setSurpriseEnded] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [particles, setParticles] = useState([]);

  // Timeline Scroll Progress
  const timelineRef = useRef(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 75%"]
  });

  const timelineMilestones = useMemo(() => [
    {
      date: "The Beginning",
      badge: "Chapter 01",
      title: "The Very First Spark",
      memory: "Where it all began — the very first conversation, the initial smiles, and a connection that instantly felt warm and effortless.",
      photoIdx: 0,
      tag: "The Spark ✨",
      icon: "auto_awesome"
    },
    {
      date: "Unforgettable Days",
      badge: "Chapter 02",
      title: "Late Night Talks & Endless Laughs",
      memory: "From random midnight messages to sharing daily little updates. All those moments that turned ordinary days into cherished memories.",
      photoIdx: 1,
      tag: "Comfort & Joy ☕",
      icon: "favorite"
    },
    {
      date: "Growing Closer",
      badge: "Chapter 03",
      title: "Standing By Each Other",
      memory: "Through every high and low, celebrating small wins and always being a safe corner to share anything without hesitation.",
      photoIdx: 2,
      tag: "Special Bond 🌷",
      icon: "eco"
    },
    {
      date: "Today",
      badge: "Special Milestone",
      title: "Celebrating You 💕",
      memory: "A day dedicated entirely to you. Looking back at all the memories we've made and smiling at how wonderful you truly are.",
      photoIdx: 3,
      tag: "Birthday Girl 👑",
      icon: "cake"
    },
    {
      date: "Next & Beyond",
      badge: "Unwritten Pages",
      title: "The Best Is Yet To Come",
      memory: "More trips, more spontaneous adventures, more heartfelt conversations, and countless more reasons to laugh together.",
      photoIdx: 4,
      tag: "Forever Ahead 🚀",
      icon: "star"
    }
  ], []);

  // Interactive Sticker Note states
  const [selectedSticker, setSelectedSticker] = useState(0);
  const [copiedSticker, setCopiedSticker] = useState(false);
  const [customStickerNote, setCustomStickerNote] = useState("");

  const stickerList = useMemo(() => [
    {
      emoji: "🌸",
      tag: "Thinking Of You",
      color: "bg-rose-50 border-rose-200 text-rose-800",
      text: "Hey! Bas aise hi teri yaad aayi toh socha yeh sticker share kar dun... Hope you're smiling today! 🌷"
    },
    {
      emoji: "☕",
      tag: "Chai / Coffee Talk",
      color: "bg-amber-50 border-amber-200 text-amber-900",
      text: "Hey, chai/coffee break pe baat karne ka mann kar raha hai... Free ho toh batana! ☕✨"
    },
    {
      emoji: "💭",
      tag: "Kuch Kehna Tha",
      color: "bg-purple-50 border-purple-200 text-purple-900",
      text: "Hey! Ek baat share karni thi aapse jab bhi aap free ho... 💌"
    },
    {
      emoji: "✨",
      tag: "Thank You Note",
      color: "bg-yellow-50 border-yellow-200 text-yellow-900",
      text: "Yeh webpage dekh kar dil khush ho gaya! Thank you so much for this beautiful little world. 💕"
    },
    {
      emoji: "🧸",
      tag: "Need A Friend",
      color: "bg-blue-50 border-blue-200 text-blue-900",
      text: "Thoda busy/exhausted feel ho raha tha... bas aise hi kisi khas se baat karni thi. 🤗"
    }
  ], []);

  const handleCopySticker = (message) => {
    const finalMsg = customStickerNote.trim() ? `${message}\n\n"${customStickerNote.trim()}"` : message;
    navigator.clipboard.writeText(finalMsg);
    setCopiedSticker(true);
    setTimeout(() => setCopiedSticker(false), 2500);
  };

  const handleShareWhatsapp = (message) => {
    const finalMsg = customStickerNote.trim() ? `${message}\n\n"${customStickerNote.trim()}"` : message;
    const encoded = encodeURIComponent(finalMsg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const audioRef = useRef(null);

  // Background music audio initialization
  useEffect(() => {
    const songUrl = audioPaths[0] || 'https://assets.mixkit.co/music/preview/mixkit-delicate-piano-126.mp3';
    audioRef.current = new Audio(songUrl);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Lock scroll when intro overlay is open
  useEffect(() => {
    if (introOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [introOpen]);
  // Toggle Background Music
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio playback blocked initially: ", err);
      });
    }
  };

  // Open Door handler
  const handleOpenDoor = () => {
    setIntroFade(true);
    // Play music automatically upon opening the door as a response to user action
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => console.log("Audio block: ", err));
    }
    setTimeout(() => {
      setIntroOpen(false);
    }, 1500); // Wait for transition fade-out to complete
  };

  // Toggle individual envelopes
  const toggleEnvelope = (index) => {
    setOpenedEnvelopes((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Unfold secret note
  const handleOpenNote = () => {
    if (!noteOpen) {
      setNoteOpen(true);
    }
  };

  // Generate star field points once (20 stars)
  const starField = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 80 + 10}%`,
      size: `${Math.random() * 10 + 12}px`
    }));
  }, []);

  // Handle clicking a star
  const handleStarClick = (id) => {
    if (clickedStars[id]) return;
    setClickedStars((prev) => {
      const next = { ...prev, [id]: true };
      const count = Object.keys(next).length;
      if (count === 5) {
        setWishMessage("You found the secret. Okay, now you really have to smile! 😌");
      } else {
        setWishMessage("I hope it comes true ✨");
      }
      setShowWishMessage(true);
      return next;
    });
  };

  // Star wish message autohide
  useEffect(() => {
    if (showWishMessage) {
      const timer = setTimeout(() => {
        setShowWishMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWishMessage]);

  // Fallback image helper if some array positions are out of bounds
  const getImageUrl = (index, fallbackIndex) => {
    if (imagePaths[index]) return imagePaths[index];

    const fallbacks = [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600", // flower
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600", // tea cozy
      "https://images.unsplash.com/photo-1517263904838-7fa9aa49afb3?q=80&w=600", // lights
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600"  // abstract gold
    ];
    return fallbacks[fallbackIndex % fallbacks.length];
  };

  // Multi-step surprise triggers
  const surpriseSequence = ["Wait...", "One more thing.", "You deserve to be celebrated."];

  const handleSurpriseClick = () => {
    if (surpriseStep < surpriseSequence.length - 1) {
      setSurpriseStep((prev) => prev + 1);
    } else if (surpriseStep === surpriseSequence.length - 1) {
      setSurpriseEnded(true);

      const newParticles = Array.from({ length: 45 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 280 + 120;
        return {
          id: i,
          color: i % 2 === 0 ? '#FBDEDE' : '#D9B76A',
          size: Math.random() * 6 + 4,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
          delay: Math.random() * 0.15,
          duration: Math.random() * 1.5 + 1.2
        };
      });
      setParticles(newParticles);

      setTimeout(() => {
        setBurstActive(true);
      }, 50);
    }
  };

  return (
    <div className="bg-warm-cream text-on-background font-body select-none">

      {/* FIXED TOP APP BAR */}
      <header className="fixed top-0 w-full z-40 backdrop-blur-md bg-warm-cream/80 border-b border-soft-lavender/10">
        <div className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
          <button
            aria-label="Menu"
            className="text-dusty-rose hover:text-subtle-gold transition-colors duration-300 hover:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined">door_front</span>
          </button>

          <h1 className="font-display italic text-2xl md:text-3xl text-dusty-rose text-center font-semibold">
            A Tiny World Made Just For Her
          </h1>

          <button
            onClick={togglePlay}
            aria-label="Music"
            className={`text-dusty-rose hover:text-subtle-gold transition-colors duration-300 hover:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high ${isPlaying ? 'bg-surface-container-low' : ''}`}
          >
            <span className="material-symbols-outlined">{isPlaying ? 'volume_up' : 'music_note'}</span>
          </button>
        </div>
      </header>

      {/* INTRO OVERLAY */}
      {introOpen && (
        <div
          className={`fixed inset-0 z-50 bg-warm-cream flex flex-col items-center justify-center transition-all duration-[1500ms] ${introFade ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'
            }`}
        >
          <div className="relative z-10 text-center px-6 max-w-md mx-auto flex flex-col items-center gap-6">
            <p className="font-display text-3xl md:text-4xl text-dusty-rose italic font-medium leading-relaxed">
              I made a little something for you...
              <span className="font-body text-base text-on-surface-variant block mt-4 font-normal">
                But first, you have to open it.
              </span>
            </p>

            <button
              onClick={handleOpenDoor}
              className="group relative px-8 py-4 mt-4 bg-surface-container-lowest text-dusty-rose rounded-full font-semibold text-xs tracking-widest shadow-[0_4px_20px_rgba(124,84,84,0.1)] hover:shadow-[0_8px_30px_rgba(124,84,84,0.2)] hover:scale-105 transition-all duration-500 overflow-hidden border border-soft-lavender/50 uppercase flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Open <span className="material-symbols-outlined text-[16px] animate-[spin_4s_linear_infinite]">auto_awesome</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blush-pink/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(#CEC2D9_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        </div>
      )}

      {/* MAIN CONTENT JOURNEY */}
      <main className={`relative z-0 pt-24 transition-opacity duration-1000 ${introOpen ? 'opacity-0' : 'opacity-100'}`}>

        {/* Section 1: Introduction Greeting */}
        <section className="min-h-[70vh] flex items-center justify-center py-16 px-6 relative overflow-hidden">
          <div className="absolute -right-20 top-20 w-64 h-64 bg-blush-pink/20 rounded-full blur-3xl" />
          <div className="absolute -left-20 bottom-20 w-64 h-64 bg-soft-lavender/20 rounded-full blur-3xl" />

          <FadeIn className="max-w-3xl mx-auto text-center z-10">
            <p className="font-note text-lg text-on-surface-variant mb-4 italic">
              Today isn't just another day...
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-dusty-rose mb-8 font-semibold">
              It's YOUR day. 💕
            </h2>
            <p className="font-display text-2xl text-on-secondary-container italic">
              Happy Birthday.
            </p>
            <div className="mt-12 flex justify-center">
              <div className="w-px h-24 bg-gradient-to-b from-subtle-gold/50 to-transparent" />
            </div>
          </FadeIn>
        </section>

        {/* Section 2: A Few Things About You */}
        <section className="py-20 px-6 relative bg-surface-container-low/20">
          <div className="max-w-5xl mx-auto">
            <FadeIn className="font-display text-3xl md:text-4xl text-dusty-rose text-center mb-16 font-semibold">
              A Few Things About You
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <FadeIn className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-variant/50 hover:-translate-y-2 transition-transform duration-500">
                <h3 className="font-display text-xl text-on-surface mb-3 font-semibold">Your Smile</h3>
                <p className="text-on-surface-variant font-light leading-relaxed">
                  The kind that instantly makes any ordinary moment feel a little warmer and better.
                </p>
              </FadeIn>
              <FadeIn delay={0.1} className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-variant/50 hover:-translate-y-2 transition-transform duration-500">
                <h3 className="font-display text-xl text-on-surface mb-3 font-semibold">Your Kindness</h3>
                <p className="text-on-surface-variant font-light leading-relaxed">
                  A subtle and genuine warmth that deserves to be appreciated and noticed more often.
                </p>
              </FadeIn>
              <FadeIn delay={0.2} className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-variant/50 hover:-translate-y-2 transition-transform duration-500">
                <h3 className="font-display text-xl text-on-surface mb-3 font-semibold">Your Energy</h3>
                <p className="text-on-surface-variant font-light leading-relaxed">
                  A wonderfully unique presence that fills spaces and always leaves a memorable trace.
                </p>
              </FadeIn>
              <FadeIn delay={0.3} className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-variant/50 hover:-translate-y-2 transition-transform duration-500">
                <h3 className="font-display text-xl text-on-surface mb-3 font-semibold">The Way You Are</h3>
                <p className="text-on-surface-variant font-light leading-relaxed">
                  Unapologetically genuine, kind-hearted, and simply, wonderfully you.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Section 3: If This Year Was a Movie (100% Width Multi-Card Circular Auto-Carousel) */}
        <section
          className="py-24 relative overflow-hidden bg-surface-container-low/10 w-full"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          onTouchStart={() => setIsCarouselPaused(true)}
          onTouchEnd={() => setIsCarouselPaused(false)}
        >
          <FadeIn className="max-w-5xl mx-auto px-6 mb-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blush-pink/40 border border-dusty-rose/20 text-dusty-rose text-xs uppercase font-bold tracking-widest mb-3">
              <FaFilm className="text-xs text-subtle-gold" />
              <span>Cinematic Chapters</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-dusty-rose font-semibold">
              If This Year Was a Movie
            </h2>
          </FadeIn>

          <FadeIn className="text-center mb-8 px-6">
            <p className="font-note text-sm text-on-surface-variant/70 italic flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-subtle-gold animate-ping" />
              Auto-scrolling circular chapters • Hover to pause or swipe freely
            </p>
          </FadeIn>

          {/* 100% Full-Width Multi-Card Carousel Track (4 Cards visible on desktop, no side buttons) */}
          <div className="relative w-full px-4 md:px-8">

            {/* Horizontal Scrolling Card Track */}
            <div
              ref={movieCarouselRef}
              onScroll={handleCarouselScroll}
              className="flex overflow-x-auto hide-scrollbar gap-6 px-2 md:px-4 pb-8 pt-4 snap-x snap-mandatory scroll-smooth w-full"
            >
              {[...movieChapters, ...movieChapters].map((chapter, idx) => {
                const normalizedIdx = idx % movieChapters.length;
                const isActive = activeChapterIndex === normalizedIdx;

                return (
                  <div
                    key={`${chapter.num}-${idx}`}
                    onClick={() => scrollToChapter(normalizedIdx)}
                    className={`group w-[82vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] snap-start p-7 md:p-8 rounded-2xl transition-all duration-500 relative overflow-hidden flex-shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-surface-container-lowest shadow-[0_12px_40px_rgba(124,84,84,0.12)] border-2 border-dusty-rose/40 scale-[1.02]'
                        : 'bg-surface-container-lowest/85 shadow-[0_4px_20px_rgba(124,84,84,0.04)] border border-surface-variant/50 opacity-90 hover:opacity-100 hover:scale-[1.01]'
                    }`}
                  >
                    {/* Chapter Number Watermark */}
                    <div className="absolute -right-4 -top-4 font-display text-8xl text-dusty-rose/[0.05] font-bold select-none pointer-events-none">
                      {chapter.num}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-2">
                          <FaFilm className="text-subtle-gold text-xs" />
                          <div className="font-semibold text-xs tracking-widest text-subtle-gold uppercase">
                            Chapter {chapter.num}
                          </div>
                        </div>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-dusty-rose animate-pulse" />
                        )}
                      </div>

                      <h3 className="font-display text-xl text-on-surface mb-3 font-semibold group-hover:text-dusty-rose transition-colors duration-300">
                        {chapter.title}
                      </h3>

                      <p className="font-note text-on-surface-variant text-sm font-light leading-relaxed italic">
                        "{chapter.text}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Circular Progress Indicator Dots (01 to 06) */}
            <div className="flex items-center justify-center gap-2.5 mt-4 mb-2">
              {movieChapters.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToChapter(i)}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    i === activeChapterIndex
                      ? 'w-9 bg-dusty-rose shadow-xs'
                      : 'w-2 bg-dusty-rose/25 hover:bg-dusty-rose/50'
                  }`}
                  aria-label={`Go to chapter ${i + 1}`}
                />
              ))}
            </div>

          </div>

          <FadeIn className="text-center mt-6 px-6 flex items-center justify-center gap-2">
            <HiSparkles className="text-subtle-gold text-sm" />
            <p className="font-note text-lg text-dusty-rose italic font-medium">
              And somehow, the best chapter hasn't even happened yet.
            </p>
          </FadeIn>
        </section>

        {/* Section 4: Memory Polaroids */}
        {/* Section 4: Memory Polaroids */}
        <section className="py-20 px-6 relative bg-surface-variant/20">
          <div className="max-w-5xl mx-auto">
            <FadeIn className="font-display text-3xl md:text-4xl text-dusty-rose text-center mb-16 font-semibold" as="h2">
              Memory Polaroids
            </FadeIn>

            <div className="relative min-h-[1100px] w-full flex items-center justify-center flex-wrap gap-12">

              {/* Thread / String — single continuous path touching all 5 pins in order */}
              <svg
                className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
                viewBox="0 0 1024 1100"
                preserveAspectRatio="none"
              >
                <path
                  d="M 169,8
       Q 502,140 835,12
       Q 650,260 512,410
       Q 340,470 189,610
       Q 520,700 855,545"
                  fill="none"
                  stroke="#b08968"
                  strokeWidth="2"
                  strokeDasharray="1"
                  opacity="0.55"
                />
              </svg>

              {/* Polaroid 1 - top left */}
              <FadeIn className="polaroid bg-white p-4 pb-12 shadow-md transform rotate-[-4deg] md:absolute md:top-0 md:left-[4%] w-64 border border-surface-variant/10 z-10">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-dusty-rose/80 shadow-sm"></span>
                <div className="aspect-square bg-surface-container-low mb-4 overflow-hidden rounded-sm relative">
                  <img alt="Memory 1" className="w-full h-full object-cover" src={getImageUrl(0, 0)} />
                </div>
                <p className="font-note text-center text-on-surface-variant text-base italic">A beautiful snapshot.</p>
              </FadeIn>

              {/* Polaroid 2 - top right */}
              <FadeIn delay={0.1} className="polaroid bg-white p-4 pb-12 shadow-md transform rotate-[5deg] md:absolute md:top-6 md:right-[6%] w-64 border border-surface-variant/10 z-10">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-dusty-rose/80 shadow-sm"></span>
                <div className="aspect-square bg-surface-container-low mb-4 overflow-hidden rounded-sm relative">
                  <img alt="Memory 2" className="w-full h-full object-cover" src={getImageUrl(1, 1)} />
                </div>
                <p className="font-note text-center text-on-surface-variant text-base italic">A perfect day.</p>
              </FadeIn>

              {/* Polaroid 3 - center */}
              <FadeIn delay={0.3} className="polaroid bg-white p-4 pb-12 shadow-md transform rotate-[3deg] md:absolute md:top-[38%] md:left-1/2 md:-translate-x-1/2 w-64 border border-surface-variant/10 z-10">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-dusty-rose/80 shadow-sm z-20"></span>
                <div className="aspect-square bg-surface-container-low mb-4 overflow-hidden rounded-sm relative">
                  <img alt="Memory 4" className="w-full h-full object-cover" src={getImageUrl(3, 3)} />
                </div>
                <p className="font-note text-center text-on-surface-variant text-base italic">
                  A moment worth remembering.
                </p>
              </FadeIn>

              {/* Polaroid 4 - bottom left */}
              <FadeIn delay={0.2} className="polaroid bg-white p-4 pb-12 shadow-md transform rotate-[-2deg] md:absolute md:top-[55%] md:left-[6%] w-64 border border-surface-variant/10 z-10">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-dusty-rose/80 shadow-sm"></span>
                <div className="aspect-square bg-surface-container-low mb-4 overflow-hidden rounded-sm relative">
                  <img alt="Memory 3" className="w-full h-full object-cover" src={getImageUrl(2, 2)} />
                </div>
                <p className="font-note text-center text-on-surface-variant text-base italic">Unforgettable.</p>
              </FadeIn>

              {/* Polaroid 5 - bottom right */}
              <FadeIn delay={0.4} className="polaroid bg-white p-4 pb-12 shadow-md transform rotate-[-5deg] md:absolute md:top-[49%] md:right-[4%] w-64 border border-surface-variant/10 z-10">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-dusty-rose/80 shadow-sm"></span>
                <div className="aspect-square bg-surface-container-low mb-4 overflow-hidden rounded-sm relative">
                  <img alt="Memory 5" className="w-full h-full object-cover" src={getImageUrl(4, 0)} />
                </div>
                <p className="font-note text-center text-on-surface-variant text-base italic">
                  Another beautiful memory.
                </p>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* Section 5: Our Little Timeline (Date -> Memory -> Photo/Video + Animated Scroll Line) */}
        <section className="py-24 px-6 relative bg-surface-container-low/20 overflow-hidden">
          <div className="max-w-5xl mx-auto">

            <FadeIn className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blush-pink/40 border border-dusty-rose/20 text-dusty-rose text-xs uppercase font-bold tracking-widest mb-3">
                <FaCalendarAlt className="text-xs text-subtle-gold" />
                <span>Our Journey in Chapters</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-dusty-rose font-semibold mb-4">
                Our Little Timeline
              </h2>
              <p className="font-note text-on-surface-variant text-base md:text-lg italic max-w-lg mx-auto">
                The moments, conversations, and milestones that turned ordinary days into unforgettable memories. 🌷
              </p>
            </FadeIn>

            {/* Timeline Container with Progress Line */}
            <div ref={timelineRef} className="relative">

              {/* Static Background Vertical Line */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-8 w-[2px] bg-soft-lavender/40 rounded-full" />

              {/* Dynamic Animated Scroll Fill Line */}
              <motion.div
                style={{ scaleY: timelineProgress }}
                className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-8 w-[3px] bg-gradient-to-b from-dusty-rose via-subtle-gold to-dusty-rose origin-top rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)] z-10"
              />

              {/* Timeline Milestone Cards */}
              <div className="space-y-16 md:space-y-24 relative z-20">
                {timelineMilestones.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-14 relative ${
                        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >

                      {/* Center Glowing Icon Node */}
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-11 h-11 rounded-full bg-surface-container-lowest border-2 border-dusty-rose shadow-md flex items-center justify-center z-30 transition-transform duration-300 hover:scale-110">
                        <span className="material-symbols-outlined text-dusty-rose text-lg animate-pulse">
                          {item.icon}
                        </span>
                      </div>

                      {/* Content Card (Old Paper / Scrapbook Aesthetic) */}
                      <FadeIn
                        delay={idx * 0.1}
                        className={`w-full md:w-[45%] pl-16 md:pl-0 ${
                          isEven ? 'md:text-right' : 'md:text-left'
                        }`}
                      >
                        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(124,84,84,0.05)] border border-surface-variant/50 relative group hover:border-dusty-rose/30 transition-all duration-500 overflow-hidden">

                          {/* Scrapbook Washi Tape */}
                          <div
                            className={`absolute -top-3 w-24 h-5 bg-amber-100/80 border-t border-b border-amber-300/40 shadow-xs z-20 pointer-events-none rounded-xs backdrop-blur-xs ${
                              isEven ? 'right-6 rotate-2' : 'left-6 -rotate-2'
                            }`}
                          />

                          {/* Date & Chapter Badge */}
                          <div
                            className={`flex items-center gap-2 mb-3 ${
                              isEven ? 'md:justify-end' : 'md:justify-start'
                            }`}
                          >
                            <span className="px-3 py-1 bg-blush-pink/40 border border-dusty-rose/20 rounded-full font-note text-xs text-dusty-rose font-medium tracking-wide">
                              {item.date}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-subtle-gold">
                              {item.badge}
                            </span>
                          </div>

                          {/* Milestone Title */}
                          <h3 className="font-display text-xl md:text-2xl text-on-surface font-semibold mb-3 group-hover:text-dusty-rose transition-colors duration-300">
                            {item.title}
                          </h3>

                          {/* Memory Text */}
                          <p className="font-note text-sm md:text-base text-on-surface-variant font-light leading-relaxed italic mb-5">
                            "{item.memory}"
                          </p>

                          {/* Attached Photo / Scrapbook Snapshot */}
                          <div
                            className={`bg-white p-2.5 pb-5 rounded-sm shadow-sm border border-surface-variant/40 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-0 ${
                              isEven ? 'rotate-[-1.5deg]' : 'rotate-[1.5deg]'
                            }`}
                          >
                            <div className="aspect-[16/10] bg-surface-container rounded-xs overflow-hidden relative">
                              <img
                                src={getImageUrl(item.photoIdx, item.photoIdx)}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                            <div className="flex items-center justify-center gap-1.5 mt-2.5 text-dusty-rose/70 font-note text-xs italic">
                              <HiSparkles className="text-subtle-gold text-[10px]" />
                              <span>{item.tag}</span>
                            </div>
                          </div>

                        </div>
                      </FadeIn>

                      {/* Spacer column for opposing side balance */}
                      <div className="hidden md:block md:w-[45%]" />

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </section>

        {/* Section 6: Things I Wish For You */}
        <section className="py-20 px-6 relative bg-surface-container-high/30">
          <FadeIn className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-dusty-rose mb-12 font-semibold">
              Things I Wish For You
            </h2>
            <ul className="space-y-6">
              {birthdayConfig.wishes.map((wish, index) => (
                <FadeIn
                  key={index}
                  as="li"
                  className="font-display text-lg md:text-xl text-on-surface flex items-center justify-center gap-4 font-medium"
                  delay={index * 0.12}
                >
                  <span className="material-symbols-outlined text-subtle-gold text-base animate-pulse">favorite</span>
                  {wish}
                </FadeIn>
              ))}
            </ul>
          </FadeIn>
        </section>

        {/* Section 7: Open When... Envelopes */}
        <section className="py-20 px-6 relative">
          <div className="max-w-5xl mx-auto font-sans">
            <FadeIn className="font-display text-3xl md:text-4xl text-dusty-rose text-center mb-16 font-semibold" as="h2">
              Open When...
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {birthdayConfig.envelopes.map((env, index) => {
                const isOpen = !!openedEnvelopes[index];
                return (
                  <FadeIn
                    key={index}
                    onClick={() => toggleEnvelope(index)}
                    className={`envelope bg-surface-container-lowest border border-soft-lavender/50 rounded-2xl p-6 text-center cursor-pointer relative overflow-hidden h-64 shadow-[0_4px_20px_rgba(124,84,84,0.03)] hover:shadow-[0_8px_30px_rgba(124,84,84,0.08)] transition-all duration-500 ${isOpen ? 'open' : ''
                      }`}
                    delay={index * 0.1}
                  >

                    <div className="relative z-10 envelope-content bg-warm-cream/50 p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-surface-variant/40 mt-6 rounded-xl min-h-[120px] flex items-center justify-center">
                      <p className={`font-note text-sm text-on-surface-variant transition-opacity duration-500 leading-relaxed italic ${isOpen ? 'opacity-100' : 'opacity-0'
                        }`}>
                        {env.message}
                      </p>
                    </div>

                    <div className="absolute inset-0 bg-surface-container-low flex flex-col items-center justify-center envelope-flap z-20 border-b border-soft-lavender/30 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl">
                      <span className="material-symbols-outlined text-dusty-rose text-3xl mb-2 animate-bounce">mail</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/70">Open When...</span>
                      <span className="font-display text-xl font-bold text-dusty-rose mt-1 italic">{env.type}</span>
                    </div>

                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 8: Little Details I Remember (Scrapbook Memories) */}
        <section className="py-24 px-6 relative bg-surface-container-low/20">
          <div className="max-w-5xl mx-auto">

            <FadeIn className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blush-pink/40 border border-dusty-rose/20 text-dusty-rose text-xs uppercase font-bold tracking-widest mb-3">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                <span>Scrapbook Snippets</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-dusty-rose font-semibold mb-4">
                Little Details I Remember
              </h2>
              <p className="font-note text-on-surface-variant text-base md:text-lg italic max-w-lg mx-auto">
                Normal photos capture scenes, but these tiny fragments capture exactly how it felt. ✨
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative">

              {[
                {
                  title: "That Smile",
                  tag: "Pure Sunshine ☀️",
                  memory: "The kind that instantly lights up your entire face and makes any ordinary room feel warmer.",
                  imgIdx: 3,
                  fallbackIdx: 0,
                  rotate: "-2deg",
                  tapeColor: "bg-rose-100/90 border-rose-300/40"
                },
                {
                  title: "That One Conversation",
                  tag: "Midnight Talks ☕",
                  memory: "When hours felt like minutes, talking about everything and nothing at all without ever checking the time.",
                  imgIdx: 4,
                  fallbackIdx: 1,
                  rotate: "2.5deg",
                  tapeColor: "bg-amber-100/90 border-amber-300/40"
                },
                {
                  title: "That Random Laugh",
                  tag: "Unfiltered Joy ✨",
                  memory: "The sudden burst of uncontrollable laughter over silly little things that only we understood.",
                  imgIdx: 5,
                  fallbackIdx: 2,
                  rotate: "-1.5deg",
                  tapeColor: "bg-purple-100/90 border-purple-300/40"
                },
                {
                  title: "That Day...",
                  tag: "Quiet Afternoon 🌷",
                  memory: "Nothing dramatic was planned, but the calm energy and peaceful silence made it deeply unforgettable.",
                  imgIdx: 6,
                  fallbackIdx: 3,
                  rotate: "2deg",
                  tapeColor: "bg-emerald-100/90 border-emerald-300/40"
                },
                {
                  title: "The Little Habits",
                  tag: "Uniquely You 🎀",
                  memory: "The way your eyes sparkle when you talk about something you love, and the effortless kindness in your voice.",
                  imgIdx: 1,
                  fallbackIdx: 0,
                  rotate: "-2.5deg",
                  tapeColor: "bg-amber-100/90 border-amber-300/40"
                },
                {
                  title: "The Energy You Bring",
                  tag: "Safe Space 🧸",
                  memory: "A gentle, grounding presence that makes every space feel a little more peaceful, cozy, and safe.",
                  imgIdx: 2,
                  fallbackIdx: 1,
                  rotate: "2deg",
                  tapeColor: "bg-rose-100/90 border-rose-300/40"
                }
              ].map((detail, idx) => (
                <FadeIn
                  key={idx}
                  delay={idx * 0.1}
                  className="group relative hover:-translate-y-3 transition-all duration-500 ease-out"
                >
                  <div
                    className="bg-surface-container-lowest p-5 pb-7 shadow-[0_10px_35px_rgba(124,84,84,0.06)] border border-surface-variant/50 relative z-10 rounded-2xl group-hover:shadow-[0_15px_45px_rgba(124,84,84,0.12)] group-hover:border-dusty-rose/30 transition-all duration-500"
                    style={{ transform: `rotate(${detail.rotate})` }}
                  >
                    {/* Washi Tape */}
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 ${detail.tapeColor} border-t border-b shadow-xs z-20 pointer-events-none rounded-xs backdrop-blur-xs`}
                    />

                    {/* Snapshot Frame */}
                    <div className="w-full aspect-[4/3] bg-surface-container mb-4 overflow-hidden relative rounded-xl border border-surface-variant/30">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={getImageUrl(detail.imgIdx, detail.fallbackIdx)}
                        alt={detail.title}
                      />
                      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.04)] pointer-events-none" />
                    </div>

                    {/* Tag Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-lg text-dusty-rose font-semibold group-hover:text-subtle-gold transition-colors duration-300">
                        "{detail.title}"
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 bg-surface-container-low px-2 py-0.5 rounded-full">
                        {detail.tag}
                      </span>
                    </div>

                    {/* Micro-memory text */}
                    <p className="font-note text-on-surface-variant text-xs md:text-sm font-light leading-relaxed italic">
                      {detail.memory}
                    </p>
                  </div>
                </FadeIn>
              ))}

            </div>
          </div>
        </section>

        {/* Dynamic Scrapbook Album Grid Section */}
        <section id="memories-gallery" className="py-24 px-6 relative bg-surface-container-low/30 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            
            <FadeIn className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blush-pink/40 border border-dusty-rose/20 text-dusty-rose text-xs uppercase font-bold tracking-widest mb-3">
                <FaImages className="text-xs text-subtle-gold" />
                <span>Our Scrapbook Album</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-dusty-rose font-semibold mb-4">
                Moments Stitched in Time
              </h2>
              <p className="font-note text-on-surface-variant text-base md:text-lg italic max-w-lg mx-auto">
                A collection of beautiful snapshots, gentle smiles, and memories to revisit anytime. 📸
              </p>
            </FadeIn>

            {/* Polaroid Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
              {(imagePaths.length > 7 ? imagePaths.slice(7) : [
                getImageUrl(0, 0),
                getImageUrl(1, 1),
                getImageUrl(2, 2),
                getImageUrl(3, 3),
                getImageUrl(4, 0),
                getImageUrl(5, 1)
              ]).slice(0, galleryOpen ? undefined : 6).map((path, idx) => {
                const rotation = (idx % 2 === 0 ? 2 : -2) * (idx % 3 === 0 ? 1.2 : 0.7);
                const tapeColor = idx % 4 === 0 
                  ? 'bg-rose-100/90 border-rose-300/40' 
                  : idx % 4 === 1 
                  ? 'bg-amber-100/90 border-amber-300/40' 
                  : idx % 4 === 2 
                  ? 'bg-purple-100/90 border-purple-300/40' 
                  : 'bg-emerald-100/90 border-emerald-300/40';

                return (
                  <FadeIn
                    key={idx}
                    delay={idx * 0.08}
                    onClick={() => setLightboxImage({ url: path, caption: scrapbookCaptions[idx % scrapbookCaptions.length], index: idx + 1 })}
                    className="group bg-surface-container-lowest p-3.5 pb-7 shadow-[0_8px_30px_rgba(124,84,84,0.06)] border border-surface-variant/50 rounded-xl transform hover:scale-105 hover:rotate-0 transition-all duration-500 relative cursor-pointer hover:shadow-[0_15px_40px_rgba(124,84,84,0.12)] hover:border-dusty-rose/40"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    {/* Washi Tape */}
                    <div
                      className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 ${tapeColor} border-t border-b shadow-xs z-20 pointer-events-none rounded-xs backdrop-blur-xs`}
                    />

                    {/* Image frame */}
                    <div className="aspect-square overflow-hidden bg-surface-container rounded-lg relative border border-surface-variant/30">
                      <img
                        src={path}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        alt={`Scrapbook Memory ${idx + 1}`}
                      />
                      
                      {/* Hover Zoom Icon Overlay */}
                      <div className="absolute inset-0 bg-dusty-rose/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-dusty-rose flex items-center justify-center shadow-md scale-75 group-hover:scale-100 transition-transform duration-300">
                          <FaSearchPlus className="text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="mt-3.5 px-1 text-center">
                      <p className="font-note text-xs md:text-sm text-on-surface-variant font-light italic truncate">
                        {scrapbookCaptions[idx % scrapbookCaptions.length]}
                      </p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>

            {/* Expand / Collapse Button */}
            {(imagePaths.length > 13 || (!galleryOpen && imagePaths.length > 7)) && (
              <FadeIn className="text-center mt-14">
                <button
                  onClick={() => setGalleryOpen(!galleryOpen)}
                  className="group px-8 py-3.5 bg-surface-container-lowest border border-dusty-rose/30 text-dusty-rose hover:bg-blush-pink/20 hover:border-dusty-rose hover:scale-105 active:scale-95 transition-all duration-300 rounded-full font-medium text-xs tracking-wider uppercase cursor-pointer shadow-sm inline-flex items-center gap-2"
                >
                  <FaImages className="text-xs text-subtle-gold group-hover:rotate-12 transition-transform" />
                  <span>{galleryOpen ? "Show Less Memories" : "Open Full Scrapbook Album"}</span>
                </button>
              </FadeIn>
            )}

          </div>
        </section>

        {/* Section 9: Secret Note */}
        <section className="py-20 px-6 flex justify-center">
          <FadeIn className="w-full max-w-2xl">
            <div
              onClick={handleOpenNote}
              className={`bg-blush-pink/30 paper-mask p-10 md:p-16 relative overflow-hidden group border border-dashed border-dusty-rose/20 rounded-sm ${!noteOpen ? 'cursor-pointer hover:bg-blush-pink/40 transition-colors duration-500' : ''
                }`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-dusty-rose text-3xl">mail</span>
              </div>

              <div className="relative z-10 text-center">
                <h3 className="font-display text-2xl text-dusty-rose mb-2 flex items-center justify-center gap-2 font-semibold">
                  A Secret Note
                  <span className="material-symbols-outlined text-xl transition-transform group-hover:rotate-12">key</span>
                </h3>

                {!noteOpen && (
                  <p className="font-note text-on-surface-variant text-base italic animate-pulse">
                    (Tap to unfold)
                  </p>
                )}

                <div
                  className={`transition-all duration-1000 mt-6 pt-6 border-t border-soft-lavender/40 text-left space-y-4 ${noteOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden border-t-transparent'
                    }`}
                >
                  <p className="font-note text-lg text-on-background leading-relaxed italic">
                    My dearest Diva,
                  </p>
                  <p className="font-note text-lg text-on-background leading-relaxed italic">
                    I wanted to build a tiny corner of the digital world where everything is gentle, warm, and created entirely with you in mind.
                  </p>
                  <p className="font-note text-lg text-on-background leading-relaxed italic">
                    May this upcoming year bring you as much happiness, serenity, and light as you so effortlessly bring to everyone around you.
                  </p>
                  <p className="font-note text-lg text-on-background leading-relaxed italic pt-4 text-right">
                    Yours always, <br />
                    A friend who cares.
                  </p>
                </div>
              </div>

            </div>
          </FadeIn>
        </section>

        {/* Section 10: Your Next 365 Days */}
        <section className="py-20 px-6 relative overflow-hidden flex justify-center">
          <FadeIn className="text-center flex flex-col items-center">
            <h2 className="font-display text-3xl md:text-4xl text-dusty-rose mb-8 font-semibold">
              Your Next 365 Days
            </h2>

            <div className="w-56 h-56 border border-dashed border-subtle-gold/40 rounded-full flex items-center justify-center relative animate-[spin_40s_linear_infinite]">
              <div className="absolute inset-4 border border-dotted border-soft-lavender rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite_reverse]">
                <div className="absolute inset-4 border border-dashed border-blush-pink rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <span className="material-symbols-outlined text-dusty-rose text-2xl animate-[spin_10s_linear_infinite_reverse]">star</span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-on-surface-variant font-note text-lg italic">
              12 months, 52 weeks, 8760 hours of endless possibilities.
            </p>
          </FadeIn>
        </section>

        {/* Section 11: Make a Wish (Interactive Dark Starfield) */}
        <section className="py-24 px-6 bg-[#1a1c23] text-white relative min-h-[500px] flex items-center justify-center overflow-hidden">

          <FadeIn className="text-center relative z-10 w-full max-w-lg">
            <h2 className="font-display text-3xl md:text-4xl text-surface-container-low mb-2 flex items-center justify-center gap-2 font-semibold">
              Make a Wish
              <span className="material-symbols-outlined text-2xl text-subtle-gold animate-bounce">nightlight</span>
            </h2>

            <p className="text-surface-variant/50 font-note text-sm mb-12">Tap a few stars in the night sky.</p>

            <div className="relative w-full h-64 bg-slate-900/30 border border-slate-800/40 rounded-3xl" id="starfield">
              {starField.map((star) => {
                const isClicked = !!clickedStars[star.id];
                return (
                  <span
                    key={star.id}
                    onClick={() => handleStarClick(star.id)}
                    className={`material-symbols-outlined absolute transition-all duration-300 hover:scale-150 cursor-pointer ${isClicked ? 'text-subtle-gold scale-125 animate-pulse font-fill' : 'text-white/20 hover:text-white'
                      }`}
                    style={{
                      left: star.left,
                      top: star.top,
                      fontSize: star.size,
                    }}
                  >
                    star
                  </span>
                );
              })}
            </div>

            <p className={`mt-8 text-subtle-gold font-note text-lg italic h-8 transition-opacity duration-500 ${showWishMessage ? 'opacity-100' : 'opacity-0'
              }`}>
              {wishMessage}
            </p>
          </FadeIn>

        </section>

        {/* Section 12: One Last Memory (Image/Video Banner) */}
        <section className="py-20 px-0 relative">
          <FadeIn className="w-full aspect-[21/9] md:aspect-[3/1] bg-surface-container relative flex items-center justify-center overflow-hidden">
            {videoPaths[0] ? (
              <video
                className="absolute w-full h-full opacity-60 -rotate-90 scale-[2.5]"
                src={videoPaths[0]}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                className="absolute inset-0 w-full h-full opacity-60 -rotate-90 scale-[2.5]"
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200"
                alt="Wildflowers garden"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <h2 className="relative z-10 font-display text-2xl md:text-3xl text-white text-center px-4 drop-shadow-md font-semibold italic">
              Some beautiful moments don't even need a caption.
            </h2>
          </FadeIn>
        </section>

        {/* Render extra videos if they exist */}
        {videoPaths.length > 1 && (
          <section className="py-20 px-6 relative bg-surface-container-low/10">
            <div className="max-w-5xl mx-auto">
              <FadeIn className="font-display text-3xl md:text-4xl text-dusty-rose text-center mb-12 font-semibold" as="h2">
                Memory Tapes
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {videoPaths.slice(1).map((path, idx) => (
                  <FadeIn
                    key={idx}
                    className="bg-white p-4 pb-8 rounded-sm shadow-sm border border-surface-variant/40 transform hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="aspect-video bg-black rounded-md overflow-hidden relative border border-surface-variant/20 shadow-inner">
                      <video
                        src={path}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="font-note text-sm text-center text-on-surface-variant mt-4 italic font-medium">
                      Memory Clip {idx + 1} 📹
                    </p>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 13: The Final Scrapbook Letter */}
        <section className="py-20 px-6 relative flex justify-center">

          <FadeIn className="w-full max-w-2xl bg-surface-container-lowest p-8 md:p-12 shadow-sm border border-surface-variant/40 rounded-md relative before:content-[''] before:absolute before:left-8 before:top-0 before:bottom-0 before:w-[1px] before:bg-error/20">
            <div className="space-y-6 font-note text-lg text-on-background leading-relaxed pl-6 relative">
              <p>I hope this little journey brought a small smile to your face today.</p>
              <p>Every little detail here was meant to reflect a piece of the warmth and kindness you bring into the world. You deserve to be celebrated today, tomorrow, and every day.</p>
              <p className="pt-6 font-semibold text-right text-dusty-rose text-2xl">
                {birthdayConfig.finalMessage}
              </p>
            </div>
          </FadeIn>

        </section>

       

        {/* Section 14: Final Surprise Section */}
        <section
          id="final-surprise-section"
          className={`py-24 px-6 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[550px] transition-colors duration-[2000ms] ${surpriseEnded ? 'bg-[#1a1c23] text-white' : 'bg-transparent text-on-background'
            }`}
        >
          {/* Soft glow backdrop once revealed */}
          {surpriseEnded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[420px] h-[420px] bg-dusty-rose/20 rounded-full blur-3xl animate-pulse" />
            </div>
          )}

          <FadeIn className="relative z-10 flex flex-col items-center justify-center min-h-[140px] gap-4">
            {!surpriseEnded ? (
              <button
                onClick={handleSurpriseClick}
                className="group font-display text-xl md:text-2xl text-dusty-rose cursor-pointer border border-dashed border-dusty-rose/30 hover:border-dusty-rose hover:scale-105 hover:bg-blush-pink/10 transition-all duration-300 px-8 py-4 rounded-full font-medium flex items-center gap-3"
              >
                <FaHeart className="text-sm text-dusty-rose/60 group-hover:text-dusty-rose group-hover:scale-125 transition-all duration-300" />
                {surpriseSequence[surpriseStep]}
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <HiSparkles className="text-subtle-gold text-4xl animate-bounce" />
                <h2 className="font-display text-4xl md:text-6xl text-white font-semibold transition-all duration-1000 scale-105 drop-shadow-[0_0_25px_rgba(212,175,55,0.35)]">
                  Happy Birthday, {birthdayConfig.name}! 💗
                </h2>
                <p className="font-note text-base md:text-lg text-white/60 italic mt-2">
                  Here's to you, today and always.
                </p>
              </div>
            )}
          </FadeIn>

          {/* Burst Particle Canvas — mix of dots, hearts, and stars */}
          {surpriseEnded && particles.map((p) => {
            const Icon = p.id % 3 === 0 ? FaHeart : p.id % 3 === 1 ? FaStar : null;
            return (
              <div
                key={p.id}
                className="absolute pointer-events-none transition-all ease-out flex items-center justify-center"
                style={{
                  width: `${p.size * 2}px`,
                  height: `${p.size * 2}px`,
                  left: '50%',
                  top: '50%',
                  transform: burstActive
                    ? `translate(calc(-50% + ${p.tx}px), calc(-50% + ${p.ty}px)) scale(${Math.random() * 1.5 + 0.5}) rotate(${p.tx}deg)`
                    : 'translate(-50%, -50%) scale(1)',
                  opacity: burstActive ? 0 : 1,
                  transitionDuration: `${p.duration}s`,
                  transitionDelay: `${p.delay}s`,
                }}
              >
                {Icon ? (
                  <Icon style={{ color: p.color, width: '100%', height: '100%' }} />
                ) : (
                  <div
                    className="rounded-full w-full h-full"
                    style={{ backgroundColor: p.color }}
                  />
                )}
              </div>
            );
          })}
        </section>

        {/* Section 15: Closing Scene */}
        <section className="py-24 px-6 bg-warm-cream text-center flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden border-t-2 border-dusty-rose/20">

          {/* Decorative top border accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-subtle-gold to-transparent" />
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-subtle-gold/60" />

          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#CEC2D9_1px,transparent_1px)] [background-size:26px_26px] opacity-10 pointer-events-none" />

          {/* Soft ambient glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-blush-pink/20 rounded-full blur-3xl pointer-events-none" />

          <FadeIn className="relative z-10 flex flex-col items-center gap-6">
            <HiSparkles className="text-subtle-gold text-2xl opacity-80" />

            <h3 className="font-display text-2xl md:text-3xl text-dusty-rose font-semibold italic text-center">
              Come Back Whenever You Need A Little Smile
            </h3>

            <p className="text-on-surface-variant/80 font-note text-base md:text-lg italic max-w-lg leading-relaxed text-center">
              This little corner is always here for you — on your happiest days, or whenever you just need a quiet reminder of how special you are. 🌷
            </p>

            <div className="flex items-center gap-3 w-32">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-dusty-rose/40" />
              <FaHeart className="text-dusty-rose/50 text-xs" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-dusty-rose/40" />
            </div>

            <p className="text-dusty-rose font-semibold tracking-[0.2em] text-xs uppercase flex">
              Made especially for {birthdayConfig.name}<HiSparkles className="text-subtle-gold text-2xl opacity-80" />
            </p>
          </FadeIn>
        </section>

      </main>

      {/* FIXED FOOTER */}
      <footer className="w-full py-20 border-t border-soft-lavender/20 bg-warm-cream flex flex-col items-center gap-10 max-w-5xl mx-auto text-center relative z-10 px-6 overflow-hidden">

        {/* Decorative top accent */}
        <div className="flex items-center gap-3 -mt-4">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-dusty-rose/30" />
          <HiSparkles className="text-subtle-gold text-sm" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-dusty-rose/30" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="font-display text-3xl md:text-4xl text-dusty-rose italic font-semibold">
            A Tiny World
          </div>
          <p className="font-note text-sm text-on-surface-variant/50 italic">
            made just for her
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-14">
          <a
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-xs uppercase font-bold text-on-surface-variant/70 hover:text-subtle-gold transition-colors duration-300 cursor-pointer tracking-wider"
          >
            <FaArrowUp className="text-[10px] opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all duration-300" />
            <span className="hover:underline decoration-subtle-gold/30 underline-offset-4">Start Over</span>
          </a>

          <a
            onClick={() => {
              const gallerySection = document.getElementById('memories-gallery');
              if (gallerySection) gallerySection.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center gap-2 text-on-surface-variant/70 hover:text-subtle-gold transition-colors duration-300 cursor-pointer text-xs uppercase font-bold tracking-wider"
          >
            <FaImages className="text-[10px] opacity-50 group-hover:opacity-100 transition-all duration-300" />
            <span className="hover:underline decoration-subtle-gold/30 underline-offset-4">Our Memories</span>
          </a>

          <span className="group flex items-center gap-2 text-on-surface-variant/70 hover:text-subtle-gold transition-colors duration-300 cursor-pointer text-xs uppercase font-bold tracking-wider">
            <FaSeedling className="text-[10px] opacity-50 group-hover:opacity-100 transition-all duration-300" />
            <span className="hover:underline decoration-subtle-gold/30 underline-offset-4">The Secret Garden</span>
          </span>
        </nav>

        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-soft-lavender/40 to-transparent" />

        <div className="flex flex-col items-center gap-1">
          <p className="font-note text-sm text-on-surface-variant/60 italic flex items-center gap-2">
            Made with <FaHeart className="text-dusty-rose/60 text-xs" /> for your special day.
          </p>
          <p className="text-[10px] text-on-surface-variant/30 tracking-widest uppercase mt-2">
            {new Date().getFullYear()}
          </p>
        </div>

      </footer>
      {/* Floating Audio Play FAB */}
      <button
        onClick={togglePlay}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-surface-container-lowest border border-soft-lavender/30 rounded-full shadow-[0_8px_30px_rgba(124,84,84,0.15)] flex items-center justify-center text-dusty-rose hover:bg-blush-pink hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${isPlaying ? 'text-subtle-gold fill' : ''
          }`}>
          {isPlaying ? 'volume_up' : 'music_note'}
        </span>
        <span className="absolute inset-0 rounded-full border border-dusty-rose/30 animate-ping opacity-25" />
      </button>

      {/* Lightbox Preview Modal for Scrapbook Photos */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 md:p-6 pb-8 rounded-2xl shadow-2xl max-w-lg w-full relative border border-white/20 cursor-default"
            >
              {/* Top Washi Tape */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-100/90 border border-amber-300/50 shadow-sm rotate-[-1.5deg] z-20 pointer-events-none rounded-xs backdrop-blur-xs" />

              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-dusty-rose transition-colors duration-200 flex items-center justify-center cursor-pointer shadow-md"
                aria-label="Close photo preview"
              >
                <FaTimes className="text-sm" />
              </button>

              {/* Photo */}
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-surface-container relative mb-4 border border-surface-variant/30">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption Card */}
              <div className="text-center px-2">
                <p className="font-note text-base md:text-lg text-dusty-rose font-medium italic">
                  "{lightboxImage.caption}"
                </p>
                <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest block mt-1">
                  Memory #{lightboxImage.index}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
