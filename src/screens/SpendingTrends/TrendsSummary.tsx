import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme';
import { formatCurrency } from '@utils/formatCurrency';

export interface TrendsSummaryProps {
  monthlyAverageCents: number;
  deltaVsAveragePercent: number;
}

export function TrendsSummary({
  monthlyAverageCents,
  deltaVsAveragePercent,
}: TrendsSummaryProps): React.JSX.Element {
  const isAboveAverage = deltaVsAveragePercent >= 0;
  const deltaLabel = `${isAboveAverage ? '+' : ''}${deltaVsAveragePercent}% vs avg`;

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Text style={styles.title} accessibilityRole="header">
          Last 6 months
        </Text>
        <Text style={[styles.delta, isAboveAverage ? styles.deltaOver : styles.deltaUnder]}>
          {deltaLabel}
        </Text>
      </View>
      <Text style={styles.average}>Monthly average {formatCurrency(monthlyAverageCents)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  delta: {
    ...theme.typography.cardAction,
  },
  deltaOver: {
    color: theme.colors.amount.negative,
  },
  deltaUnder: {
    color: theme.colors.amount.positive,
  },
  average: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});
