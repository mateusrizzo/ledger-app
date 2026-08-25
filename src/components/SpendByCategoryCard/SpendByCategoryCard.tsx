import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@components/Card/Card';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { useSpendByCategoryWithCategories } from '@hooks/useSpendByCategoryWithCategories';
import type { Category } from '@models/category.types';
import { theme } from '@theme';
import { formatCurrency } from '@utils/formatCurrency';
import { resolveColorToken } from '@utils/resolveColorToken';
import { CategoryDonutChart } from './CategoryDonutChart';
import { CategoryLegendRow } from './CategoryLegendRow';

export interface SpendByCategoryCardProps {
  categories: Category[] | undefined;
}

const SKELETON_LINES = [
  { widthPercent: 100, heightPx: 160 },
  { widthPercent: 90, heightPx: 16 },
  { widthPercent: 75, heightPx: 16 },
  { widthPercent: 80, heightPx: 16 },
];

export function SpendByCategoryCard({ categories }: SpendByCategoryCardProps): React.JSX.Element {
  const spend = useSpendByCategoryWithCategories(categories);

  if (!spend.isReady) {
    return (
      <Card title="Spend by category">
        <CardSkeleton lines={SKELETON_LINES} />
      </Card>
    );
  }

  const { totalCents, categories: spendCategories } = spend.data;

  const segments = spendCategories.map(category => ({
    label: category.categoryLabel,
    value: category.amountCents,
    percentage: category.percentage,
    color: resolveColorToken(category.categoryColorToken),
  }));

  const accessibilityLabel = [
    `Spend by category. Total ${formatCurrency(totalCents)}.`,
    ...spendCategories.map(category => `${category.categoryLabel} ${category.percentage} percent.`),
  ].join(' ');

  return (
    <Card title="Spend by category">
      <View accessible accessibilityLabel={accessibilityLabel} style={styles.content}>
        <CategoryDonutChart
          segments={segments}
          centerLabel="Total"
          centerValue={formatCurrency(totalCents)}
        />
        <View style={styles.legend}>
          {spendCategories.map(category => (
            <CategoryLegendRow
              key={category.id}
              label={category.categoryLabel}
              amountLabel={formatCurrency(category.amountCents)}
              percentage={category.percentage}
              color={resolveColorToken(category.categoryColorToken)}
            />
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  legend: {
    flex: 1,
    gap: theme.spacing.md,
  },
});
