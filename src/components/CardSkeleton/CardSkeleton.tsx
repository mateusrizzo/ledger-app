import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '@theme';

export interface CardSkeletonLine {
  widthPercent: number;
  heightPx: number;
}

export interface CardSkeletonProps {
  lines: CardSkeletonLine[];
  hasHeader?: boolean;
}

const HEADER_SPACER_HEIGHT = theme.typography.cardTitle.lineHeight + theme.spacing.lg;

export function CardSkeleton({ lines, hasHeader = false }: CardSkeletonProps): React.JSX.Element {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View
      testID="card-skeleton"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden>
      {hasHeader ? <View testID="card-skeleton-header-spacer" style={styles.headerSpacer} /> : null}
      {lines.map((line, index) => (
        <Animated.View
          key={index}
          testID={`card-skeleton-line-${index}`}
          style={[
            styles.line,
            shimmerStyle,
            {
              width: `${line.widthPercent}%`,
              height: line.heightPx,
              marginTop: index === 0 ? 0 : theme.spacing.sm,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerSpacer: {
    height: HEADER_SPACER_HEIGHT,
  },
  line: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
  },
});
