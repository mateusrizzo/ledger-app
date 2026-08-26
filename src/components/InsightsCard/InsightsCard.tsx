import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@components/Card/Card';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { useAnnounceLoading } from '@hooks/useAnnounceLoading';
import { useInsightsWithCategories } from '@hooks/useInsightsWithCategories';
import { theme } from '@theme';
import { InsightItem } from './InsightItem';
import { InsightsDisclaimer } from './InsightsDisclaimer';

const SKELETON_LINES = [
  { widthPercent: 70, heightPx: 16 },
  { widthPercent: 100, heightPx: 32 },
  { widthPercent: 60, heightPx: 16 },
  { widthPercent: 100, heightPx: 32 },
  { widthPercent: 65, heightPx: 16 },
  { widthPercent: 100, heightPx: 32 },
];

export function InsightsCard(): React.JSX.Element {
  const insights = useInsightsWithCategories();
  useAnnounceLoading(!insights.isReady && !insights.isError, 'Loading insights');

  if (!insights.isReady) {
    return (
      <Card title="Insights">
        <CardSkeleton lines={SKELETON_LINES} />
      </Card>
    );
  }

  return (
    <Card title="Insights">
      <View style={styles.list}>
        {insights.data.map(insight => (
          <InsightItem
            key={insight.id}
            title={insight.title}
            body={insight.body}
            categoryColorToken={insight.categoryColorToken}
          />
        ))}
      </View>
      <InsightsDisclaimer basedOnMonths={insights.basedOnMonths} />
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.lg,
  },
});
