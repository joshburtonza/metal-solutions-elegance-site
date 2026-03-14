import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sphere } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GlowOrb({ position, color, size = 0.5, speed = 1 }: { position: [number, number, number]; color: string; size?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.8;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.3) * 0.4;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.2} 
          distort={0.4} 
          speed={2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function FloatingRing({ position, color, size = 1 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 + Math.PI * 0.3;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[size, 0.04, 32, 100]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.1} transparent opacity={0.5} />
      </mesh>
    </Float>
  );
}

function SoftParticles() {
  const count = 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 8 - 3,
        speed: Math.random() * 0.5 + 0.2,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    
    positions.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(state.clock.elapsedTime * p.speed + p.offset) * 0.5,
        p.y + Math.cos(state.clock.elapsedTime * p.speed * 0.7 + p.offset) * 0.8,
        p.z
      );
      dummy.scale.setScalar(0.02 + Math.sin(state.clock.elapsedTime * p.speed + p.offset) * 0.01);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} />
    </instancedMesh>
  );
}

export default function FuturisticScene({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className || ''}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#0f0d1a', 5, 20]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#a78bfa" />
        <pointLight position={[-5, -3, 3]} intensity={0.4} color="#67e8f9" />
        <pointLight position={[0, 3, -2]} intensity={0.3} color="#f0abfc" />

        <GlowOrb position={[-3, 1, -2]} color="#a78bfa" size={0.6} speed={1.2} />
        <GlowOrb position={[3, -1, -3]} color="#67e8f9" size={0.4} speed={0.8} />
        <GlowOrb position={[0, 2, -4]} color="#f0abfc" size={0.5} speed={1} />
        <GlowOrb position={[-2, -2, -2]} color="#67e8f9" size={0.3} speed={1.5} />
        
        <FloatingRing position={[2, 1, -2]} color="#a78bfa" size={1.5} />
        <FloatingRing position={[-3, -1, -3]} color="#67e8f9" size={1} />
        <FloatingRing position={[0, 0, -1]} color="#f0abfc" size={2} />
        
        <SoftParticles />
      </Canvas>
    </div>
  );
}
