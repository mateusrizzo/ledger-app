import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme';

export interface CategoryLegendRowProps {
  label: string;
  amountLabel: string;
  percentage: number;
  color: string;
}

export function CategoryLegendRow({
  label,
  amountLabel,
  percentage,
  color,
}: CategoryLegendRowProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.textColumn}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.amount}>
          {amountLabel} · {percentage}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: theme.radius.full,
  },
  textColumn: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  amount: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
});
