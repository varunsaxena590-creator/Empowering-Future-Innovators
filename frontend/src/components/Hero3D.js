/**
 * @file components/Hero3D.js
 * @description 3D animated hero scene using Three.js + React Three Fiber.
 *
 * Scene elements:
 *   - CoreOrb: Central gold glowing sphere with distortion material
 *   - OrbitSphere: 3 small spheres orbiting the core
 *   - SpinRing: 2 spinning torus rings (gold + purple)
 *   - FloatCube: 3 floating wireframe cubes
 *   - Stars: 4000 star particles background
 *   - 3 point lights: gold, purple, light-gold
 *
 * Fallback: CSS-only animated gradient orb for low-end devices
 */
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, Torus, Box } from '@react-three/drei';

/* Central glowing energy orb */
const CoreOrb = () => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.4;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.2;
    }
  });
  return (
    <Float speed={1.5} floatIntensity={0.8}>
      <Sphere ref={ref} args={[1.4, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#d4af37"
          distort={0.35}
          speed={2.5}
          roughness={0.05}
          metalness={0.9}
          emissive="#7c3aed"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
};

/* Orbiting small sphere */
const OrbitSphere = ({ radius, speed, color, size }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 0.7) * 0.8;
    }
  });
  return (
    <Sphere ref={ref} args={[size, 32, 32]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.8} roughness={0.1} />
    </Sphere>
  );
};

/* Spinning ring */
const SpinRing = ({ radius, tube, color, speed, tilt }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.elapsedTime * speed;
      ref.current.rotation.x = tilt;
    }
  });
  return (
    <Torus ref={ref} args={[radius, tube, 16, 100]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0} />
    </Torus>
  );
};

/* Floating wireframe cube */
const FloatCube = ({ position, color, speed }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.elapsedTime * speed;
      ref.current.rotation.y = clock.elapsedTime * speed * 0.7;
    }
  });
  return (
    <Float speed={speed * 2} floatIntensity={1.5}>
      <Box ref={ref} args={[0.3, 0.3, 0.3]} position={position}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} wireframe />
      </Box>
    </Float>
  );
};

const isLowEnd = () => {
  try {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  } catch (_) {}
  return false;
};

// CSS-only fallback for low-end devices
const Hero3DFallback = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
    {/* Animated gradient orb */}
    <div style={{ width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, #f0c040, #d4af37 40%, #7c3aed 80%, transparent)', opacity: 0.55, animation: 'orbFloat 6s ease-in-out infinite', filter: 'blur(2px)' }} />
    {/* Orbiting dots */}
    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <div key={deg} style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: deg % 120 === 0 ? '#7c3aed' : '#d4af37', animation: `orbit${deg % 360 < 180 ? 'A' : 'B'} ${4 + (deg / 60) * 0.5}s linear infinite`, transformOrigin: '130px 130px', transform: `rotate(${deg}deg) translateX(130px)` }} />
    ))}
    <style>{`
      @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.05)} }
      @keyframes orbitA { from{transform:rotate(0deg) translateX(130px)} to{transform:rotate(360deg) translateX(130px)} }
      @keyframes orbitB { from{transform:rotate(0deg) translateX(110px)} to{transform:rotate(-360deg) translateX(110px)} }
    `}</style>
  </div>
);

const Hero3D = () => {
  if (isLowEnd()) return <Hero3DFallback />;
  return (
    <Canvas camera={{ position: [0, 1, 8], fov: 55 }} style={{ background: 'transparent' }}>
    <ambientLight intensity={0.2} />
    <pointLight position={[5, 5, 5]} intensity={2} color="#d4af37" />
    <pointLight position={[-5, -5, -5]} intensity={1} color="#7c3aed" />
    <pointLight position={[0, 8, 0]} intensity={1.5} color="#f0c040" />

    <Stars radius={80} depth={60} count={4000} factor={3} saturation={0} fade speed={0.8} />

    <CoreOrb />
    <OrbitSphere radius={3.2} speed={0.6} color="#d4af37" size={0.22} />
    <OrbitSphere radius={2.5} speed={-0.9} color="#7c3aed" size={0.18} />
    <OrbitSphere radius={4} speed={0.4} color="#f0c040" size={0.14} />

    <SpinRing radius={2.5} tube={0.04} color="#d4af37" speed={0.5} tilt={0.5} />
    <SpinRing radius={3.5} tube={0.025} color="#7c3aed" speed={-0.3} tilt={1.1} />

    <FloatCube position={[3.5, 1.5, -1]} color="#d4af37" speed={0.8} />
    <FloatCube position={[-3, 1, -2]} color="#7c3aed" speed={1.2} />
    <FloatCube position={[2, -2, -1]} color="#f0c040" speed={0.6} />
  </Canvas>
  );
};

export default Hero3D;
