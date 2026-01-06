import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Pause, Play } from "lucide-react";
import Header from "@/components/Header";
import { useCollections } from "@/hooks/useJewelrySets";

// Import generated AI images
import styleTraditional from "@/assets/jewelry/style-traditional.jpg";
import styleContemporary from "@/assets/jewelry/style-contemporary.jpg";
import styleRoyal from "@/assets/jewelry/style-royal.jpg";
import styleMinimalist from "@/assets/jewelry/style-minimalist.jpg";
import styleFusion from "@/assets/jewelry/style-fusion.jpg";

// Style library categories with AI-generated diamond set images mapped to collections
const styleLibraryImages = [
  {
    id: "diamond-luxe",
    name: "Diamond Luxe",
    description: "Premium diamond jewelry for the discerning connoisseur",
    image: styleTraditional,
    collectionSlug: "diamond-luxe",
  },
  {
    id: "bridal-luxe",
    name: "Bridal Luxe",
    description: "Exquisite bridal sets for your special day",
    image: styleContemporary,
    collectionSlug: "bridal-luxe",
  },
  {
    id: "temple-heritage",
    name: "Temple Heritage",
    description: "Traditional temple-inspired designs",
    image: styleRoyal,
    collectionSlug: "temple-heritage",
  },
  {
    id: "contemporary-luxe",
    name: "Contemporary Luxe",
    description: "Modern luxury for the new-age bride",
    image: styleMinimalist,
    collectionSlug: "contemporary-luxe",
  },
  {
    id: "pearl-collection",
    name: "Pearl Collection",
    description: "Timeless elegance with premium pearls",
    image: styleFusion,
    collectionSlug: "pearl-collection",
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds for Ken Burns effect

const StyleLibrary = () => {
  const navigate = useNavigate();
  const { data: collections } = useCollections();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % styleLibraryImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + styleLibraryImages.length) % styleLibraryImages.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
        setIsAutoPlaying(false);
      } else if (e.key === "ArrowRight") {
        nextSlide();
        setIsAutoPlaying(false);
      } else if (e.key === "Enter" || e.key === " ") {
        handleStyleClick();
      } else if (e.key === "Escape") {
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, navigate, currentIndex]);

  // Autoplay slideshow
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleStyleClick = () => {
    const currentStyle = styleLibraryImages[currentIndex];
    navigate(`/collections/${currentStyle.collectionSlug}`);
  };

  const toggleAutoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoPlaying(!isAutoPlaying);
  };

  const currentStyle = styleLibraryImages[currentIndex];

  // Ken Burns animation variants - alternating zoom directions
  const kenBurnsVariants = [
    { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.15, x: -30, y: -20 } },
    { initial: { scale: 1.1, x: 20, y: 0 }, animate: { scale: 1, x: -20, y: 10 } },
    { initial: { scale: 1, x: -20, y: 10 }, animate: { scale: 1.12, x: 20, y: -10 } },
    { initial: { scale: 1.08, x: 0, y: -15 }, animate: { scale: 1, x: 0, y: 15 } },
    { initial: { scale: 1, x: 30, y: 0 }, animate: { scale: 1.1, x: -30, y: 0 } },
  ];

  const currentKenBurns = kenBurnsVariants[currentIndex % kenBurnsVariants.length];

  return (
    <div className="h-screen overflow-hidden bg-velvet">
      <Header />

      {/* Fullscreen Carousel */}
      <div className="relative h-screen w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 cursor-pointer"
            onClick={handleStyleClick}
          >
            {/* Background Image with Ken Burns Effect */}
            <motion.img
              src={currentStyle.image}
              alt={currentStyle.name}
              className="w-full h-full object-cover"
              initial={currentKenBurns.initial}
              animate={currentKenBurns.animate}
              transition={{ 
                duration: AUTOPLAY_INTERVAL / 1000, 
                ease: "linear" 
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-32 left-0 right-0 text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium mb-4 block">
                  Collection {currentIndex + 1} of {styleLibraryImages.length}
                </span>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-4">
                  {currentStyle.name}
                </h1>
                <p className="text-foreground/80 text-lg md:text-xl max-w-xl mx-auto">
                  {currentStyle.description}
                </p>
                <p className="text-primary/80 text-sm mt-6 animate-pulse">
                  Click to explore collection
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); setIsAutoPlaying(false); }}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-all border border-border/30 group"
        >
          <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); setIsAutoPlaying(false); }}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-all border border-border/30 group"
        >
          <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>

        {/* Slide Indicators with Progress */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center">
          {styleLibraryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); setIsAutoPlaying(false); }}
              className={`h-3 rounded-full transition-all overflow-hidden ${
                idx === currentIndex
                  ? "bg-primary/30 w-12"
                  : "bg-foreground/30 hover:bg-foreground/50 w-3"
              }`}
            >
              {idx === currentIndex && isAutoPlaying && (
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                  key={`progress-${currentIndex}`}
                />
              )}
              {idx === currentIndex && !isAutoPlaying && (
                <div className="h-full bg-primary w-full" />
              )}
            </button>
          ))}
        </div>

        {/* Autoplay Toggle */}
        <button
          onClick={toggleAutoPlay}
          className="absolute bottom-8 right-8 z-20 p-3 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-all border border-border/30"
          title={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-24 left-8 z-20 p-3 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-all border border-border/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Keyboard hints (for TV display) */}
        <div className="absolute bottom-8 left-8 z-20 text-foreground/50 text-xs hidden md:block">
          <span>← → Navigate</span> · <span>Enter to View</span> · <span>Esc to Exit</span>
        </div>
      </div>
    </div>
  );
};

export default StyleLibrary;