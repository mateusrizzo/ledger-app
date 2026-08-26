import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@components/Card/Card';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { useAnnounceLoading } from '@hooks/useAnnounceLoading';
import { useSpendByCategory } from '@hooks/useSpendByCategory';
import { theme } from '@theme';
import { formatCurrency } from '@utils/formatCurrency';
import { resolveColorToken } from '@utils/resolveColorToken';
import { CategoryDonutChart } from './CategoryDonutChart';
import { CategoryLegendRow } from './CategoryLegendRow';

export interface SpendByCategoryCardProps {
  onSeeTrends?: () => void;
}

const NOOP = () => {};

const SKELETON_LINES = [
  { widthPercent: 100, heightPx: 160 },
  { widthPercent: 90, heightPx: 16 },
  { widthPercent: 75, heightPx: 16 },
  { widthPercent: 80, heightPx: 16 },
];

export const SpendByCategoryCard = React.memo(function SpendByCategoryCardComponent({
  onSeeTrends,
}: SpendByCategoryCardProps): React.JSX.Element {
  const query = useSpendByCategory();
  useAnnounceLoading(query.status === 'pending', 'Loading spend by category');
  const action = { label: 'See trends', onPress: onSeeTrends ?? NOOP };

  if (query.status !== 'success') {
    return (
      <Card title="Spend by category" action={action}>
        <CardSkeleton lines={SKELETON_LINES} />
      </Card>
    );
  }

  const { totalCents, categories } = query.data;

  const segments = categories.map(category => ({
    label: category.label,
    value: category.amountCents,
    percentage: category.percentage,
    color: resolveColorToken(category.colorToken),
  }));

  const accessibilityLabel = [
    `Spend by category. Total ${formatCurrency(totalCents)}.`,
    ...categories.map(category => `${category.label} ${category.percentage} percent.`),
  ].join(' ');

  return (
    <Card title="Spend by category" action={action}>
      <View accessible accessibilityLabel={accessibilityLabel} style={styles.content}>
        <CategoryDonutChart
          segments={segments}
          centerLabel="Total"
          centerValue={formatCurrency(totalCents)}
        />
        <View style={styles.legend}>
          {categories.map(category => (
            <CategoryLegendRow
              key={category.id}
              label={category.label}
              amountLabel={formatCurrency(category.amountCents)}
              percentage={category.percentage}
              color={resolveColorToken(category.colorToken)}
            />
          ))}
        </View>
      </View>
    </Card>
  );
});

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
