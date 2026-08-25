import React, { useMemo, useState } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardSkeleton } from '@components/CardSkeleton/CardSkeleton';
import { FilterBar } from '@components/FilterBar/FilterBar';
import { TransactionRow } from '@components/RecentTransactionsCard/TransactionRow';
import { useAccounts } from '@hooks/useAccounts';
import { useCategories } from '@hooks/useCategories';
import { useTransactionsList } from '@hooks/useTransactionsList';
import type { Transaction } from '@models/transaction.types';
import { theme } from '@theme';
import { formatRelativeDate } from '@utils/formatRelativeDate';
import { getCategoryMeta } from '@utils/getCategoryMeta';
import { getRecentMonthOptions } from '@utils/getRecentMonthOptions';
import { groupTransactionsByDate } from '@utils/groupTransactionsByDate';
import { resolveColorToken } from '@utils/resolveColorToken';

interface TransactionWithCategoryMeta extends Transaction {
  categoryLabel: string;
  categoryColorToken: string;
  categoryInitials: string;
}

const SKELETON_LINES = [
  { widthPercent: 40, heightPx: 18 },
  { widthPercent: 100, heightPx: 56 },
  { widthPercent: 100, heightPx: 56 },
  { widthPercent: 100, heightPx: 56 },
  { widthPercent: 100, heightPx: 56 },
];

export function TransactionsScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const monthOptions = useMemo(() => getRecentMonthOptions(), []);

  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [month, setMonth] = useState<string | undefined>(undefined);

  const accountsQuery = useAccounts();
  const categoriesQuery = useCategories();
  const transactionsList = useTransactionsList({ accountId, categoryId, month });

  const flatTransactions = useMemo<Transaction[]>(
    () => transactionsList.data?.pages.flatMap(page => page.transactions) ?? [],
    [transactionsList.data],
  );

  const sections = useMemo(() => {
    const categories = categoriesQuery.data;
    if (categories === undefined) {
      return [];
    }

    const withCategoryMeta: TransactionWithCategoryMeta[] = flatTransactions.map(transaction => {
      const meta = getCategoryMeta(transaction.categoryId, categories);
      return {
        ...transaction,
        categoryLabel: meta.label,
        categoryColorToken: meta.colorToken,
        categoryInitials: meta.initials,
      };
    });

    return groupTransactionsByDate(withCategoryMeta);
  }, [flatTransactions, categoriesQuery.data]);

  const isInitialLoading =
    transactionsList.status === 'pending' ||
    categoriesQuery.status === 'pending' ||
    accountsQuery.status === 'pending';

  const isError =
    transactionsList.status === 'error' ||
    categoriesQuery.status === 'error' ||
    accountsQuery.status === 'error';

  function handleEndReached() {
    if (transactionsList.hasNextPage && !transactionsList.isFetchingNextPage) {
      transactionsList.fetchNextPage();
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + theme.spacing.lg }]}>
      <Text style={styles.title} accessibilityRole="header">
        Transactions
      </Text>

      <View style={styles.filterBarWrapper}>
        <FilterBar
          accounts={accountsQuery.data ?? []}
          categories={categoriesQuery.data ?? []}
          months={monthOptions}
          accountId={accountId}
          categoryId={categoryId}
          month={month}
          onAccountChange={setAccountId}
          onCategoryChange={setCategoryId}
          onMonthChange={setMonth}
        />
      </View>

      {isInitialLoading ? (
        <View testID="transactions-skeleton" style={styles.skeletonWrapper}>
          <CardSkeleton lines={SKELETON_LINES} />
        </View>
      ) : isError ? (
        <View style={styles.messageWrapper}>
          <Text style={styles.messageText}>Something went wrong loading transactions.</Text>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.messageWrapper}>
          <Text style={styles.messageText}>No transactions match these filters.</Text>
        </View>
      ) : (
        <SectionList
          testID="transactions-list"
          sections={sections}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          onEndReachedThreshold={0.4}
          onEndReached={handleEndReached}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
              <View style={styles.sectionHeaderLine} />
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <TransactionRow
                merchant={item.merchant}
                categoryLabel={item.categoryLabel}
                categoryInitials={item.categoryInitials}
                color={resolveColorToken(item.categoryColorToken)}
                dateLabel={formatRelativeDate(item.date)}
                amountCents={item.amountCents}
              />
            </View>
          )}
          ListFooterComponent={
            transactionsList.isFetchingNextPage ? (
              <ActivityIndicator
                testID="transactions-pagination-loader"
                style={styles.footerLoader}
                color={theme.colors.text.secondary}
              />
            ) : undefined
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    ...theme.typography.greetingTitle,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  filterBarWrapper: {
    marginBottom: theme.spacing.lg,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionHeaderText: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
  },
  row: {
    marginBottom: theme.spacing.lg,
  },
  skeletonWrapper: {
    marginTop: theme.spacing.sm,
  },
  footerLoader: {
    marginVertical: theme.spacing.lg,
  },
  messageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing.xxxl,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
