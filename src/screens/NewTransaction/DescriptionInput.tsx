import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { theme } from '@theme';

export interface DescriptionInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function DescriptionInput({ value, onChangeText }: DescriptionInputProps): React.JSX.Element {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="Optional"
      placeholderTextColor={theme.colors.text.tertiary}
      accessibilityLabel="Description"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
});
