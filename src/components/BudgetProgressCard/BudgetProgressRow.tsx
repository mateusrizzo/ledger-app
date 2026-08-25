import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BudgetStatus } from '@models/budget.types';
import { theme } from '@theme';
import { formatCurrency } from '@utils/formatCurrency';

export interface BudgetProgressRowProps {
  label: string;
  spentCents: number;
  limitCents: number;
  status: BudgetStatus;
}

export function BudgetProgressRow({
  label,
  spentCents,
  limitCents,
  status,
}: BudgetProgressRowProps): React.JSX.Element {
  const isOver = status === 'over';
  const fillPercent = Math.min(spentCents / limitCents, 1) * 100;
  const statusColor = theme.colors.status[status];
  const amountLabel = `${formatCurrency(spentCents)} / ${formatCurrency(limitCents)}`;

  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.amount, isOver && styles.amountOver]}>{amountLabel}</Text>
      </View>
      <View
        style={styles.track}
        accessible
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: limitCents,
          now: Math.min(spentCents, limitCents),
          text: `${label}, ${amountLabel}${isOver ? ', over budget' : ''}`,
        }}>
        <View
          testID="budget-progress-fill"
          style={[styles.fill, { width: `${fillPercent}%`, backgroundColor: statusColor }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  amount: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  amountOver: {
    color: theme.colors.status.over,
  },
  track: {
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },
});
