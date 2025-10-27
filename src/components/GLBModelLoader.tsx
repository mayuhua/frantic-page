import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface GLBModelLoaderProps {
  url: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  fallback?: React.ReactNode;
  onError?: () => void;
}

const GLBModelLoader = ({
  url,
  position = [0, -1, 0],
  scale = [0.3, 0.3, 0.3],
  fallback = null,
  onError
}: GLBModelLoaderProps): React.ReactElement => {
  let gltf;

  try {
    gltf = useGLTF(url);
  } catch (error) {
    console.error('Failed to load 3D model:', error);
    if (onError) {
      onError();
    }
    return (fallback || <div>Loading model...</div>) as React.ReactElement;
  }

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

export default GLBModelLoader;