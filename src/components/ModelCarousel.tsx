import { useState } from 'react';
import type { ComponentType } from 'react';
import { View, Pressable, Text } from 'react-native';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import ModelViewer from './ModelViewer';

type Props = {
  models: unknown[];

  // layout
  width?: DimensionValue;
  height?: DimensionValue;
  containerStyle?: StyleProp<ViewStyle>;

  // model props
  scale?: number;
  position?: number[];

  // camera
  cameraPosition?: number[];
  fov?: number;

  // controls
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

const ModelCarousel = ({
  models,

  width = '100%',
  height = '100%',
  containerStyle,

  scale,
  position,

  cameraPosition,
  fov,

  autoRotate,
  autoRotateSpeed,
}: Props) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((current) => (current + 1) % models.length);
  const prev = () =>
    setIndex((current) => (current - 1 + models.length) % models.length);

  const ModelComponent: ComponentType = () => <></>;

  return (
    <View style={[{ width, height }, containerStyle]}>
      <ModelViewer
        modelPath={models[index]}
        Model={ModelComponent}
        scale={scale}
        position={position}
        cameraPosition={cameraPosition}
        fov={fov}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 40,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}
      >
        <Pressable onPress={prev}>
          <Text style={{ fontSize: 30 }}>{'<'}</Text>
        </Pressable>

        <Pressable onPress={next}>
          <Text style={{ fontSize: 30 }}>{'>'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ModelCarousel;
