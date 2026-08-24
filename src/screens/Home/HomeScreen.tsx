import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export function HomeScreen(): React.JSX.Element {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.greeting}>Good afternoon</Text>
      <Text style={styles.subtitle}>August 2026</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  greeting: {
    ...typography.greetingTitle,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.screenSubtitle,
    color: colors.text.secondary,
  },
});
