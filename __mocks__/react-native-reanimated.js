const React = require('react');
const { View } = require('react-native');

function useSharedValue(initialValue) {
  return { value: initialValue };
}

function useAnimatedStyle(factory) {
  return factory();
}

function useAnimatedProps(factory) {
  return factory();
}

function useReducedMotion() {
  return false;
}

function withTiming(toValue) {
  return toValue;
}

function withDelay(_delayMs, animation) {
  return animation;
}

function withRepeat(animation) {
  return animation;
}

function createAnimatedComponent(Component) {
  return function AnimatedComponentMock({ animatedProps, style, ...rest }) {
    const extra = animatedProps && typeof animatedProps === 'object' ? animatedProps : {};
    const { style: extraStyle, ...restExtra } = extra;
    const mergedStyle = extraStyle ? [style, extraStyle] : style;
    return React.createElement(Component, { ...rest, ...restExtra, style: mergedStyle });
  };
}

const Easing = {
  inOut: fn => fn,
  out: fn => fn,
  ease: value => value,
  cubic: value => value,
};

module.exports = {
  __esModule: true,
  default: { View, createAnimatedComponent },
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useReducedMotion,
  withTiming,
  withDelay,
  withRepeat,
  createAnimatedComponent,
  Easing,
};
