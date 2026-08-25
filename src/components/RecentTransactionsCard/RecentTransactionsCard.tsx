import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@components/Card/Card';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { useTransactionsWithCategories } from '@hooks/useTransactionsWithCategories';
import type { Category } from '@models/category.types';
import { theme } from '@theme';
import { formatRelativeDate } from '@utils/formatRelativeDate';
import { resolveColorToken } from '@utils/resolveColorToken';
import { TransactionRow } from './TransactionRow';

export interface RecentTransactionsCardProps {
  categories: Category[] | undefined;
  onSeeAll?: () => void;
}

const NOOP = () => {};

const SKELETON_LINES = [
  { widthPercent: 55, heightPx: 14 },
  { widthPercent: 35, heightPx: 12 },
  { widthPercent: 55, heightPx: 14 },
  { widthPercent: 35, heightPx: 12 },
  { widthPercent: 55, heightPx: 14 },
  { widthPercent: 35, heightPx: 12 },
  { widthPercent: 55, heightPx: 14 },
  { widthPercent: 35, heightPx: 12 },
];

export function RecentTransactionsCard({
  categories,
  onSeeAll,
}: RecentTransactionsCardProps): React.JSX.Element {
  const transactions = useTransactionsWithCategories(categories);
  const action = { label: 'See all', onPress: onSeeAll ?? NOOP };

  if (!transactions.isReady) {
    return (
      <Card title="Recent transactions" action={action}>
        <CardSkeleton lines={SKELETON_LINES} />
      </Card>
    );
  }

  return (
    <Card title="Recent transactions" action={action}>
      <View style={styles.list}>
        {transactions.data.map(transaction => (
          <TransactionRow
            key={transaction.id}
            merchant={transaction.merchant}
            categoryLabel={transaction.categoryLabel}
            categoryInitials={transaction.categoryInitials}
            color={resolveColorToken(transaction.categoryColorToken)}
            dateLabel={formatRelativeDate(transaction.date)}
            amountCents={transaction.amountCents}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.lg,
  },
});
