import { useGLTF } from '@react-three/drei/native';
import { useEffect } from 'react';

export const useModelLoader = (modelPath: unknown) => {
  const { scene } = useGLTF(modelPath as string);

  useEffect(() => {
    return () => {
      useGLTF.clear(modelPath as string);
    };
  }, [modelPath]);

  return scene;
};
