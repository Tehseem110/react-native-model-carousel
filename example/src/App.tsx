import { ModelCarousel } from 'react-native-model-carousel';
import { Pressable, StyleSheet, Text } from 'react-native';
import C1 from '../assets/3dFile/C1_JPG_Compressed.glb';
import Werewolf from '../assets/3dFile/werewolf.glb';
import Dog from '../assets/3dFile/dog.glb';

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
      autoRotate
      autoRotateSpeed={5}
      containerStyle={{ backgroundColor: '#f0f0f0' }}
      renderPrevButton={({ onPress, disabled }) => (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.customButton,
            pressed && styles.customButtonPressed,
            disabled && styles.customButtonDisabled,
          ]}
        >
          <Text style={styles.customButtonText}>PREV</Text>
        </Pressable>
      )}
      renderNextButton={({ onPress, disabled }) => (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.customButton,
            styles.customButtonNext,
            pressed && styles.customButtonPressed,
            disabled && styles.customButtonDisabled,
          ]}
        >
          <Text style={styles.customButtonText}>NEXT</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  customButton: {
    minWidth: 88,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#12365f',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6ca2dc',
  },
  customButtonNext: {
    backgroundColor: '#144b39',
    borderColor: '#6bcfa8',
  },
  customButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  customButtonDisabled: {
    opacity: 0.5,
  },
  customButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
