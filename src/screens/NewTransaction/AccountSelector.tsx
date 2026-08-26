import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Account } from '@models/account.types';
import { theme } from '@theme';

export interface AccountSelectorProps {
  accounts: Account[];
  selectedAccountId: string | undefined;
  onChange: (accountId: string) => void;
}

export function AccountSelector({ accounts, selectedAccountId, onChange }: AccountSelectorProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const selectedAccount = accounts.find(account => account.id === selectedAccountId);

  function handleSelect(accountId: string) {
    onChange(accountId);
    setIsOpen(false);
  }

  return (
    <View style={[styles.container, isOpen ? styles.containerOpen : null]}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(previous => !previous)}
        accessibilityRole="button"
        accessibilityLabel={`Account, ${selectedAccount?.name ?? 'none selected'}`}>
        <Text style={styles.triggerLabel}>{selectedAccount?.name ?? 'Select account'}</Text>
        <Text style={styles.chevron}>⌄</Text>
      </TouchableOpacity>
      {isOpen ? (
        <View style={styles.panel}>
          <ScrollView bounces={false} style={styles.panelScroll}>
            {accounts.map(account => {
              const isSelected = account.id === selectedAccountId;
              return (
                <TouchableOpacity
                  key={account.id}
                  style={styles.option}
                  onPress={() => handleSelect(account.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}>
                  <Text style={[styles.optionLabel, isSelected ? styles.optionLabelSelected : null]}>
                    {account.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  containerOpen: {
    zIndex: 20,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  triggerLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  chevron: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  panel: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: theme.spacing.xs,
    maxHeight: 200,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  panelScroll: {
    flexGrow: 0,
  },
  option: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  optionLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  optionLabelSelected: {
    color: theme.colors.text.link,
    fontWeight: '600',
  },
});
