import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { useGLTF } from '@react-three/drei/native';
import ModelViewer from './ModelViewer';

export type ModelCarouselConfiguredItem = {
  path: unknown;
  scale?: number;
  position?: number[];
  cameraPosition?: number[];
};

export type ModelCarouselItem = unknown | ModelCarouselConfiguredItem;

type Props = {
  models: ModelCarouselItem[];

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

  // transition
  transitionDuration?: number;
  transitionScale?: number;
};

const isConfiguredModel = (
  item: ModelCarouselItem
): item is ModelCarouselConfiguredItem => {
  return typeof item === 'object' && item !== null && 'path' in item;
};

const getModelPath = (item: ModelCarouselItem) =>
  isConfiguredModel(item) ? item.path : item;

const getResolvedValue = <T,>(
  itemValue: T | undefined,
  fallbackValue: T | undefined
) => itemValue ?? fallbackValue;

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

  transitionDuration = 260,
  transitionScale = 0.96,
}: Props) => {
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const zoom = useRef(new Animated.Value(1)).current;
  const isAnimating = useRef(false);

  useEffect(() => {
    if (models.length === 0) {
      setIndex(0);
      return;
    }

    if (index >= models.length) {
      setIndex(0);
    }
  }, [index, models.length]);

  useEffect(() => {
    models.forEach((modelItem) => {
      useGLTF.preload(getModelPath(modelItem) as string);
    });
  }, [models]);

  const runTransition = (nextIndex: number) => {
    if (isAnimating.current || models.length <= 1) {
      return;
    }

    isAnimating.current = true;

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: Math.round(transitionDuration * 0.45),
        useNativeDriver: true,
      }),
      Animated.timing(zoom, {
        toValue: transitionScale,
        duration: Math.round(transitionDuration * 0.45),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex(nextIndex);
      fade.setValue(0);
      zoom.setValue(transitionScale);

      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: Math.round(transitionDuration * 0.55),
          useNativeDriver: true,
        }),
        Animated.timing(zoom, {
          toValue: 1,
          duration: Math.round(transitionDuration * 0.55),
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
      });
    });
  };

  const next = () => {
    if (models.length === 0) {
      return;
    }

    const nextIndex = (index + 1) % models.length;
    runTransition(nextIndex);
  };

  const prev = () => {
    if (models.length === 0) {
      return;
    }

    const nextIndex = (index - 1 + models.length) % models.length;
    runTransition(nextIndex);
  };

  const wrapperStyle = useMemo(
    () => [{ width, height }, containerStyle],
    [containerStyle, height, width]
  );

  if (models.length === 0) {
    return <View style={wrapperStyle} />;
  }

  const activeItem = models[index];
  const activeModelPath = getModelPath(activeItem);
  const activeScale = getResolvedValue(
    isConfiguredModel(activeItem) ? activeItem.scale : undefined,
    scale
  );
  const activePosition = getResolvedValue(
    isConfiguredModel(activeItem) ? activeItem.position : undefined,
    position
  );
  const activeCameraPosition = getResolvedValue(
    isConfiguredModel(activeItem) ? activeItem.cameraPosition : undefined,
    cameraPosition
  );

  return (
    <View style={wrapperStyle}>
      <Animated.View
        style={[
          styles.viewer,
          {
            opacity: fade,
            transform: [{ scale: zoom }],
          },
        ]}
      >
        <ModelViewer
          modelPath={activeModelPath}
          scale={activeScale}
          position={activePosition}
          cameraPosition={activeCameraPosition}
          fov={fov}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
        />
      </Animated.View>

      <View style={styles.controls}>
        <Pressable onPress={prev}>
          <Text style={styles.arrow}>{'<'}</Text>
        </Pressable>

        <Pressable onPress={next}>
          <Text style={styles.arrow}>{'>'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  arrow: {
    fontSize: 30,
  },
});

export default ModelCarousel;
