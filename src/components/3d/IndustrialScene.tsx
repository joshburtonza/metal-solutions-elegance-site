import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SteelBeam({ position, rotation, scale }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation || [0, 0, 0]} scale={scale || [1, 1, 1]}>
      <boxGeometry args={[0.15, 4, 0.15]} />
      <meshStandardMaterial color="#c4a035" metalness={0.95} roughness={0.15} />
    </mesh>
  );
}

function FloatingPlate({ position, size }: { position: [number, number, number]; size?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={size || [2, 0.05, 1.5]} />
      <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
    </mesh>
  );
}

function GoldSphere({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <MeshDistortMaterial color="#d4a843" metalness={1} roughness={0.1} distort={0.2} speed={2} />
      </mesh>
    </Float>
  );
}

function GridFloor() {
  const gridHelper = useMemo(() => {
    const grid = new THREE.GridHelper(20, 20, '#c4a035', '#222222');
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    return grid;
  }, []);

  return <primitive object={gridHelper} position={[0, -3, 0]} />;
}

export default function IndustrialScene({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className || ''}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#0a0a0a', 5, 25]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#d4a843" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#ffffff" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} color="#d4a843" />

        <SteelBeam position={[-3, 0, -2]} rotation={[0.3, 0.5, 0.1]} />
        <SteelBeam position={[3, 1, -3]} rotation={[-0.2, 0.8, 0.3]} scale={[1.5, 1.5, 1.5]} />
        <SteelBeam position={[1, -2, -1]} rotation={[0.5, -0.3, 0.7]} scale={[0.8, 0.8, 0.8]} />
        
        <FloatingPlate position={[-2, 1, -1]} />
        <FloatingPlate position={[2, -1, -2]} size={[1.5, 0.08, 1]} />
        
        <GoldSphere position={[0, 2, -2]} />
        <GoldSphere position={[-4, -1, -3]} />
        
        <GridFloor />
      </Canvas>
    </div>
  );
}
