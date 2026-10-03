import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const FloatingObjects = () => {
  const group = useRef<THREE.Group>(null);

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      mouse.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    if (!group.current) return;

    const time = state.clock.elapsedTime;

    // Gentle mouse parallax
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.current.x * 0.08,
      0.025
    );

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.current.y * 0.05,
      0.025
    );

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      mouse.current.x * 0.15,
      0.02
    );

    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      mouse.current.y * 0.1,
      0.02
    );

    group.current.rotation.z =
      Math.sin(time * 0.12) * 0.02;
  });

  return (
    <group ref={group}>

      {/* LEFT EDGE */}
      <Float speed={1.2} rotationIntensity={1} floatIntensity={2}>
     
      <mesh position={[-9, 3.5, -4]}>
          <icosahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#312e81"
            emissiveIntensity={1.8}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      </Float>

      {/* FAR LEFT MIDDLE */}
      <Float speed={1.6} rotationIntensity={1.3} floatIntensity={2}>
      
      <mesh position={[-10, 0, -3]}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#164e63"
            emissiveIntensity={1.6}
            roughness={0.2}
            metalness={0.25}
          />
        </mesh>
      </Float>

      

      {/* UPPER LEFT */}
      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-3.8, 4.2, -3]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#581c87"
            emissiveIntensity={1.6}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* CENTER TOP */}
      <Float speed={1.3} rotationIntensity={1} floatIntensity={1.8}>
        <mesh position={[0, 4.5, -4]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1e3a8a"
            emissiveIntensity={1.5}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      </Float>

      {/* CENTER */}
      <Float speed={1.5} rotationIntensity={1.2} floatIntensity={2}>
        <mesh position={[0.5, 0.5, -5]}>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#312e81"
            emissiveIntensity={1.7}
            roughness={0.25}
            metalness={0.25}
          />
        </mesh>
      </Float>

      {/* CENTER LOWER */}
      <Float speed={1.7} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-1, -3.5, -3]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#14532d"
            emissiveIntensity={1.5}
            roughness={0.25}
          />
        </mesh>
      </Float>

      {/* RIGHT EDGE */}
      <Float speed={1.4} rotationIntensity={1.3} floatIntensity={2}>
    
<mesh position={[9, 3.5, -4]}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#831843"
            emissiveIntensity={1.8}
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>
      </Float>

      {/* FAR RIGHT MIDDLE */}
      <Float speed={1.8} rotationIntensity={1} floatIntensity={1.7}>
     
<mesh position={[10, 0, -3]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#164e63"
            emissiveIntensity={1.7}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      </Float>

      {/* RIGHT LOWER */}
      <Float speed={1.3} rotationIntensity={1.2} floatIntensity={2}>
       
<mesh position={[9, -3.3, -3]}>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#713f12"
            emissiveIntensity={1.5}
            roughness={0.25}
            metalness={0.25}
          />
        </mesh>
      </Float>

      {/* UPPER RIGHT */}
      <Float speed={1.6} rotationIntensity={1.5} floatIntensity={1.8}>
        <mesh position={[3.8, 4.2, -3]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#7c2d12"
            emissiveIntensity={1.5}
            roughness={0.25}
          />
        </mesh>
      </Float>

     

    </group>
  );
};

export const InteractiveBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />

        <pointLight position={[0, 3, 4]} intensity={8} color="#6366f1" />

        <pointLight position={[-4, -2, 2]} intensity={5} color="#ec4899" />

        <Stars
          radius={30}
          depth={15}
          count={700}
          factor={2}
          saturation={0}
          fade
          speed={0.4}
        />

        <FloatingObjects />
      </Canvas>

      {/* Soft atmospheric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.10),transparent_45%)]" />
    </div>
  );
};