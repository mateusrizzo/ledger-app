import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useEntranceAnimation } from '@hooks/useEntranceAnimation';
import type { MonthlySpend } from '@models/spendingTrends.types';
import { theme } from '@theme';

export interface TrendsChartProps {
  months: MonthlySpend[];
}

const CHART_HEIGHT = 120;
const BAR_STAGGER_MS = 60;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonthLabel(monthIso: string): string {
  const monthIndex = Number(monthIso.slice(5, 7)) - 1;
  return MONTH_LABELS[monthIndex];
}

function formatCompactAmount(amountCents: number): string {
  const thousands = amountCents / 100 / 1000;
  return `${thousands.toFixed(1).replace('.', ',')}k`;
}

interface AnimatedBarProps {
  index: number;
  height: number;
  isCurrent: boolean;
}

function AnimatedBar({ index, height, isCurrent }: AnimatedBarProps): React.JSX.Element {
  const { progress } = useEntranceAnimation(true, index * BAR_STAGGER_MS);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: progress.value }],
  }));

  return (
    <Animated.View
      style={[styles.bar, { height }, isCurrent ? styles.barCurrent : null, animatedStyle]}
    />
  );
}

export function TrendsChart({ months }: TrendsChartProps): React.JSX.Element {
  const maxAmountCents = Math.max(...months.map(month => month.amountCents));

  return (
    <View
      testID="trends-chart"
      style={styles.chart}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden>
      {months.map((month, index) => {
        const barHeight = maxAmountCents === 0 ? 0 : (month.amountCents / maxAmountCents) * CHART_HEIGHT;

        return (
          <View key={month.month} style={styles.column}>
            <Text style={[styles.valueLabel, month.isCurrent ? styles.valueLabelCurrent : null]}>
              {formatCompactAmount(month.amountCents)}
            </Text>
            <View style={styles.barTrack}>
              <AnimatedBar index={index} height={barHeight} isCurrent={month.isCurrent} />
            </View>
            <Text style={[styles.monthLabel, month.isCurrent ? styles.monthLabelCurrent : null]}>
              {formatMonthLabel(month.month)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  valueLabel: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  valueLabelCurrent: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  barTrack: {
    height: CHART_HEIGHT,
    width: 20,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    minHeight: 4,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.border,
    transformOrigin: 'bottom',
  },
  barCurrent: {
    backgroundColor: theme.colors.text.link,
  },
  monthLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  monthLabelCurrent: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
});
