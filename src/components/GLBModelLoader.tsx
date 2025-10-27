import React from 'react';
import { useGLTF } from '@react-three/drei';

interface GLBModelLoaderProps {
  url: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  fallback?: React.ReactNode;
}

const GLBModelLoader = ({
  url,
  position = [0, -1, 0],
  scale = [0.3, 0.3, 0.3],
  fallback = null
}: GLBModelLoaderProps): React.ReactElement => {
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

export default GLBModelLoader;