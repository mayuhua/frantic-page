import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface GLBModelLoaderProps {
  url: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  fallback?: React.ReactNode;
  onError?: () => void;
}

// Inner component that uses the hook
const ModelContent: React.FC<GLBModelLoaderProps> = ({
  url,
  position,
  scale,
  fallback,
  onError
}) => {
  const gltf = useGLTF(url);

  if (!gltf || !gltf.scene) {
    return (fallback || <div>Loading model...</div>) as React.ReactElement;
  }

  return (
    <primitive
      object={gltf.scene}
      position={position}
      scale={scale}
    />
  );
};

// Wrapper component with error boundary
const GLBModelLoader = ({
  url,
  position = [0, -1, 0],
  scale = [0.3, 0.3, 0.3],
  fallback = null,
  onError
}: GLBModelLoaderProps): React.ReactElement => {
  return (
    <Suspense fallback={(fallback || <div>Loading model...</div>) as React.ReactElement}>
      <ErrorBoundary fallback={fallback} onError={onError}>
        <ModelContent
          url={url}
          position={position}
          scale={scale}
          fallback={fallback}
          onError={onError}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: () => void;
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
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return (this.props.fallback || <div>Loading model...</div>) as React.ReactElement;
    }

    return this.props.children;
  }
}

export default GLBModelLoader;