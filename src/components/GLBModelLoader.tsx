import React, { Suspense } from 'react';
import { useGLTF, useProgress } from '@react-three/drei';

interface GLBModelLoaderProps {
  url: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
  onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
}

// Progress tracking component
const ProgressTracker: React.FC<{
  onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
}> = ({ onProgress, onLoadStart, onLoadComplete }) => {
  const { progress, loaded, total } = useProgress();

  React.useEffect(() => {
    if (progress === 0 && onLoadStart) {
      onLoadStart();
    }
  }, [progress, onLoadStart]);

  React.useEffect(() => {
    if (onProgress) {
      onProgress({
        loaded,
        total,
        percentage: Math.round(progress)
      });
    }
  }, [loaded, total, progress, onProgress]);

  React.useEffect(() => {
    if (progress === 100 && onLoadComplete) {
      onLoadComplete();
    }
  }, [progress, onLoadComplete]);

  return null; // This component doesn't render anything
};

// Inner component that uses the hook
const ModelContent: React.FC<GLBModelLoaderProps> = ({
  url,
  position,
  scale,
  fallback,
  onError,
  onProgress,
  onLoadStart,
  onLoadComplete
}) => {
  const gltf = useGLTF(url);

  console.log('📦 Loading GLTF model from:', url);
  console.log('✅ GLTF loaded:', !!gltf);
  console.log('🎬 GLTF scene:', !!gltf?.scene);
  console.log('🎭 GLTF scene children count:', gltf?.scene?.children?.length || 0);

  if (!gltf || !gltf.scene) {
    return fallback as React.ReactElement || null;
  }

  return (
    <>
      <ProgressTracker
        onProgress={onProgress}
        onLoadStart={onLoadStart}
        onLoadComplete={onLoadComplete}
      />
      <primitive
        object={gltf.scene}
        position={position}
        scale={scale}
      />
    </>
  );
};

// Wrapper component with error boundary
const GLBModelLoader: React.FC<GLBModelLoaderProps> = ({
  url,
  position = [0, -8, 0],
  scale = [0.1, 0.1, 0.1],
  fallback = null,
  onError,
  onProgress,
  onLoadStart,
  onLoadComplete
}) => {
  return (
    <Suspense fallback={fallback || null}>
      <ErrorBoundary fallback={fallback} onError={onError}>
        <ModelContent
          url={url}
          position={position}
          scale={scale}
          fallback={fallback}
          onError={onError}
          onProgress={onProgress}
          onLoadStart={onLoadStart}
          onLoadComplete={onLoadComplete}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Failed to load 3D model:', error);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

export default GLBModelLoader;