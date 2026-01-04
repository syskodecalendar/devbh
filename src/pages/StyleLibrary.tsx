import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Header from "@/components/Header";
import { useCollections } from "@/hooks/useJewelrySets";

// Placeholder images for 5 style library categories
const styleLibraryImages = [
  {
    id: "traditional",
    name: "Traditional Elegance",
    description: "Timeless designs rooted in heritage",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80",
  },
  {
    id: "contemporary",
    name: "Contemporary Chic",
    description: "Modern aesthetics for the new-age bride",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1920&q=80",
  },
  {
    id: "royal",
    name: "Royal Heritage",
    description: "Majestic pieces fit for royalty",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1920&q=80",
  },
  {
    id: "minimalist",
    name: "Minimalist Grace",
    description: "Understated beauty in simplicity",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&q=80",
  },
  {
    id: "fusion",
    name: "Fusion Art",
    description: "Where tradition meets innovation",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&q=80",
  },
];

const StyleLibrary = () => {
  const navigate = useNavigate();
  const { data: collections } = useCollections();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % styleLibraryImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + styleLibraryImages.length) % styleLibraryImages.length);
  };

  const handleStyleClick = (styleId: string) => {
    // Navigate to first set or collection (for now, navigate to first available collection)
    if (collections && collections.length > 0) {
      navigate(`/set/${collections[0].slug}`);
    }
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
            onClick={() => handleStyleClick(currentStyle.id)}
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
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-all border border-border/30 group"
        >
          <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-all border border-border/30 group"
        >
          <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {styleLibraryImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-primary w-8"
                  : "bg-foreground/30 hover:bg-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-24 left-8 z-20 p-3 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-all border border-border/30"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StyleLibrary;
