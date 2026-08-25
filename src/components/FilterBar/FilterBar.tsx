import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Account } from '@models/account.types';
import type { Category } from '@models/category.types';
import { theme } from '@theme';
import type { MonthOption } from '@utils/getRecentMonthOptions';
import { FilterDropdown } from './FilterDropdown';

export interface FilterBarProps {
  accounts: Account[];
  categories: Category[];
  months: MonthOption[];
  accountId: string | undefined;
  categoryId: string | undefined;
  month: string | undefined;
  onAccountChange: (value: string | undefined) => void;
  onCategoryChange: (value: string | undefined) => void;
  onMonthChange: (value: string | undefined) => void;
}

export function FilterBar({
  accounts,
  categories,
  months,
  accountId,
  categoryId,
  month,
  onAccountChange,
  onCategoryChange,
  onMonthChange,
}: FilterBarProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <FilterDropdown
        allLabel="All accounts"
        options={accounts.map(account => ({ value: account.id, label: account.name }))}
        selectedValue={accountId}
        onChange={onAccountChange}
      />
      <FilterDropdown
        allLabel="All categories"
        options={categories.map(category => ({ value: category.id, label: category.label }))}
        selectedValue={categoryId}
        onChange={onCategoryChange}
      />
      <FilterDropdown
        allLabel="Month"
        options={months}
        selectedValue={month}
        onChange={onMonthChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
});
