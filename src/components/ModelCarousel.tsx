import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
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

export type NavigationButtonRenderProps = {
  onPress: () => void;
  disabled: boolean;
  index: number;
  total: number;
  isAnimating: boolean;
};

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
  autoPlay?: boolean;
  autoPlayInterval?: number;
  enableSwipeNavigation?: boolean;
  swipeThreshold?: number;
  showPaginationDots?: boolean;
  showDefaultButtons?: boolean;

  // transition
  transitionDuration?: number;
  transitionScale?: number;

  // custom controls
  renderPrevButton?: (props: NavigationButtonRenderProps) => ReactNode;
  renderNextButton?: (props: NavigationButtonRenderProps) => ReactNode;
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
  autoPlay = false,
  autoPlayInterval = 2500,
  enableSwipeNavigation = true,
  swipeThreshold = 36,
  showPaginationDots = true,
  showDefaultButtons = false,

  transitionDuration = 260,
  transitionScale = 0.96,
  renderPrevButton,
  renderNextButton,
}: Props) => {
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const zoom = useRef(new Animated.Value(1)).current;
  const isAnimating = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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

  const runTransition = useCallback(
    (nextIndex: number) => {
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
    },
    [fade, models.length, transitionDuration, transitionScale, zoom]
  );

  useEffect(() => {
    if (!autoPlay || models.length <= 1) {
      return;
    }

    const timeout = setTimeout(() => {
      const nextIndex = (index + 1) % models.length;
      runTransition(nextIndex);
    }, autoPlayInterval);

    return () => {
      clearTimeout(timeout);
    };
  }, [autoPlay, autoPlayInterval, index, models.length, runTransition]);

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

  const onViewerTouchStart = (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => {
    if (!enableSwipeNavigation) {
      return;
    }

    touchStartX.current = event.nativeEvent.pageX;
    touchStartY.current = event.nativeEvent.pageY;
  };

  const onViewerTouchEnd = (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => {
    if (
      !enableSwipeNavigation ||
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const deltaX = event.nativeEvent.pageX - touchStartX.current;
    const deltaY = event.nativeEvent.pageY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (
      Math.abs(deltaX) < swipeThreshold ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      return;
    }

    if (deltaX < 0) {
      next();
      return;
    }

    prev();
  };

  const wrapperStyle = useMemo(
    () => [{ width, height }, containerStyle],
    [containerStyle, height, width]
  );
  const controlsDisabled = models.length <= 1;
  const controlsProps: NavigationButtonRenderProps = {
    onPress: () => undefined,
    disabled: controlsDisabled,
    index,
    total: models.length,
    isAnimating: isAnimating.current,
  };

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
  const shouldRenderPrevButton = !!renderPrevButton || showDefaultButtons;
  const shouldRenderNextButton = !!renderNextButton || showDefaultButtons;

  return (
    <View style={wrapperStyle}>
      <Animated.View
        onTouchStart={onViewerTouchStart}
        onTouchEnd={onViewerTouchEnd}
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
          enablePan={!enableSwipeNavigation}
        />
      </Animated.View>

      <View style={styles.controls}>
        <View style={styles.buttonsRow}>
          {shouldRenderPrevButton ? (
            renderPrevButton ? (
              renderPrevButton({
                ...controlsProps,
                onPress: prev,
              })
            ) : (
              <Pressable
                onPress={prev}
                disabled={controlsDisabled}
                style={({ pressed }) => [
                  styles.navButton,
                  pressed && styles.navButtonPressed,
                  controlsDisabled && styles.navButtonDisabled,
                ]}
              >
                <Text style={styles.arrow}>{'<'}</Text>
              </Pressable>
            )
          ) : (
            <View />
          )}

          {shouldRenderNextButton ? (
            renderNextButton ? (
              renderNextButton({
                ...controlsProps,
                onPress: next,
              })
            ) : (
              <Pressable
                onPress={next}
                disabled={controlsDisabled}
                style={({ pressed }) => [
                  styles.navButton,
                  pressed && styles.navButtonPressed,
                  controlsDisabled && styles.navButtonDisabled,
                ]}
              >
                <Text style={styles.arrow}>{'>'}</Text>
              </Pressable>
            )
          ) : (
            <View />
          )}
        </View>

        {showPaginationDots && models.length > 0 ? (
          <View style={styles.dotsContainer}>
            {models.map((_, modelIndex) => (
              <View
                key={`dot-${modelIndex}`}
                style={[styles.dot, modelIndex === index && styles.dotActive]}
              />
            ))}
          </View>
        ) : null}
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
    bottom: 24,
    width: '100%',
    gap: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(196, 37, 37, 0.45)',
  },
  dotActive: {
    width: 18,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  arrow: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(21, 29, 44, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});

export default ModelCarousel;
