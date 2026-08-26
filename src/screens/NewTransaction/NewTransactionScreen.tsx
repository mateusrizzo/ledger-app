import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAccounts } from '@hooks/useAccounts';
import { useCategories } from '@hooks/useCategories';
import { useCreateTransaction } from '@hooks/useCreateTransaction';
import type { RootStackParamList } from '@navigation/types';
import { theme } from '@theme';
import { AccountSelector } from './AccountSelector';
import { AmountInput } from './AmountInput';
import { CategoryGrid } from './CategoryGrid';
import { DateField } from './DateField';
import { DescriptionInput } from './DescriptionInput';
import { TransactionTypeToggle } from './TransactionTypeToggle';

export function NewTransactionScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const accountsQuery = useAccounts();
  const categoriesQuery = useCategories();
  const createTransactionMutation = useCreateTransaction();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountCents, setAmountCents] = useState(0);
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [date, setDate] = useState(() => new Date().toISOString());
  const [description, setDescription] = useState('');

  const accountId = selectedAccountId ?? accountsQuery.data?.[0]?.id;

  const categoriesForType = useMemo(
    () => categoriesQuery.data?.filter(category => category.kind === type) ?? [],
    [categoriesQuery.data, type],
  );

  function handleTypeChange(nextType: 'expense' | 'income') {
    setType(nextType);
    setCategoryId(undefined);
  }

  const isValid = amountCents > 0 && categoryId !== undefined && accountId !== undefined;

  function handleSave() {
    if (amountCents <= 0 || categoryId === undefined || accountId === undefined) {
      return;
    }

    createTransactionMutation.mutate(
      { type, amountCents, accountId, categoryId, date, description: description.trim() || undefined },
      { onSuccess: () => navigation.goBack() },
    );
  }

  const isReady = accountsQuery.data !== undefined && categoriesQuery.data !== undefined;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Cancel">
          <Text style={styles.cancelLabel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title} accessibilityRole="header">
          New Transaction
        </Text>
        <View style={styles.headerSide} />
      </View>

      {!isReady ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator color={theme.colors.text.secondary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <TransactionTypeToggle value={type} onChange={handleTypeChange} />

          <AmountInput amountCents={amountCents} type={type} onChangeAmountCents={setAmountCents} />

          <View style={styles.field}>
            <Text style={styles.label}>Account</Text>
            <AccountSelector
              accounts={accountsQuery.data ?? []}
              selectedAccountId={accountId}
              onChange={setSelectedAccountId}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <CategoryGrid
              categories={categoriesForType}
              selectedCategoryId={categoryId}
              onSelect={setCategoryId}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Date</Text>
            <DateField value={date} onChange={setDate} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <DescriptionInput value={description} onChangeText={setDescription} />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, !isValid ? styles.saveButtonDisabled : null]}
            onPress={handleSave}
            disabled={!isValid || createTransactionMutation.isPending}
            accessibilityRole="button"
            accessibilityLabel="Save"
            accessibilityState={{ disabled: !isValid || createTransactionMutation.isPending }}>
            {createTransactionMutation.isPending ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <Text style={styles.saveLabel}>Save</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerSide: {
    minWidth: 64,
  },
  cancelLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textDecorationLine: 'underline',
  },
  title: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.xl,
  },
  field: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  saveButton: {
    backgroundColor: theme.colors.text.link,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveLabel: {
    ...theme.typography.bodyStrong,
    color: theme.colors.surface,
  },
});
