import { createElement, Suspense } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';
import { useModelLoader } from '../hooks/useModelLoader';

type Props = {
  Model: any;
  modelPath: unknown;
  scale?: number;
  position?: number[];

  cameraPosition?: number[];
  fov?: number;

  autoRotate?: boolean;
  autoRotateSpeed?: number;

  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
};

const ModelViewer = ({
  modelPath,
  scale = 0.8,
  position = [0, -2.7, 0],

  cameraPosition = [0, 9, 5],
  fov = 35,

  autoRotate = true,
  autoRotateSpeed = 10,

  enableZoom = true,
  enablePan = true,
  enableRotate = true,
}: Props) => {
  const scene = useModelLoader(modelPath);

  return (
    <Canvas camera={{ position: cameraPosition, fov }}>
      {createElement('ambientLight' as any, { intensity: 2.5 })}

      <OrbitControls
        enableRotate={enableRotate}
        enableZoom={enableZoom}
        enablePan={enablePan}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
      />

      <Suspense fallback={null}>
        {createElement('primitive' as any, { object: scene, scale, position })}
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
