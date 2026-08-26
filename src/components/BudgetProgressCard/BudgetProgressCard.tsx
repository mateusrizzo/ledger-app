import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Card } from '@components/Card/Card';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { useAnnounceLoading } from '@hooks/useAnnounceLoading';
import { useBudgetsWithCategories } from '@hooks/useBudgetsWithCategories';
import { useEntranceAnimation } from '@hooks/useEntranceAnimation';
import type { Category } from '@models/category.types';
import { theme } from '@theme';
import { BudgetProgressRow } from './BudgetProgressRow';

export interface BudgetProgressCardProps {
  categories: Category[] | undefined;
}

const ENTRANCE_TRANSLATE_Y = 12;

const SKELETON_LINES = [
  { widthPercent: 60, heightPx: 14 },
  { widthPercent: 100, heightPx: 8 },
  { widthPercent: 60, heightPx: 14 },
  { widthPercent: 100, heightPx: 8 },
  { widthPercent: 60, heightPx: 14 },
  { widthPercent: 100, heightPx: 8 },
];

export const BudgetProgressCard = React.memo(function BudgetProgressCardComponent({
  categories,
}: BudgetProgressCardProps): React.JSX.Element {
  const budgets = useBudgetsWithCategories(categories);
  useAnnounceLoading(!budgets.isReady && !budgets.isError, 'Loading budget progress');
  const { progress } = useEntranceAnimation(budgets.isReady);
  const entranceStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * ENTRANCE_TRANSLATE_Y }],
  }));

  if (!budgets.isReady) {
    return (
      <Card title="Budget progress">
        <CardSkeleton lines={SKELETON_LINES} />
      </Card>
    );
  }

  return (
    <Card title="Budget progress">
      <Animated.View style={[styles.list, entranceStyle]}>
        {budgets.data.map(budget => (
          <BudgetProgressRow
            key={budget.id}
            label={budget.categoryLabel}
            spentCents={budget.spentCents}
            limitCents={budget.limitCents}
            status={budget.status}
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
