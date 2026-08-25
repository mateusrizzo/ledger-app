module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@screens': './src/screens',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@theme': './src/theme',
          '@models': './src/types',
          '@utils': './src/utils',
          '@navigation': './src/navigation',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
