import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Card } from '@components/Card/Card';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { useAnnounceLoading } from '@hooks/useAnnounceLoading';
import { useEntranceAnimation } from '@hooks/useEntranceAnimation';
import { useInsightsWithCategories } from '@hooks/useInsightsWithCategories';
import { theme } from '@theme';
import { InsightItem } from './InsightItem';
import { InsightsDisclaimer } from './InsightsDisclaimer';

const ENTRANCE_TRANSLATE_Y = 12;

const SKELETON_LINES = [
  { widthPercent: 70, heightPx: 16 },
  { widthPercent: 100, heightPx: 32 },
  { widthPercent: 60, heightPx: 16 },
  { widthPercent: 100, heightPx: 32 },
  { widthPercent: 65, heightPx: 16 },
  { widthPercent: 100, heightPx: 32 },
];

export const InsightsCard = React.memo(function InsightsCardComponent(): React.JSX.Element {
  const insights = useInsightsWithCategories();
  useAnnounceLoading(!insights.isReady && !insights.isError, 'Loading insights');
  const { progress } = useEntranceAnimation(insights.isReady);
  const entranceStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * ENTRANCE_TRANSLATE_Y }],
  }));

  if (!insights.isReady) {
    return (
      <Card title="Insights">
        <CardSkeleton lines={SKELETON_LINES} />
      </Card>
    );
  }

  return (
    <Card title="Insights">
      <Animated.View style={entranceStyle}>
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
      </Animated.View>
    </Card>
  );
});

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.lg,
  },
});
