# react-native-model-carousel

A React Native library for rendering interactive 3D `.glb`/`.gltf` models in a simple swipe-free carousel with previous/next controls.

## Preview

<p align="center">
  <img
    src="./example/assets/Preview%20GIF/PreviewGif.gif"
    alt="Carousel Preview GIF"
    width="250"
  />
</p>

<p align="center">
  <img src="./example/assets/Preview%20Image/img1.png" alt="Preview 1" width="240" />
  <img src="./example/assets/Preview%20Image/img2.png" alt="Preview 2" width="240" />
  <img src="./example/assets/Preview%20Image/img3.png" alt="Preview 3" width="240" />
</p>

## Installation

```sh
npm install react-native-model-carousel @react-three/fiber @react-three/drei three
```

If you use Expo, also install `expo-gl`.

## Usage

```tsx
import { ModelCarousel } from 'react-native-model-carousel';
import { Pressable, Text } from 'react-native';

import Car1 from './assets/Car1.glb';
import Car2 from './assets/Car2.glb';
import Car3 from './assets/Car3.glb';

export default function App() {
  return (
    <ModelCarousel
      models={[
        {
          path: Car1,
          scale: 1.1,
          position: [0, -3, 0],
          cameraPosition: [0, 7, 6],
        },
        {
          path: Car2,
          scale: 1.5,
          position: [0, -2.4, 0],
          cameraPosition: [0, 6, 5],
        },
        Car3,
      ]}
      width="100%"
      height="100%"
      scale={1.3}
      position={[0, -3, 0]}
      cameraPosition={[0, 8, 6]}
      fov={40}
      autoRotate
      autoRotateSpeed={5}
      containerStyle={{ backgroundColor: '#f0f0f0' }}
      renderPrevButton={({ onPress, disabled }) => (
        <Pressable onPress={onPress} disabled={disabled}>
          <Text>Prev</Text>
        </Pressable>
      )}
      renderNextButton={({ onPress, disabled }) => (
        <Pressable onPress={onPress} disabled={disabled}>
          <Text>Next</Text>
        </Pressable>
      )}
    />
  );
}
```

## TypeScript asset declarations

If your app does not already declare 3D asset modules, add this to a `*.d.ts` file:

```ts
declare module '*.glb' {
  const content: any;
  export default content;
}

declare module '*.gltf' {
  const content: any;
  export default content;
}
```

## Props

| Prop               | Type                   | Default        | Description                                        |
| ------------------ | ---------------------- | -------------- | -------------------------------------------------- |
| `models`           | `ModelCarouselItem[]`  | -              | Array of model assets or per-model config objects. |
| `width`            | `DimensionValue`       | `'100%'`       | Carousel container width.                          |
| `height`           | `DimensionValue`       | `'100%'`       | Carousel container height.                         |
| `containerStyle`   | `StyleProp<ViewStyle>` | `undefined`    | Additional wrapper style.                          |
| `scale`            | `number`               | `0.8`          | Model scale.                                       |
| `position`         | `number[]`             | `[0, -2.7, 0]` | Model XYZ position.                                |
| `cameraPosition`   | `number[]`             | `[0, 9, 5]`    | Camera XYZ position.                               |
| `fov`              | `number`               | `35`           | Camera field of view.                              |
| `autoRotate`       | `boolean`              | `true`         | Enables model auto-rotation.                       |
| `autoRotateSpeed`  | `number`               | `10`           | Auto-rotation speed.                               |
| `renderPrevButton` | `(props) => ReactNode` | `undefined`    | Custom previous button renderer.                   |
| `renderNextButton` | `(props) => ReactNode` | `undefined`    | Custom next button renderer.                       |

`ModelCarouselItem` can be either:

```ts
type ModelCarouselItem =
  | unknown
  | {
      path: unknown;
      scale?: number;
      position?: number[];
      cameraPosition?: number[];
    };
```

When a model item includes `scale`, `position`, or `cameraPosition`, those values override the global props for that specific model only.

`renderPrevButton` and `renderNextButton` receive:

```ts
type NavigationButtonRenderProps = {
  onPress: () => void;
  disabled: boolean;
  index: number;
  total: number;
  isAnimating: boolean;
};
```

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
