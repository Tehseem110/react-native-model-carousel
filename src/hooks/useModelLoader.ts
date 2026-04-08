import { useGLTF } from '@react-three/drei/native';

export const useModelLoader = (modelPath: unknown) => {
  const { scene } = useGLTF(modelPath as string);

  return scene;
};
