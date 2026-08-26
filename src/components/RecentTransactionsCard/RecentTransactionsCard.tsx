import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Card } from '@components/Card/Card';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { useAnnounceLoading } from '@hooks/useAnnounceLoading';
import { useEntranceAnimation } from '@hooks/useEntranceAnimation';
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
const ENTRANCE_TRANSLATE_Y = 12;

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

export const RecentTransactionsCard = React.memo(function RecentTransactionsCardComponent({
  categories,
  onSeeAll,
}: RecentTransactionsCardProps): React.JSX.Element {
  const transactions = useTransactionsWithCategories(categories);
  const action = { label: 'See all', onPress: onSeeAll ?? NOOP };
  useAnnounceLoading(!transactions.isReady && !transactions.isError, 'Loading recent transactions');
  const { progress } = useEntranceAnimation(transactions.isReady);
  const entranceStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * ENTRANCE_TRANSLATE_Y }],
  }));

  if (!transactions.isReady) {
    return (
      <Card title="Recent transactions" action={action}>
        <CardSkeleton lines={SKELETON_LINES} />
      </Card>
    );
  }

  return (
    <Card title="Recent transactions" action={action}>
      <Animated.View style={[styles.list, entranceStyle]}>
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
      </Animated.View>
    </Card>
  );
});

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.lg,
  },
});
