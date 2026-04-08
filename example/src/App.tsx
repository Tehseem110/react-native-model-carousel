import { ModelCarousel } from 'react-native-model-carousel';
import C1 from '../assets/3dFile/C1_JPG_Compressed.glb';
import C2 from '../assets/3dFile/C2_JPG_Compressed.glb';
import C3 from '../assets/3dFile/C3_New.glb';

export default function App() {
  return (
    <ModelCarousel
      models={[C1, C2, C3]}
      width="100%"
      height="100%"
      scale={1.5}
      position={[0, -3, 0]}
      cameraPosition={[0, 8, 6]}
      fov={40}
      autoRotate
      autoRotateSpeed={5}
      containerStyle={{ backgroundColor: '#f0f0f0' }}
    />
  );
}
