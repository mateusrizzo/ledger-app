import { AccessibilityInfo } from 'react-native';
import { renderHook } from '@testing-library/react-native';
import { useAnnounceLoading } from './useAnnounceLoading';

function callsWithMessage(spy: jest.SpyInstance, message: string): number {
  return spy.mock.calls.filter(call => call[0] === message).length;
}

describe('useAnnounceLoading', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('announces the message once when loading starts, and does not repeat while still loading', async () => {
    const announceSpy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const message = 'Loading balance (once)';

    const { rerender } = await renderHook(
      ({ isLoading }: { isLoading: boolean }) => useAnnounceLoading(isLoading, message),
      { initialProps: { isLoading: true } },
    );
    await rerender({ isLoading: true });
    await rerender({ isLoading: true });

    expect(callsWithMessage(announceSpy, message)).toBe(1);
  });

  it('does not announce when it starts out not loading', async () => {
    const announceSpy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const message = 'Loading balance (not loading)';

    await renderHook(() => useAnnounceLoading(false, message));

    expect(callsWithMessage(announceSpy, message)).toBe(0);
  });

  it('announces again on a subsequent loading period', async () => {
    const announceSpy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const message = 'Loading balance (repeat)';

    const { rerender } = await renderHook(
      ({ isLoading }: { isLoading: boolean }) => useAnnounceLoading(isLoading, message),
      { initialProps: { isLoading: true } },
    );
    await rerender({ isLoading: false });
    await rerender({ isLoading: true });

    expect(callsWithMessage(announceSpy, message)).toBe(2);
  });
});
