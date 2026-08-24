const { View } = require('react-native');

function useSharedValue(initialValue) {
  return { value: initialValue };
}

function useAnimatedStyle(factory) {
  return factory();
}

function withTiming(toValue) {
  return toValue;
}

function withRepeat(animation) {
  return animation;
}

const Easing = {
  inOut: fn => fn,
  ease: value => value,
};

module.exports = {
  __esModule: true,
  default: { View },
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
};
