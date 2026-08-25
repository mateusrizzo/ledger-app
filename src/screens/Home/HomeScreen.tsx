import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BalanceCard } from '@components/BalanceCard/BalanceCard';
import { BudgetProgressCard } from '@components/BudgetProgressCard/BudgetProgressCard';
import { SpendByCategoryCard } from '@components/SpendByCategoryCard/SpendByCategoryCard';
import { useCategories } from '@hooks/useCategories';
import { theme } from '@theme';

export function HomeScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const categoriesQuery = useCategories();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.greeting}>Good afternoon</Text>
      <Text style={styles.subtitle}>August 2026</Text>

      <BalanceCard />
      <SpendByCategoryCard />
      <BudgetProgressCard categories={categoriesQuery.data} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  greeting: {
    ...theme.typography.greetingTitle,
    color: theme.colors.text.primary,
  },
  subtitle: {
    ...theme.typography.screenSubtitle,
    color: theme.colors.text.secondary,
  },
});
