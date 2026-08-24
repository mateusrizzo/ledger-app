import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { theme } from '@theme';

export interface DonutChartSegment {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface CategoryDonutChartProps {
  segments: DonutChartSegment[];
  centerLabel: string;
  centerValue: string;
  size?: number;
  strokeWidth?: number;
}

const DEFAULT_SIZE = 180;
const DEFAULT_STROKE_WIDTH = 24;

export function CategoryDonutChart({
  segments,
  centerLabel,
  centerValue,
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE_WIDTH,
}: CategoryDonutChartProps): React.JSX.Element {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercentage = 0;

  return (
    <View
      testID="category-donut-chart"
      style={{ width: size, height: size }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${center}, ${center}`}>
          {segments.map(segment => {
            const dashLength = (segment.percentage / 100) * circumference;
            const dashOffset = -((cumulativePercentage / 100) * circumference);
            cumulativePercentage += segment.percentage;

            return (
              <Circle
                key={segment.label}
                testID={`category-donut-chart-segment-${segment.label}`}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference}`}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </G>
      </Svg>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.centerContent}>
          <Text style={styles.centerLabel}>{centerLabel}</Text>
          <Text style={styles.centerValue}>{centerValue}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    ...theme.typography.caption,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  centerValue: {
    ...theme.typography.amountMedium,
    fontSize: 20,
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
});
