import { useEffect, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useAnnounceLoading(isLoading: boolean, message: string): void {
  const hasAnnounced = useRef(false);

  useEffect(() => {
    if (isLoading && !hasAnnounced.current) {
      AccessibilityInfo.announceForAccessibility(message);
      hasAnnounced.current = true;
    } else if (!isLoading) {
      hasAnnounced.current = false;
    }
  }, [isLoading, message]);
}
