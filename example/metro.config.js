const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * 👇 IMPORTANT: add glb/gltf support
 */
defaultConfig.resolver.assetExts.push('glb', 'gltf');

const config = withMetroConfig(defaultConfig, {
  root,
  dirname: __dirname,
});

module.exports = config;
