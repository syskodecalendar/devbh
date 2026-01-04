import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Info,
  Image,
  ArrowLeft,
  Play,
  Maximize2,
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useJewelrySetBySlug } from "@/hooks/useJewelrySets";
import TryOnModal from "@/components/TryOnModal";
import FullscreenGallery from "@/components/FullscreenGallery";
import { getDemoMedia } from "@/lib/demoImages";

// Diamond quality options
const diamondQualityOptions = [
  { id: "vs-si", name: "VS-SI", description: "Very Slightly to Slightly Included" },
  { id: "si", name: "SI", description: "Slightly Included" },
  { id: "si-i", name: "SI-I", description: "Slightly Included to Included" },
];

// Metal karat options
const metalKaratOptions = [
  { id: "18k", name: "18K", description: "75% Pure Gold" },
  { id: "14k", name: "14K", description: "58.3% Pure Gold" },
];

// Metal color options
const metalColorOptions = [
  { id: "white", name: "White", color: "bg-gray-200" },
  { id: "yellow", name: "Yellow", color: "bg-yellow-400" },
  { id: "rose", name: "Rose", color: "bg-pink-300" },
];

const SetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: set, isLoading } = useJewelrySetBySlug(id || "");

  const [activeTab, setActiveTab] = useState<"gallery" | "details" | "tryon">(
    "gallery"
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDiamondQuality, setSelectedDiamondQuality] = useState<string>("vs-si");
  const [selectedMetalKarat, setSelectedMetalKarat] = useState<string>("18k");
  const [selectedMetalColor, setSelectedMetalColor] = useState<string>("yellow");
  const [tryOnModalOpen, setTryOnModalOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-velvet flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!set) {
    return (
      <div className="min-h-screen bg-velvet flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">
            Set Not Found
          </h1>
          <Button variant="goldOutline" onClick={() => navigate("/style-library")}>
            Back to Style Library
          </Button>
        </div>
      </div>
    );
  }

  // Build images and videos arrays from media
  const allImages: string[] = [];
  const allVideos: string[] = [];

  // Get demo media as fallback
  const demoMedia = getDemoMedia(set.slug);

  // Add cover image first if exists
  if (set.cover_image) {
    allImages.push(set.cover_image);
  }

  // Add media items from database
  if (set.media && set.media.length > 0) {
    set.media.forEach((m) => {
      if (m.type === "video") {
        allVideos.push(m.url);
      } else if (m.type === "image" && m.url !== set.cover_image) {
        allImages.push(m.url);
      }
    });
  }

  // If no images from database, use demo images
  if (allImages.length === 0 && demoMedia) {
    allImages.push(...demoMedia.images);
  }

  // If no videos from database, use demo videos
  if (allVideos.length === 0 && demoMedia) {
    allVideos.push(...demoMedia.videos);
  }

  // Final fallback if still no images
  if (allImages.length === 0) {
    allImages.push("/placeholder.svg");
  }

  // Calculate price based on selections
  const getPrice = () => {
    let basePrice = set.base_price || 0;
    
    // Adjust for karat
    if (selectedMetalKarat === "14k") {
      basePrice = basePrice * 0.85;
    }
    
    // Adjust for diamond quality
    if (selectedDiamondQuality === "si") {
      basePrice = basePrice * 0.95;
    } else if (selectedDiamondQuality === "si-i") {
      basePrice = basePrice * 0.90;
    }
    
    return Math.round(basePrice);
  };

  const price = getPrice();


  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setFullscreenOpen(true);
  };

  const tabs = [
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "details", label: "Details", icon: Info },
    { id: "tryon", label: "Try On", icon: Camera },
  ] as const;

  return (
    <div className="min-h-screen bg-velvet">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/style-library"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Style Library</span>
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div 
                className="relative aspect-square rounded-lg overflow-hidden luxury-card mb-4 cursor-pointer group"
                onClick={() => openFullscreen(currentImageIndex)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={allImages[currentImageIndex]}
                    alt={`${set.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Fullscreen hint */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-background/50 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-5 h-5" />
                </div>

                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/50 backdrop-blur-sm rounded-full text-sm text-foreground">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </div>

              {/* Thumbnail strip - Images */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Video section */}
              {allVideos.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-serif text-lg text-foreground mb-3">Videos</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {allVideos.map((video, idx) => (
                      <button
                        key={idx}
                        onClick={() => openFullscreen(allImages.length + idx)}
                        className="relative aspect-video rounded-lg overflow-hidden luxury-card group"
                      >
                        <video
                          src={video}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <div className="p-3 rounded-full bg-primary/90">
                            <Play className="w-6 h-6 text-primary-foreground fill-current" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Title and Collection */}
              <div className="mb-6">
                <span className="text-primary text-sm tracking-wider uppercase">
                  {set.collection?.name || "Exclusive Collection"}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl text-foreground mt-2">
                  {set.name}
                </h1>
                <p className="text-muted-foreground mt-3">{set.description || set.short_description}</p>
              </div>

              {/* Diamond Quality Selector */}
              <div className="mb-6">
                <h3 className="font-serif text-lg text-foreground mb-3">
                  Diamond Quality
                </h3>
                <div className="flex gap-2">
                  {diamondQualityOptions.map((quality) => (
                    <button
                      key={quality.id}
                      onClick={() => setSelectedDiamondQuality(quality.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedDiamondQuality === quality.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-card/60 text-foreground border border-border/50 hover:border-primary/50"
                      }`}
                    >
                      {quality.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metal Karat Selector */}
              <div className="mb-6">
                <h3 className="font-serif text-lg text-foreground mb-3">
                  Metal Karat
                </h3>
                <div className="flex gap-2">
                  {metalKaratOptions.map((karat) => (
                    <button
                      key={karat.id}
                      onClick={() => setSelectedMetalKarat(karat.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedMetalKarat === karat.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-card/60 text-foreground border border-border/50 hover:border-primary/50"
                      }`}
                    >
                      {karat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metal Color Selector */}
              <div className="mb-8">
                <h3 className="font-serif text-lg text-foreground mb-3">
                  Metal Color
                </h3>
                <div className="flex gap-3">
                  {metalColorOptions.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedMetalColor(color.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                        selectedMetalColor === color.id
                          ? "ring-2 ring-primary bg-card/60"
                          : "bg-card/40 hover:bg-card/60"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${color.color} border-2 border-border/50`} />
                      <span className="text-xs text-foreground">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="p-6 luxury-card mb-6">
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">
                  Price
                </p>
                <p className="font-serif text-3xl text-primary">
                  {price > 0 ? `${price.toLocaleString()} BHD` : "Price on request"}
                </p>
                <p className="text-muted-foreground/60 text-xs mt-2">
                  Final pricing may vary based on live gold rate.
                </p>
              </div>

            </motion.div>
          </div>
        </div>
      </main>

      {/* Modals */}

      <TryOnModal
        open={tryOnModalOpen}
        onClose={() => setTryOnModalOpen(false)}
        setName={set.name}
      />

      <FullscreenGallery
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        images={allImages}
        videos={allVideos}
        initialIndex={fullscreenIndex}
        title={set.name}
      />
    </div>
  );
};

export default SetDetail;
