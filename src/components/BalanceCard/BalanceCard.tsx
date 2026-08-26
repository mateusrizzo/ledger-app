import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@components/Card/Card';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { useAnnounceLoading } from '@hooks/useAnnounceLoading';
import { useBalance } from '@hooks/useBalance';
import { theme } from '@theme';
import { formatCurrency } from '@utils/formatCurrency';

const SKELETON_LINES = [
  { widthPercent: 35, heightPx: 12 },
  { widthPercent: 60, heightPx: 34 },
  { widthPercent: 45, heightPx: 16 },
];

export const BalanceCard = React.memo(function BalanceCardComponent(): React.JSX.Element {
  const query = useBalance();
  useAnnounceLoading(query.status === 'pending', 'Loading balance');

  if (query.status !== 'success') {
    return (
      <Card>
        <CardSkeleton lines={SKELETON_LINES} />
      </Card>
    );
  }

  const isPositive = query.data.monthlyDeltaCents >= 0;
  const totalAmount = formatCurrency(query.data.totalCents);
  const deltaAmount = formatCurrency(Math.abs(query.data.monthlyDeltaCents));
  const accessibilityLabel = `Total balance ${totalAmount}, ${
    isPositive ? 'up' : 'down'
  } ${deltaAmount} this month`;

  return (
    <Card>
      <View accessible accessibilityLabel={accessibilityLabel}>
        <Text style={styles.label}>Total balance</Text>
        <Text style={styles.amount}>{totalAmount}</Text>
        <Text style={[styles.delta, isPositive ? styles.positive : styles.negative]}>
          {isPositive ? '↑' : '↓'} {deltaAmount} this month
        </Text>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  label: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
  },
  amount: {
    ...theme.typography.amountLarge,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  delta: {
    ...theme.typography.body,
    marginTop: theme.spacing.sm,
  },
  positive: {
    color: theme.colors.amount.positive,
  },
  negative: {
    color: theme.colors.amount.negative,
  },
});
