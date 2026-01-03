import { motion } from "framer-motion";
import { useEffect, useState, useRef, Suspense } from "react";
import devjiLogo from "@/assets/devji-logo.png";
import GradientMeshBackground from "./GradientMeshBackground";
import { playSparkleSound, playDoorCreakSound } from "@/lib/sounds";

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
    const newParticles: GoldParticle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
            boxShadow: `0 0 ${particle.size * 2}px hsl(var(--primary) / 0.5)`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-10, 10, -10],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
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

// Floating light rays
const LightRays = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full w-1"
          style={{
            left: `${20 + i * 15}%`,
            background: `linear-gradient(to bottom, transparent 0%, hsl(var(--primary) / 0.1) 50%, transparent 100%)`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scaleY: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.5,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Sparkle burst effect
interface BurstParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  duration: number;
  delay: number;
}

const SparkleBurst = ({ isActive }: { isActive: boolean }) => {
  const particles: BurstParticle[] = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    angle: (i / 40) * 360 + Math.random() * 20,
    distance: 150 + Math.random() * 200,
    size: Math.random() * 8 + 4,
    duration: 0.8 + Math.random() * 0.4,
    delay: Math.random() * 0.15,
  }));

  if (!isActive) return null;

  return (
    <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      {particles.map((particle) => {
        const radians = (particle.angle * Math.PI) / 180;
        const x = Math.cos(radians) * particle.distance;
        const y = Math.sin(radians) * particle.distance;

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: 0,
              top: 0,
              background: `radial-gradient(circle, hsl(43 70% 65%) 0%, hsl(43 65% 53%) 50%, transparent 100%)`,
              boxShadow: `0 0 ${particle.size * 2}px hsl(43 65% 53% / 0.8)`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: x,
              y: y,
              opacity: [1, 1, 0],
              scale: [1, 1.5, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        );
      })}
      {/* Central flash */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(43 70% 65% / 0.6) 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
};

interface DoorIntroSceneProps {
  onEnter: () => void;
}

const DoorIntroScene = ({ onEnter }: DoorIntroSceneProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [zoomPhase, setZoomPhase] = useState<"idle" | "zoom" | "enter">("idle");
  const [showBurst, setShowBurst] = useState(false);
  const [shake, setShake] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    // Play sparkle sound immediately
    playSparkleSound();
    
    setShowBurst(true);
    setIsOpening(true);
    setZoomPhase("zoom");
    
    // Play door creak sound and trigger camera shake
    setTimeout(() => {
      playDoorCreakSound();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 200);
    
    // Start zoom after doors open
    setTimeout(() => {
      setZoomPhase("enter");
    }, 1800);
    
    // Complete transition
    setTimeout(() => {
      setShowContent(false);
      setTimeout(onEnter, 500);
    }, 2800);
  };

  return (
    <>
      {showContent && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at center, hsl(345 60% 12%) 0%, hsl(0 6% 4%) 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={shake ? {
            x: [0, -3, 3, -2, 2, -1, 1, 0],
            y: [0, 2, -2, 1, -1, 0],
          } : {}}
          transition={shake ? { duration: 0.5, ease: "easeOut" } : { duration: 0.5 }}
        >
          {/* WebGL Gradient Mesh Background */}
          <Suspense fallback={null}>
            <GradientMeshBackground />
          </Suspense>

          <GoldParticles />
          <LightRays />
          
          {/* Deep vignette for 3D depth */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 20%, hsl(0 6% 4% / 0.5) 70%, hsl(0 6% 4% / 0.8) 100%)",
            }}
          />

          {/* 3D Scene Container */}
          <motion.div
            className="relative"
            style={{ 
              perspective: "1500px",
              perspectiveOrigin: "center center",
            }}
            animate={
              zoomPhase === "zoom" 
                ? { scale: 1.1 }
                : zoomPhase === "enter"
                ? { scale: 3, opacity: 0 }
                : { scale: 1 }
            }
            transition={{ 
              duration: zoomPhase === "enter" ? 1.2 : 0.8,
              ease: "easeInOut"
            }}
          >
            {/* Door Frame with 3D Transform */}
            <motion.div
              className="relative w-72 md:w-80 lg:w-96 h-[450px] md:h-[520px] lg:h-[580px]"
              style={{ 
                transformStyle: "preserve-3d",
              }}
              initial={{ opacity: 0, rotateX: 10, y: 60 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            >
              {/* Glowing floor reflection */}
              <motion.div
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[150%] h-20"
                style={{
                  background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Door frame outer glow */}
              <div 
                className="absolute -inset-4 rounded-t-full"
                style={{
                  background: "linear-gradient(to bottom, hsl(var(--primary) / 0.2), transparent 50%)",
                  filter: "blur(20px)",
                }}
              />

              {/* Main Door Frame */}
              <div 
                className="absolute inset-0 rounded-t-full overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, hsl(var(--maroon-dark)) 0%, hsl(var(--maroon)) 100%)",
                  boxShadow: `
                    inset 0 0 60px hsl(var(--primary) / 0.1),
                    0 0 100px hsl(var(--primary) / 0.2),
                    0 20px 60px hsl(var(--background) / 0.8)
                  `,
                  border: "6px solid hsl(var(--primary) / 0.4)",
                }}
              >
                {/* Ornate frame pattern */}
                <div className="absolute top-3 left-3 right-3 h-16 border-2 border-primary/30 rounded-t-full" />
                <div className="absolute top-6 left-6 right-6 h-10 border border-primary/20 rounded-t-full" />
                <div className="absolute bottom-3 left-3 right-3 h-10 border-2 border-primary/30" />

                {/* Interior glow (visible through opening doors) */}
                <motion.div
                  className="absolute inset-8 rounded-t-full"
                  style={{
                    background: "radial-gradient(ellipse at center bottom, hsl(var(--primary) / 0.4) 0%, hsl(var(--primary) / 0.1) 50%, transparent 100%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />

                {/* Left Door */}
                <motion.div
                  className="absolute left-0 top-0 w-1/2 h-full origin-left"
                  style={{
                    transformStyle: "preserve-3d",
                    background: "linear-gradient(135deg, hsl(var(--maroon)) 0%, hsl(var(--maroon-light)) 50%, hsl(var(--maroon-dark)) 100%)",
                    borderRight: "2px solid hsl(var(--primary) / 0.3)",
                    borderTopLeftRadius: "100% 50%",
                    boxShadow: "inset -10px 0 30px hsl(var(--background) / 0.3)",
                  }}
                  animate={
                    isOpening
                      ? {
                          rotateY: -110,
                          transition: { duration: 1.8, ease: [0.4, 0, 0.2, 1] },
                        }
                      : {}
                  }
                >
                  {/* Door panels */}
                  <div className="absolute inset-6 border border-primary/20 rounded-tl-full">
                    <div className="absolute inset-4 border border-primary/10 rounded-tl-full" />
                  </div>
                  
                  {/* Gold ornament top */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2">
                    <motion.div 
                      className="w-14 h-14 rounded-full border-2 border-primary/40 flex items-center justify-center"
                      style={{
                        background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
                      }}
                      animate={{ 
                        boxShadow: [
                          "0 0 20px hsl(var(--primary) / 0.3)",
                          "0 0 40px hsl(var(--primary) / 0.5)",
                          "0 0 20px hsl(var(--primary) / 0.3)",
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-6 h-6 bg-primary/40 rounded-full" />
                    </motion.div>
                  </div>

                  {/* Door handle */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div 
                      className="w-5 h-7 rounded-full border-2 border-primary"
                      style={{
                        background: "linear-gradient(180deg, hsl(var(--gold-light)) 0%, hsl(var(--primary)) 100%)",
                        boxShadow: "0 0 15px hsl(var(--primary) / 0.5)",
                      }}
                    />
                  </div>
                </motion.div>

                {/* Right Door */}
                <motion.div
                  className="absolute right-0 top-0 w-1/2 h-full origin-right"
                  style={{
                    transformStyle: "preserve-3d",
                    background: "linear-gradient(225deg, hsl(var(--maroon)) 0%, hsl(var(--maroon-light)) 50%, hsl(var(--maroon-dark)) 100%)",
                    borderLeft: "2px solid hsl(var(--primary) / 0.3)",
                    borderTopRightRadius: "100% 50%",
                    boxShadow: "inset 10px 0 30px hsl(var(--background) / 0.3)",
                  }}
                  animate={
                    isOpening
                      ? {
                          rotateY: 110,
                          transition: { duration: 1.8, ease: [0.4, 0, 0.2, 1] },
                        }
                      : {}
                  }
                >
                  {/* Door panels */}
                  <div className="absolute inset-6 border border-primary/20 rounded-tr-full">
                    <div className="absolute inset-4 border border-primary/10 rounded-tr-full" />
                  </div>
                  
                  {/* Gold ornament top */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2">
                    <motion.div 
                      className="w-14 h-14 rounded-full border-2 border-primary/40 flex items-center justify-center"
                      style={{
                        background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
                      }}
                      animate={{ 
                        boxShadow: [
                          "0 0 20px hsl(var(--primary) / 0.3)",
                          "0 0 40px hsl(var(--primary) / 0.5)",
                          "0 0 20px hsl(var(--primary) / 0.3)",
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <div className="w-6 h-6 bg-primary/40 rounded-full" />
                    </motion.div>
                  </div>

                  {/* Door handle */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <div 
                      className="w-5 h-7 rounded-full border-2 border-primary"
                      style={{
                        background: "linear-gradient(180deg, hsl(var(--gold-light)) 0%, hsl(var(--primary)) 100%)",
                        boxShadow: "0 0 15px hsl(var(--primary) / 0.5)",
                      }}
                    />
                  </div>
                </motion.div>
              </div>

            </motion.div>
          </motion.div>

          {/* Logo - positioned at top center */}
          <motion.div
            className="absolute top-6 md:top-10 left-0 right-0 flex justify-center z-20"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <img 
              src={devjiLogo} 
              alt="Devji Since 1950" 
              className="h-16 md:h-20 lg:h-24 w-auto brightness-0 invert"
            />
          </motion.div>

          {/* Enter Button - fixed at bottom center */}
          <motion.div
            className="absolute bottom-16 md:bottom-20 left-0 right-0 flex justify-center z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.button
              onClick={handleEnter}
              disabled={isOpening}
              className="px-10 py-3 font-serif text-base tracking-[0.15em] uppercase rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsl(43 65% 53%) 0%, hsl(43 70% 65%) 50%, hsl(43 65% 53%) 100%)",
                color: "hsl(0 6% 4%)",
                boxShadow: "0 0 30px hsl(43 65% 53% / 0.4), inset 0 1px 0 hsl(43 70% 65% / 0.5)",
                border: "1px solid hsl(43 70% 65% / 0.5)",
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 50px hsl(43 65% 53% / 0.6)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Enter</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.button>
          </motion.div>

          {/* Sparkle Burst Effect */}
          <SparkleBurst isActive={showBurst} />

          {/* Bottom tagline */}
          <motion.p
            className="absolute bottom-6 left-0 right-0 text-center text-muted-foreground/50 text-xs tracking-[0.3em] uppercase z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Where Dreams Meet Tradition
          </motion.p>
        </motion.div>
      )}
    </>
  );
};

export default DoorIntroScene;