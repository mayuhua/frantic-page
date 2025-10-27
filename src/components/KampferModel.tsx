import React, { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import GLBModelLoader from './GLBModelLoader';
import SmartModelSelector from './SmartModelSelector';
import ModelLoadingIndicator, { LoadingStatus } from './ModelLoadingIndicator';
import { ModelConfiguration } from '../utils/modelRecommendationEngine';

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

// Model configurations
const availableModels: ModelConfiguration[] = [
  {
    id: 'zeon-standard',
    name: 'Zeon (Standard)',
    url: '/models/zeon.glb',
    fileSize: 857 * 1024, // 857 KB
    quality: 'medium',
    description: 'Balanced version with good quality and reasonable performance',
    features: ['Good quality', 'Balanced performance', 'Recommended for most users'],
    position: [0, -4, 0], // Default position for zeon.glb
    scale: [0.008, 0.008, 0.008], // Default scale for zeon.glb
    minRequirements: {
      networkSpeed: 2,
      deviceMemory: 4,
      gpuTier: 'medium'
    },
    recommendedFor: ['Desktop users', 'Standard connections', 'Modern hardware']
  },
  {
    id: 'kampfer-hd',
    name: 'Kampfer (HD)',
    url: '/models/kampfer-1-optimized.glb',
    fileSize: 67.8 * 1024 * 1024, // 67.8 MB
    quality: 'high',
    description: 'High definition version with maximum detail and quality',
    features: ['Maximum detail', 'Best visual quality', 'Advanced lighting'],
    position: [0, -5, 0], // Specific position for kampfer-1-optimized.glb
    scale: [0.3, 0.3, 0.3], // Specific scale for kampfer-1-optimized.glb
    minRequirements: {
      networkSpeed: 10,
      deviceMemory: 8,
      gpuTier: 'high'
    },
    recommendedFor: ['High-end devices', 'Fast connections', 'Quality enthusiasts']
  }
];


const KampferModel: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('zeon-standard');
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('pending');
  const [loadingProgress, setLoadingProgress] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get current model configuration
  const currentModel = availableModels.find(m => m.id === selectedModelId) || availableModels[0];

  // Handle model change
  const handleModelChange = useCallback((modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    console.log('🔄 Switching to model:', modelId, model?.name || 'Unknown');
    console.log('📁 Model URL:', model?.url || 'Not found');
    console.log('📍 Model Position:', model?.position || [0, -4, 0]);
    console.log('📏 Model Scale:', model?.scale || [0.008, 0.008, 0.008]);
    setSelectedModelId(modelId);
    setError(null);
    setLoadingStatus('loading');
  }, []);

  // Handle loading progress
  const handleLoadingProgress = useCallback((progress: any) => {
    setLoadingProgress(progress);
    if (progress.percentage >= 100) {
      setLoadingStatus('processing');
      setTimeout(() => {
        setLoadingStatus('ready');
        setTimeout(() => setLoadingStatus('pending'), 2000);
      }, 1000);
    }
  }, []);

  // Handle loading error
  const handleLoadingError = useCallback((error: Error) => {
    console.error('3D model loading error:', error);
    setError('Failed to load 3D model');
    setLoadingStatus('error');
  }, []);

  // Handle loading cancel
  const handleLoadingCancel = useCallback(() => {
    setLoadingStatus('pending');
    setLoadingProgress(null);
    setError(null);
  }, []);

  // Handle loading retry
  const handleLoadingRetry = useCallback(() => {
    setError(null);
    setLoadingStatus('loading');
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* Canvas for 3D Scene */}
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
          <GLBModelLoader
            url={currentModel.url}
            position={currentModel.position || [0, -4, 0]}
            scale={currentModel.scale || [0.008, 0.008, 0.008]}
            fallback={<KampferFallback />}
            onError={handleLoadingError}
            onProgress={handleLoadingProgress}
            onLoadStart={() => setLoadingStatus('loading')}
            onLoadComplete={() => setLoadingStatus('ready')}
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

      {/* Smart Model Selector - Outside Canvas */}
      <SmartModelSelector
        models={availableModels}
        onModelChange={handleModelChange}
        currentModelId={selectedModelId}
        showAdvancedControls={true}
        position="bottom-right"
        autoDetect={true}
      />

      {/* Loading Indicator - Outside Canvas */}
      {(loadingStatus === 'loading' || loadingStatus === 'processing' || loadingStatus === 'error') && (
        <ModelLoadingIndicator
          status={loadingStatus}
          progress={loadingProgress}
          modelName={currentModel.name}
          fileSize={currentModel.fileSize}
          error={error || undefined}
          onCancel={handleLoadingCancel}
          onRetry={handleLoadingRetry}
          showDetails={true}
        />
      )}
    </div>
  );
};

export default KampferModel;