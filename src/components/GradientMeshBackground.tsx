import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  varying float vDistortion;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    float distortion = sin(pos.x * 3.0 + uTime) * 0.3 + 
                       cos(pos.y * 2.0 + uTime * 0.8) * 0.3;
    pos.z += distortion;
    vDistortion = distortion;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vDistortion;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  
  void main() {
    // Create flowing gradient
    float mixFactor1 = sin(vUv.x * 3.14159 + uTime * 0.5) * 0.5 + 0.5;
    float mixFactor2 = cos(vUv.y * 3.14159 + uTime * 0.3) * 0.5 + 0.5;
    float mixFactor3 = sin((vUv.x + vUv.y) * 2.0 + uTime * 0.4) * 0.5 + 0.5;
    
    // Blend colors
    vec3 color1 = mix(uColor1, uColor2, mixFactor1);
    vec3 color2 = mix(uColor3, uColor4, mixFactor2);
    vec3 finalColor = mix(color1, color2, mixFactor3);
    
    // Add subtle glow based on distortion
    finalColor += vec3(0.1, 0.05, 0.02) * (vDistortion + 0.5);
    
    // Vignette effect
    float vignette = 1.0 - length(vUv - 0.5) * 0.8;
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const GradientMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(0x1a0808) }, // Deep maroon
    uColor2: { value: new THREE.Color(0x2d1a1a) }, // Dark maroon
    uColor3: { value: new THREE.Color(0x0a0a0a) }, // Near black
    uColor4: { value: new THREE.Color(0x3d2929) }, // Warm maroon with gold hint
  }), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} scale={[4, 4, 1]} position={[0, 0, -2]}>
      <planeGeometry args={[4, 4, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

// Floating orbs with gold glow
const GlowOrbs = () => {
  const orbsRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 2 - 1
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2,
    })), []);

  useFrame(({ clock }) => {
    if (orbsRef.current) {
      orbsRef.current.children.forEach((orb, i) => {
        const data = orbs[i];
        orb.position.y = data.position[1] + Math.sin(clock.elapsedTime * data.speed + data.offset) * 0.5;
        orb.position.x = data.position[0] + Math.cos(clock.elapsedTime * data.speed * 0.7 + data.offset) * 0.3;
      });
    }
  });

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={0xd4a373}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
};

const GradientMeshBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <GradientMesh />
        <GlowOrbs />
      </Canvas>
    </div>
  );
};

export default GradientMeshBackground;