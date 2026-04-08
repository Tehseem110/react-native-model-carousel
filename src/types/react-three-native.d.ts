declare module '@react-three/fiber/native' {
  import type { ReactNode } from 'react';

  export const Canvas: (props: {
    children?: ReactNode;
    camera?: Record<string, unknown>;
  }) => ReactNode;
}

declare module '@react-three/drei/native' {
  import type { ReactNode } from 'react';

  export const OrbitControls: (props: Record<string, unknown>) => ReactNode;

  export function useGLTF(path: string): { scene: unknown };

  export namespace useGLTF {
    function clear(path: string): void;
    function preload(path: string): void;
  }
}
