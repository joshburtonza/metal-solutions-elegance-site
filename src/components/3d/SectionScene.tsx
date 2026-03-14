import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function MorphSphere({ position, color, size = 0.8 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 4]} />
        <MeshDistortMaterial color={color} metalness={0.9} roughness={0.1} distort={0.3} speed={3} transparent opacity={0.6} />
      </mesh>
    </Float>
  );
}

function GlassPanel({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[2, 2.5]} />
      <meshPhysicalMaterial 
        color="#d4a540" 
        metalness={0.3} 
        roughness={0.05} 
        transmission={0.85} 
        thickness={0.1}
        transparent 
        opacity={0.08}
      />
    </mesh>
  );
}

export function SectionScene3D({ variant = 'default' }: { variant?: 'default' | 'products' | 'testimonials' }) {
  const colors = {
    default: { primary: '#d4a540', secondary: '#c8972e' },
    products: { primary: '#c8972e', secondary: '#8b6914' },
    testimonials: { primary: '#e8c547', secondary: '#d4a540' },
  };
  
  const c = colors[variant];

  return (
    <div className="w-full h-[200px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#080808', 3, 15]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} intensity={0.8} color={c.primary} />
        <pointLight position={[-3, -2, 2]} intensity={0.4} color={c.secondary} />
        
        <MorphSphere position={[-1.5, 0, 0]} color={c.primary} size={0.6} />
        <MorphSphere position={[1.5, 0, -1]} color={c.secondary} size={0.4} />
        <GlassPanel position={[0, 0, -2]} rotation={[0, 0.3, 0]} />
      </Canvas>
    </div>
  );
}
