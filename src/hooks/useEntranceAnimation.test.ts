import * as Reanimated from 'react-native-reanimated';
import { renderHook } from '@testing-library/react-native';
import { useEntranceAnimation } from './useEntranceAnimation';

describe('useEntranceAnimation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('jumps straight to the final value with no animation triggered when reduced motion is enabled', async () => {
    jest.spyOn(Reanimated, 'useReducedMotion').mockReturnValue(true);
    const withTimingSpy = jest.spyOn(Reanimated, 'withTiming');

    const { result } = await renderHook(() => useEntranceAnimation(true));

    expect(result.current.reduceMotion).toBe(true);
    expect(result.current.progress.value).toBe(1);
    expect(withTimingSpy).not.toHaveBeenCalled();
  });

  it('animates from 0 to 1 when reduced motion is disabled and shouldAnimate is true', async () => {
    jest.spyOn(Reanimated, 'useReducedMotion').mockReturnValue(false);
    const withTimingSpy = jest.spyOn(Reanimated, 'withTiming');

    const { result } = await renderHook(() => useEntranceAnimation(true));

    expect(result.current.reduceMotion).toBe(false);
    expect(withTimingSpy).toHaveBeenCalledWith(1, expect.objectContaining({ duration: expect.any(Number) }));
    expect(result.current.progress.value).toBe(1);
  });

  it('does not trigger the animation while shouldAnimate is false', async () => {
    jest.spyOn(Reanimated, 'useReducedMotion').mockReturnValue(false);
    const withTimingSpy = jest.spyOn(Reanimated, 'withTiming');

    const { result } = await renderHook(() => useEntranceAnimation(false));

    expect(withTimingSpy).not.toHaveBeenCalled();
    expect(result.current.progress.value).toBe(0);
  });

  it('only triggers the animation once, even if shouldAnimate stays true across re-renders', async () => {
    jest.spyOn(Reanimated, 'useReducedMotion').mockReturnValue(false);
    const withTimingSpy = jest.spyOn(Reanimated, 'withTiming');

    const { rerender } = await renderHook(
      ({ shouldAnimate }: { shouldAnimate: boolean }) => useEntranceAnimation(shouldAnimate),
      { initialProps: { shouldAnimate: true } },
    );
    await rerender({ shouldAnimate: true });
    await rerender({ shouldAnimate: true });

    expect(withTimingSpy).toHaveBeenCalledTimes(1);
  });

  it('passes delayMs through to withDelay for staggered entrances', async () => {
    jest.spyOn(Reanimated, 'useReducedMotion').mockReturnValue(false);
    const withDelaySpy = jest.spyOn(Reanimated, 'withDelay');

    await renderHook(() => useEntranceAnimation(true, 120));

    expect(withDelaySpy).toHaveBeenCalledWith(120, expect.anything());
  });
});
