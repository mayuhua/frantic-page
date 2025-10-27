import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import GLBModelLoader from './GLBModelLoader';

// Placeholder component for loading state
const KampferPlaceholder: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#1e3a8a" wireframe />
    </mesh>
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
        <Suspense fallback={<KampferPlaceholder />}>
          <GLBModelLoader
            url="/models/Kampfer.glb"
            position={[0, -8, 0]}
            scale={[0.3, 0.3, 0.3]}
          />
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