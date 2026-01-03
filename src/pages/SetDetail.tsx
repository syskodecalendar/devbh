import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Camera,
  Info,
  Image,
  ArrowLeft,
  Play,
  Maximize2,
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  getSetById,
  calculatePrice,
  diamondQualities,
} from "@/data/products";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import QuoteModal from "@/components/QuoteModal";
import TryOnModal from "@/components/TryOnModal";
import FullscreenGallery from "@/components/FullscreenGallery";

const SetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const set = getSetById(id || "");

  const [activeTab, setActiveTab] = useState<"gallery" | "details" | "tryon">(
    "gallery"
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDiamondQuality, setSelectedDiamondQuality] = useState(
    diamondQualities[0].id
  );
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [tryOnModalOpen, setTryOnModalOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  const { addToShortlist, removeFromShortlist, isInShortlist } = useStore();
  const inShortlist = isInShortlist(set?.id || "");

  if (!set) {
    return (
      <div className="min-h-screen bg-velvet flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">
            Set Not Found
          </h1>
          <Button variant="goldOutline" onClick={() => navigate("/collections")}>
            Back to Collections
          </Button>
        </div>
      </div>
    );
  }

  const allImages = [set.coverImage, ...set.galleryImages];
  const allVideos = set.galleryVideos || [];
  const totalMedia = allImages.length + allVideos.length;
  const estimatedPrice = calculatePrice(set, selectedDiamondQuality);

  const handleShortlistToggle = () => {
    if (inShortlist) {
      removeFromShortlist(set.id);
      toast.info(`${set.name} removed from shortlist`);
    } else {
      addToShortlist(set, set.hasDiamond ? selectedDiamondQuality : undefined);
      toast.success(`${set.name} added to shortlist`);
    }
  };

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
            to="/collections"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Collections</span>
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
                  {set.collection}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl text-foreground mt-2">
                  {set.name}
                </h1>
                <p className="text-muted-foreground mt-3">{set.description}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-border/30 pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm transition-colors ${
                      activeTab === tab.id
                        ? "bg-card text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "gallery" && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <p className="text-muted-foreground">
                      Browse through {allImages.length} stunning images of the{" "}
                      {set.name} collection. Use the arrows or thumbnails to
                      navigate.
                    </p>
                  </motion.div>
                )}

                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="luxury-card p-4">
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">
                          Gold Purity
                        </p>
                        <p className="text-foreground font-serif text-lg mt-1">
                          {set.goldPurity}
                        </p>
                      </div>
                      <div className="luxury-card p-4">
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">
                          Gold Weight
                        </p>
                        <p className="text-foreground font-serif text-lg mt-1">
                          {set.goldWeightGrams}g
                        </p>
                      </div>
                      <div className="luxury-card p-4">
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">
                          SKU
                        </p>
                        <p className="text-foreground text-sm mt-1">{set.sku}</p>
                      </div>
                      <div className="luxury-card p-4">
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">
                          Diamond
                        </p>
                        <p className="text-foreground font-serif text-lg mt-1">
                          {set.hasDiamond ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                    {set.stoneDetails && (
                      <div className="luxury-card p-4">
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">
                          Stone Details
                        </p>
                        <p className="text-foreground mt-1">{set.stoneDetails}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "tryon" && (
                  <motion.div
                    key="tryon"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <p className="text-muted-foreground mb-4">
                      Experience how this piece looks on you with our virtual
                      try-on feature.
                    </p>
                    <Button
                      variant="gold"
                      className="w-full"
                      onClick={() => setTryOnModalOpen(true)}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Open Try-On Experience
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Diamond Quality Selector */}
              {set.hasDiamond && (
                <div className="mt-8">
                  <h3 className="font-serif text-lg text-foreground mb-3">
                    Diamond Quality
                  </h3>
                  <div className="space-y-2">
                    {diamondQualities.map((quality) => (
                      <button
                        key={quality.id}
                        onClick={() => setSelectedDiamondQuality(quality.id)}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          selectedDiamondQuality === quality.id
                            ? "luxury-card border-primary/50"
                            : "bg-card/40 border border-border/30 hover:border-border/50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-foreground font-medium">
                              {quality.name}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {quality.description}
                            </p>
                          </div>
                          {selectedDiamondQuality === quality.id && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mt-8 p-6 luxury-card">
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">
                  Estimated Price
                </p>
                <p className="font-serif text-3xl text-primary">
                  {estimatedPrice.toLocaleString()} BHD
                </p>
                <p className="text-muted-foreground/60 text-xs mt-2">
                  Final pricing may vary based on live gold rate and
                  customization.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  variant={inShortlist ? "secondary" : "goldOutline"}
                  className="flex-1"
                  onClick={handleShortlistToggle}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      inShortlist ? "fill-current" : ""
                    }`}
                  />
                  {inShortlist ? "In Shortlist" : "Shortlist"}
                </Button>
                <Button
                  variant="gold"
                  className="flex-1"
                  onClick={() => setQuoteModalOpen(true)}
                >
                  Request a Quote
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <QuoteModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        selectedSets={[{ set, diamondQuality: selectedDiamondQuality }]}
      />

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
