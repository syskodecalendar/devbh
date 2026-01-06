import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroVideo from "@/assets/jewelry/maroon-majesty-video1.mp4";
import devjiAurumLogo from "@/assets/devji-aurum-logo.jpg";

const Showroom = () => {
  return (
    <div className="h-screen overflow-hidden bg-velvet">
      <Header />

      {/* Fullscreen Video Hero - No Scroll */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="flex items-center justify-center mb-6">
              <img 
                src={devjiAurumLogo} 
                alt="Devji Aurum" 
                className="h-12 md:h-16 lg:h-20 object-contain"
              />
            </div>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Curated
              <span className="block text-gold-gradient mt-2">Bridal Masterpieces</span>
            </h1>

            <p className="text-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Discover our finest selection of handcrafted gold sets, each piece
              telling a story of timeless elegance and unmatched craftsmanship.
            </p>

            <Link to="/style-library">
              <Button variant="gold" size="xl" className="group">
                The Style Library
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Showroom;
