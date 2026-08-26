import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CategoryBadge } from '@components/CategoryBadge/CategoryBadge';
import { theme } from '@theme';
import { formatCurrency } from '@utils/formatCurrency';

export interface TransactionRowProps {
  merchant: string;
  categoryLabel: string;
  categoryInitials: string;
  color: string;
  dateLabel: string;
  amountCents: number;
}

export function TransactionRow({
  merchant,
  categoryLabel,
  categoryInitials,
  color,
  dateLabel,
  amountCents,
}: TransactionRowProps): React.JSX.Element {
  const isIncome = amountCents > 0;
  const amountLabel = `${isIncome ? '+' : '-'}${formatCurrency(Math.abs(amountCents))}`;
  const accessibilityLabel = `${merchant}, ${categoryLabel}, ${dateLabel}, ${amountLabel}`;

  return (
    <View style={styles.row} accessible accessibilityLabel={accessibilityLabel}>
      <CategoryBadge initials={categoryInitials} color={color} />
      <View style={styles.details}>
        <Text style={styles.merchant} numberOfLines={1}>
          {merchant}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {categoryLabel} · {dateLabel}
        </Text>
      </View>
      <Text style={[styles.amount, isIncome ? styles.positive : styles.negative]}>
        {amountLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  details: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  merchant: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  amount: {
    ...theme.typography.amountSmall,
  },
  positive: {
    color: theme.colors.amount.positive,
  },
  negative: {
    color: theme.colors.amount.negative,
  },
});
