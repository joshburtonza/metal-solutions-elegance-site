import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GoldOrb({ position, size = 0.5, speed = 1 }: { position: [number, number, number]; size?: number; speed?: number }) {
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
          color="#c8972e"
          metalness={0.9} 
          roughness={0.1} 
          distort={0.35} 
          speed={2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function GoldRing({ position, size = 1 }: { position: [number, number, number]; size?: number }) {
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
        <meshStandardMaterial color="#d4a540" metalness={0.95} roughness={0.05} transparent opacity={0.6} />
      </mesh>
    </Float>
  );
}

function GoldParticles() {
  const count = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 10 - 3,
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
        p.x + Math.sin(state.clock.elapsedTime * p.speed + p.offset) * 0.6,
        p.y + Math.cos(state.clock.elapsedTime * p.speed * 0.7 + p.offset) * 1,
        p.z
      );
      const s = 0.02 + Math.sin(state.clock.elapsedTime * p.speed + p.offset) * 0.015;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#d4a540" transparent opacity={0.5} />
    </instancedMesh>
  );
}

export default function FuturisticScene({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className || ''}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#080808', 5, 20]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#d4a540" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#c8972e" />
        <pointLight position={[0, 3, -2]} intensity={0.3} color="#8b6914" />

        <GoldOrb position={[-3, 1, -2]} size={0.7} speed={1.2} />
        <GoldOrb position={[3, -1, -3]} size={0.4} speed={0.8} />
        <GoldOrb position={[0, 2, -4]} size={0.5} speed={1} />
        <GoldOrb position={[-2, -2, -2]} size={0.3} speed={1.5} />
        
        <GoldRing position={[2, 1, -2]} size={1.5} />
        <GoldRing position={[-3, -1, -3]} size={1} />
        <GoldRing position={[0, 0, -1]} size={2.2} />
        
        <GoldParticles />
      </Canvas>
    </div>
  );
}
