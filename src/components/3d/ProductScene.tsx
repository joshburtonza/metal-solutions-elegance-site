import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#c4a035" 
        metalness={0.95} 
        roughness={0.1}
        wireframe
      />
    </mesh>
  );
}

function SteelFrame() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const beamPositions: [number, number, number][] = [
    [-1.5, 0, 0], [1.5, 0, 0], [0, -1.5, 0], [0, 1.5, 0]
  ];

  return (
    <group ref={groupRef}>
      {beamPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, i < 2 ? 0 : Math.PI / 2]}>
          <boxGeometry args={[0.1, 3, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      <mesh>
        <torusGeometry args={[1.2, 0.05, 16, 50]} />
        <meshStandardMaterial color="#c4a035" metalness={1} roughness={0.05} />
      </mesh>
    </group>
  );
}

export function ProductScene3D({ variant = 'cube' }: { variant?: 'cube' | 'frame' | 'sphere' }) {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={['#0a0a0a', 3, 15]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#d4a843" />
        <pointLight position={[-3, -3, 3]} intensity={0.5} color="#ffffff" />

        {variant === 'cube' && <RotatingCube />}
        {variant === 'frame' && <SteelFrame />}
        {variant === 'sphere' && (
          <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <mesh>
              <icosahedronGeometry args={[1.5, 1]} />
              <MeshDistortMaterial 
                color="#c4a035" 
                metalness={1} 
                roughness={0.05} 
                distort={0.3} 
                speed={3} 
              />
            </mesh>
          </Float>
        )}

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
