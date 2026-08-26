import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { TransactionType } from '@models/transaction.types';
import { theme } from '@theme';

export interface TransactionTypeToggleProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
}

const OPTIONS: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

export function TransactionTypeToggle({ value, onChange }: TransactionTypeToggleProps): React.JSX.Element {
  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {OPTIONS.map(option => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.segment, selected ? styles.segmentActive : null]}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={option.label}>
            <Text
              style={[
                styles.label,
                selected ? (option.value === 'expense' ? styles.labelExpense : styles.labelIncome) : null,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.full,
    padding: theme.spacing.xs,
  },
  segment: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: theme.colors.surface,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.secondary,
  },
  labelExpense: {
    color: theme.colors.amount.negative,
  },
  labelIncome: {
    color: theme.colors.amount.positive,
  },
});
