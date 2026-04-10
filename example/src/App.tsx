import { ModelCarousel } from 'react-native-model-carousel';
import C1 from '../assets/3dFile/C1_JPG_Compressed.glb';
import Werewolf from '../assets/3dFile/werewolf.glb';
import Dog from '../assets/3dFile/dog.glb';

const styles = {
  container: {
    backgroundColor: '#f0f0f0',
  },
} as const;

export default function App() {
  return (
    <ModelCarousel
      models={[
        {
          path: C1,
          scale: 0.6,
          position: [0, -2, 0],
          cameraPosition: [0, 8, 6],
        },
        {
          path: Werewolf,
          scale: 2,
          position: [0, 0.3, 0],
          cameraPosition: [0, 3.5, 4.5],
        },
        {
          path: Dog,
          scale: 1.4,
          position: [0, -0.6, 0],
          cameraPosition: [0, 5, 6],
        },
      ]}
      width="100%"
      height="100%"
      scale={0.8}
      position={[0, -3, 0]}
      cameraPosition={[0, 8, 6]}
      fov={40}
      autoRotate={true}
      autoRotateSpeed={5}
      autoPlay
      autoPlayInterval={2500}
      containerStyle={styles.container}
    />
  );
}
