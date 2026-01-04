import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Pause, Play } from "lucide-react";
import Header from "@/components/Header";
import { useJewelrySets } from "@/hooks/useJewelrySets";

// Import generated AI images
import styleTraditional from "@/assets/jewelry/style-traditional.jpg";
import styleContemporary from "@/assets/jewelry/style-contemporary.jpg";
import styleRoyal from "@/assets/jewelry/style-royal.jpg";
import styleMinimalist from "@/assets/jewelry/style-minimalist.jpg";
import styleFusion from "@/assets/jewelry/style-fusion.jpg";

// Style library categories with AI-generated images
const styleLibraryImages = [
  {
    id: "traditional",
    name: "Traditional Elegance",
    description: "Timeless designs rooted in heritage",
    image: styleTraditional,
  },
  {
    id: "contemporary",
    name: "Contemporary Chic",
    description: "Modern aesthetics for the new-age bride",
    image: styleContemporary,
  },
  {
    id: "royal",
    name: "Royal Heritage",
    description: "Majestic pieces fit for royalty",
    image: styleRoyal,
  },
  {
    id: "minimalist",
    name: "Minimalist Grace",
    description: "Understated beauty in simplicity",
    image: styleMinimalist,
  },
  {
    id: "fusion",
    name: "Fusion Art",
    description: "Where tradition meets innovation",
    image: styleFusion,
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds

const StyleLibrary = () => {
  const navigate = useNavigate();
  const { data: jewelrySets } = useJewelrySets();
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
        setIsAutoPlaying(false); // Pause autoplay on manual navigation
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
    // Navigate to the first available jewelry set
    if (jewelrySets && jewelrySets.length > 0) {
      // Map style index to jewelry set (cycle through available sets)
      const setIndex = currentIndex % jewelrySets.length;
      navigate(`/set/${jewelrySets[setIndex].slug}`);
    }
  };

  const toggleAutoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoPlaying(!isAutoPlaying);
  };

  const currentStyle = styleLibraryImages[currentIndex];

  return (
    <div className="h-screen overflow-hidden bg-velvet">
      <Header />

      {/* Fullscreen Carousel */}
      <div className="relative h-screen w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 cursor-pointer"
            onClick={handleStyleClick}
          >
            {/* Background Image */}
            <img
              src={currentStyle.image}
              alt={currentStyle.name}
              className="w-full h-full object-cover"
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
                  Style {currentIndex + 1} of {styleLibraryImages.length}
                </span>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-4">
                  {currentStyle.name}
                </h1>
                <p className="text-foreground/80 text-lg md:text-xl max-w-xl mx-auto">
                  {currentStyle.description}
                </p>
                <p className="text-primary/80 text-sm mt-6 animate-pulse">
                  Click to explore designs
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

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center">
          {styleLibraryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); setIsAutoPlaying(false); }}
              className={`h-3 rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-primary w-8"
                  : "bg-foreground/30 hover:bg-foreground/50 w-3"
              }`}
            />
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
