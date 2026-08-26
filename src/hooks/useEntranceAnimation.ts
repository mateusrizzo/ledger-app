import { useEffect, useRef } from 'react';
import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

const DURATION_MS = 500;

export interface UseEntranceAnimationResult {
  progress: SharedValue<number>;
  reduceMotion: boolean;
}

/**
 * Animates `progress` from 0 to 1 the first time `shouldAnimate` becomes true,
 * skipping straight to 1 with no transition when reduced motion is enabled.
 * `delayMs` staggers the start (e.g. per chart element); omit for a single entrance.
 */
export function useEntranceAnimation(
  shouldAnimate: boolean,
  delayMs = 0,
): UseEntranceAnimationResult {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 1 : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!shouldAnimate || hasAnimated.current) {
      return;
    }
    hasAnimated.current = true;

    if (reduceMotion) {
      progress.value = 1;
      return;
    }

    progress.value = withDelay(
      delayMs,
      withTiming(1, { duration: DURATION_MS, easing: Easing.out(Easing.cubic) }),
    );
  }, [shouldAnimate, reduceMotion, delayMs, progress]);

  return { progress, reduceMotion };
}
