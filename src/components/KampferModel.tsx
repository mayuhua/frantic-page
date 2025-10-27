import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import GLBModelLoader from './GLBModelLoader';

// Custom 3D Kampfer Model (fallback)
const KampferFallback: React.FC = () => {
  return (
    <group position={[0, -8, 0]} scale={[0.3, 0.3, 0.3]}>
      {/* Body */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2, 3, 1]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[1.5, 1.5, 1]} />
        <meshStandardMaterial color="#4fc3f7" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arms */}
      <mesh position={[-1.5, 2.5, 0]}>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.5, 2.5, 0]}>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.6, 0, 0]}>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Antenna/V-Fin */}
      <mesh position={[0, 5, 0]}>
        <coneGeometry args={[0.3, 1, 4]} />
        <meshStandardMaterial color="#ff6b6b" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Error boundary component
const ModelWrapper: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  // Change this to use different GLB files:
  // "/models/kampfer.glb" - original (10.8MB)
  // "/models/kampfer-1.glb" - new larger version (67.8MB)
  // "/models/kampfer-compressed.glb" - compressed version (78.6MB)
  const modelUrl = "/models/kampfer.glb"; // <- CHANGE THIS LINE to switch models

  if (hasError) {
    return <KampferFallback />;
  }

  return (
    <GLBModelLoader
      url={modelUrl}
      position={[0, -4, 0]}
      scale={[0.008, 0.008, 0.008]}
      fallback={<KampferFallback />}
      onError={() => setHasError(true)}
    />
  );
};

const KampferModel: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas shadows className="opacity-80">
        <PerspectiveCamera makeDefault position={[6, 4, 6]} />
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI * 0.9}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4fc3f7" />
        <pointLight position={[10, -10, 10]} intensity={0.2} color="#ff6b6b" />

        {/* Environment */}
        <Environment preset="studio" />

        {/* Kampfer Model */}
        <Suspense fallback={<KampferFallback />}>
          <ModelWrapper />
        </Suspense>

        {/* Ground/Shadows */}
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.3}
          scale={8}
          blur={2}
          far={3}
        />
      </Canvas>
    </div>
  );
};

export default KampferModel;