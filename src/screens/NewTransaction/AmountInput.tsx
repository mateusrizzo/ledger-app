import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import type { TransactionType } from '@models/transaction.types';
import { theme } from '@theme';
import { formatCurrency } from '@utils/formatCurrency';

export interface AmountInputProps {
  amountCents: number;
  type: TransactionType;
  onChangeAmountCents: (amountCents: number) => void;
}

function parseDigitsToCents(text: string): number {
  const digitsOnly = text.replace(/\D/g, '');
  return digitsOnly === '' ? 0 : parseInt(digitsOnly, 10);
}

export function AmountInput({ amountCents, type, onChangeAmountCents }: AmountInputProps): React.JSX.Element {
  const displayValue = formatCurrency(amountCents);

  return (
    <TextInput
      style={[styles.input, type === 'income' ? styles.income : styles.expense]}
      value={displayValue}
      onChangeText={text => onChangeAmountCents(parseDigitsToCents(text))}
      keyboardType="number-pad"
      accessibilityLabel="Amount in reais"
      accessibilityValue={{ text: displayValue }}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...theme.typography.amountLarge,
    fontSize: 40,
    lineHeight: 48,
    textAlign: 'center',
  },
  expense: {
    color: theme.colors.amount.negative,
  },
  income: {
    color: theme.colors.amount.positive,
  },
});
