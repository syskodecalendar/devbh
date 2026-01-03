import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface GoldParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const GoldParticles = () => {
  const [particles, setParticles] = useState<GoldParticle[]>([]);

  useEffect(() => {
    const newParticles: GoldParticle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

interface DoorIntroSceneProps {
  onEnter: () => void;
}

const DoorIntroScene = ({ onEnter }: DoorIntroSceneProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const handleEnter = () => {
    setIsOpening(true);
    setTimeout(() => {
      setShowContent(false);
      setTimeout(onEnter, 800);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {showContent && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-velvet overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GoldParticles />
          
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_hsl(var(--background))_100%)] pointer-events-none" />

          {/* Door frame container */}
          <motion.div
            className="relative w-80 md:w-96 h-[500px] md:h-[600px] perspective-1000"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Door frame */}
            <div className="absolute inset-0 border-8 border-primary/40 rounded-t-full bg-maroon-dark shadow-2xl">
              {/* Frame decorations */}
              <div className="absolute top-4 left-4 right-4 h-12 border-2 border-primary/20 rounded-t-full" />
              <div className="absolute bottom-4 left-4 right-4 h-8 border-2 border-primary/20" />
              
              {/* Left door */}
              <motion.div
                className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-maroon via-maroon-light to-maroon border-r border-primary/30 rounded-tl-full origin-left"
                animate={
                  isOpening
                    ? {
                        rotateY: -105,
                        transition: { duration: 1.5, ease: "easeInOut" },
                      }
                    : {}
                }
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Door panel details */}
                <div className="absolute inset-4 border border-primary/20 rounded-tl-full">
                  <div className="absolute inset-4 border border-primary/10 rounded-tl-full" />
                </div>
                {/* Door knocker */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-8 rounded-full border-2 border-primary bg-primary/20" />
                </div>
                {/* Gold ornament */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-16 h-16 border-2 border-primary/30 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/30 rounded-full gold-glow" />
                </div>
              </motion.div>

              {/* Right door */}
              <motion.div
                className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-maroon via-maroon-light to-maroon border-l border-primary/30 rounded-tr-full origin-right"
                animate={
                  isOpening
                    ? {
                        rotateY: 105,
                        transition: { duration: 1.5, ease: "easeInOut" },
                      }
                    : {}
                }
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Door panel details */}
                <div className="absolute inset-4 border border-primary/20 rounded-tr-full">
                  <div className="absolute inset-4 border border-primary/10 rounded-tr-full" />
                </div>
                {/* Door knocker */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-8 rounded-full border-2 border-primary bg-primary/20" />
                </div>
                {/* Gold ornament */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-16 h-16 border-2 border-primary/30 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/30 rounded-full gold-glow" />
                </div>
              </motion.div>

              {/* Light from inside (visible when doors open) */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent rounded-t-full"
                initial={{ opacity: 0 }}
                animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            {/* Enter button */}
            <motion.button
              onClick={handleEnter}
              disabled={isOpening}
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 px-10 py-4 bg-gradient-to-r from-primary via-gold-light to-primary text-primary-foreground font-serif text-xl tracking-widest uppercase rounded-sm transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] disabled:opacity-50 disabled:cursor-not-allowed gold-border"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Enter Bridal World
            </motion.button>
          </motion.div>

          {/* Brand name */}
          <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif text-gold-gradient tracking-wider">
              Devji
            </h1>
            <p className="text-muted-foreground mt-2 tracking-[0.3em] uppercase text-sm">
              Bridal World
            </p>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/60 text-sm tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Where Dreams Meet Tradition
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoorIntroScene;
