import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from '@components/Card/Card';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { InsightsCard } from '@components/InsightsCard/InsightsCard';
import { useAnnounceLoading } from '@hooks/useAnnounceLoading';
import { useSpendingTrends } from '@hooks/useSpendingTrends';
import type { RootStackParamList } from '@navigation/types';
import { theme } from '@theme';
import { formatCurrency } from '@utils/formatCurrency';
import { TrendsChart } from './TrendsChart';
import { TrendsSummary } from './TrendsSummary';

const SKELETON_LINES = [
  { widthPercent: 40, heightPx: 18 },
  { widthPercent: 60, heightPx: 14 },
  { widthPercent: 100, heightPx: 140 },
];

export function SpendingTrendsScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const trendsQuery = useSpendingTrends();
  useAnnounceLoading(trendsQuery.status === 'pending', 'Loading spending trends');

  const currentMonth = trendsQuery.data?.months.find(month => month.isCurrent);
  const chartAccessibilityLabel =
    trendsQuery.status === 'success' && currentMonth !== undefined
      ? `Spending over the last 6 months, averaging ${formatCurrency(
          trendsQuery.data.monthlyAverageCents,
        )}, current month ${formatCurrency(currentMonth.amountCents)}, ${Math.abs(
          trendsQuery.data.deltaVsAveragePercent,
        )} percent ${trendsQuery.data.deltaVsAveragePercent >= 0 ? 'above' : 'below'} average`
      : undefined;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.lg }]}>
        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Back">
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} accessibilityRole="header">
          Spending Trends
        </Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Card>
          {trendsQuery.status !== 'success' ? (
            <CardSkeleton lines={SKELETON_LINES} />
          ) : (
            <>
              <TrendsSummary
                monthlyAverageCents={trendsQuery.data.monthlyAverageCents}
                deltaVsAveragePercent={trendsQuery.data.deltaVsAveragePercent}
              />
              <View accessible accessibilityLabel={chartAccessibilityLabel}>
                <TrendsChart months={trendsQuery.data.months} />
              </View>
            </>
          )}
        </Card>

        <InsightsCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerSide: {
    minWidth: 48,
  },
  backLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textDecorationLine: 'underline',
  },
  title: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.lg,
  },
});
