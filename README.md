# react-native-model-carousel

A React Native library for rendering interactive 3D `.glb`/`.gltf` models in a simple swipe-free carousel with previous/next controls.

## Installation

```sh
npm install react-native-model-carousel @react-three/fiber @react-three/drei three
```

If you use Expo, also install `expo-gl`.

## Usage

```tsx
import { ModelCarousel } from 'react-native-model-carousel';

import Car1 from './assets/Car1.glb';
import Car2 from './assets/Car2.glb';
import Car3 from './assets/Car3.glb';

export default function App() {
  return (
    <ModelCarousel
      models={[Car1, Car2, Car3]}
      width='100%'
      height='100%'
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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `models` | `unknown[]` | - | Array of imported model assets (`.glb`/`.gltf`). |
| `width` | `DimensionValue` | `'100%'` | Carousel container width. |
| `height` | `DimensionValue` | `'100%'` | Carousel container height. |
| `containerStyle` | `StyleProp<ViewStyle>` | `undefined` | Additional wrapper style. |
| `scale` | `number` | `0.8` | Model scale. |
| `position` | `number[]` | `[0, -2.7, 0]` | Model XYZ position. |
| `cameraPosition` | `number[]` | `[0, 9, 5]` | Camera XYZ position. |
| `fov` | `number` | `35` | Camera field of view. |
| `autoRotate` | `boolean` | `true` | Enables model auto-rotation. |
| `autoRotateSpeed` | `number` | `10` | Auto-rotation speed. |

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
