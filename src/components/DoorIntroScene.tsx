import { motion } from "framer-motion";
import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import devjiLogo from "@/assets/devji-logo.png";
import GradientMeshBackground from "./GradientMeshBackground";

interface GoldParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseX: number;
  baseY: number;
  phase: number;
}

interface GoldParticlesProps {
  mousePosition: { x: number; y: number };
}

const GoldParticles = ({ mousePosition }: GoldParticlesProps) => {
  const [particles, setParticles] = useState<GoldParticle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const newParticles: GoldParticle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: 0,
      vy: 0,
      size: Math.random() * 4 + 1.5,
      baseX: Math.random() * 100,
      baseY: Math.random() * 100,
      phase: Math.random() * Math.PI * 2,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      setParticles(prev => prev.map(p => {
        // Mouse repulsion
        const dx = p.x - mousePosition.x * 100;
        const dy = p.y - mousePosition.y * 100;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 15;
        const repulsionStrength = 80;
        
        let fx = 0, fy = 0;
        if (dist < repulsionRadius && dist > 0) {
          const force = (1 - dist / repulsionRadius) * repulsionStrength;
          fx = (dx / dist) * force;
          fy = (dy / dist) * force;
        }
        
        // Gentle drift back to base with floating motion
        const time = currentTime * 0.0003;
        const targetX = p.baseX + Math.sin(time + p.phase) * 3;
        const targetY = p.baseY + Math.cos(time * 0.7 + p.phase) * 4;
        
        const returnForce = 0.8;
        fx += (targetX - p.x) * returnForce;
        fy += (targetY - p.y) * returnForce;
        
        // Apply velocity with damping
        const newVx = (p.vx + fx * delta) * 0.95;
        const newVy = (p.vy + fy * delta) * 0.95;
        
        return {
          ...p,
          x: Math.max(0, Math.min(100, p.x + newVx * delta * 60)),
          y: Math.max(0, Math.min(100, p.y + newVy * delta * 60)),
          vx: newVx,
          vy: newVy,
        };
      }));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, hsl(43 70% 70%) 0%, hsl(43 60% 50%) 40%, transparent 70%)`,
            boxShadow: `0 0 ${particle.size * 3}px hsl(43 65% 55% / 0.6)`,
            transform: 'translate(-50%, -50%)',
            transition: 'none',
          }}
        />
      ))}
    </div>
  );
};

// Cinematic ambient light rays
const AmbientLightRays = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full"
          style={{
            left: `${10 + i * 12}%`,
            width: '2px',
            background: `linear-gradient(to bottom, transparent 0%, hsl(43 50% 45% / 0.15) 30%, hsl(43 50% 45% / 0.08) 70%, transparent 100%)`,
            filter: 'blur(1px)',
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scaleY: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 4 + i * 0.8,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Dramatic light beam that shoots through doors
const DoorLightBeam = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Main central beam */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-center"
        style={{
          width: '200px',
          height: '800px',
          background: `linear-gradient(to bottom, 
            transparent 0%,
            hsl(43 70% 65% / 0.03) 20%,
            hsl(43 70% 65% / 0.15) 40%,
            hsl(43 80% 70% / 0.25) 50%,
            hsl(43 70% 65% / 0.15) 60%,
            hsl(43 70% 65% / 0.03) 80%,
            transparent 100%
          )`,
          filter: 'blur(8px)',
        }}
        initial={{ scaleY: 0, opacity: 0, y: '-50%' }}
        animate={{ scaleY: 1, opacity: 1, y: '-50%' }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      
      {/* Intense core beam */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-center"
        style={{
          width: '60px',
          height: '600px',
          background: `linear-gradient(to bottom, 
            transparent 0%,
            hsl(43 80% 75% / 0.2) 30%,
            hsl(43 90% 80% / 0.4) 50%,
            hsl(43 80% 75% / 0.2) 70%,
            transparent 100%
          )`,
          filter: 'blur(4px)',
        }}
        initial={{ scaleY: 0, opacity: 0, y: '-50%' }}
        animate={{ scaleY: 1, opacity: 1, y: '-50%' }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      
      {/* Horizontal light spread */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '100vw',
          height: '300px',
          background: `radial-gradient(ellipse 50% 100% at center, 
            hsl(43 70% 65% / 0.12) 0%,
            hsl(43 60% 55% / 0.06) 40%,
            transparent 70%
          )`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
      />
      
      {/* Light particles in beam */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `calc(50% + ${(Math.random() - 0.5) * 80}px)`,
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: 'hsl(43 80% 75%)',
            boxShadow: '0 0 6px hsl(43 80% 70% / 0.8)',
          }}
          initial={{ y: '60vh', opacity: 0 }}
          animate={{ y: '-60vh', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2 + Math.random(),
            delay: 0.5 + Math.random() * 0.8,
            ease: "easeOut",
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
  const [showBurst, setShowBurst] = useState(false);
  const [showLightBeam, setShowLightBeam] = useState(false);
  const [shake, setShake] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [cinematicPhase, setCinematicPhase] = useState(0); // 0=idle, 1=doors opening, 2=slow move, 3=fade
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    }
  }, []);

  const handleEnter = () => {
    setShowBurst(true);
    setIsOpening(true);
    setCinematicPhase(1);
    
    // Subtle shake
    setTimeout(() => {
      setShowLightBeam(true);
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }, 100);
    
    // Start slow cinematic move forward
    setTimeout(() => setCinematicPhase(2), 800);
    
    // Fade out
    setTimeout(() => setCinematicPhase(3), 2800);
    
    // Complete
    setTimeout(() => {
      setShowContent(false);
      onEnter();
    }, 3500);
  };

  return (
    <>
      {showContent && (
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-none"
          style={{
            background: "radial-gradient(ellipse at center, hsl(345 50% 8%) 0%, hsl(0 5% 3%) 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={shake ? {
            x: [0, -2, 2, -1.5, 1.5, -0.5, 0.5, 0],
            y: [0, 1, -1, 0.5, -0.5, 0],
          } : {}}
          transition={shake ? { duration: 0.4, ease: "easeOut" } : { duration: 0.5 }}
        >
          {/* Film grain overlay for cinematic feel */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* WebGL Gradient Mesh Background - moves slower for parallax */}
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: cinematicPhase === 0 ? 1 : cinematicPhase === 1 ? 1.02 : cinematicPhase === 2 ? 1.2 : 1.5,
            }}
            transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Suspense fallback={null}>
              <GradientMeshBackground />
            </Suspense>
          </motion.div>

          {/* Particles layer - moves at medium speed */}
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: cinematicPhase === 0 ? 1 : cinematicPhase === 1 ? 1.03 : cinematicPhase === 2 ? 1.4 : 1.8,
              opacity: cinematicPhase >= 3 ? 0 : 1,
            }}
            transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <GoldParticles mousePosition={mousePosition} />
          </motion.div>
          
          {/* Light rays - moves faster for depth */}
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: cinematicPhase === 0 ? 1 : cinematicPhase === 1 ? 1.05 : cinematicPhase === 2 ? 1.6 : 2,
              opacity: cinematicPhase >= 3 ? 0 : 1,
            }}
            transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <AmbientLightRays />
          </motion.div>
          
          <DoorLightBeam isActive={showLightBeam} />
          
          {/* Deep cinematic vignette */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 15%, hsl(0 5% 3% / 0.4) 50%, hsl(0 5% 3% / 0.85) 100%)",
            }}
            animate={{
              opacity: cinematicPhase >= 2 ? 0.4 : 1,
            }}
            transition={{ duration: 1.5 }}
          />

          {/* Cinematic letterbox bars */}
          <motion.div
            className="absolute top-0 left-0 right-0 bg-black z-40"
            initial={{ height: 0 }}
            animate={{ height: cinematicPhase >= 1 ? "6vh" : 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black z-40"
            initial={{ height: 0 }}
            animate={{ height: cinematicPhase >= 1 ? "6vh" : 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Slow cinematic fade to gold at the end */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-50"
            style={{
              background: "radial-gradient(ellipse at center, hsl(43 60% 90%) 0%, hsl(43 50% 95%) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: cinematicPhase >= 3 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* 3D Scene Container - Smooth cinematic camera */}
          <motion.div
            className="relative"
            style={{ 
              perspective: "1500px",
              perspectiveOrigin: "center center",
            }}
            animate={{
              scale: cinematicPhase === 0 ? 1 : cinematicPhase === 1 ? 1.1 : cinematicPhase === 2 ? 2.2 : 4,
            }}
            transition={{ 
              duration: cinematicPhase === 2 ? 2 : 0.8,
              ease: [0.25, 0.1, 0.25, 1],
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