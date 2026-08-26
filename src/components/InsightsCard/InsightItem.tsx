import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme';
import { resolveColorToken } from '@utils/resolveColorToken';

export interface InsightItemProps {
  title: string;
  body: string;
  categoryColorToken: string | null;
}

export function InsightItem({ title, body, categoryColorToken }: InsightItemProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: resolveColorToken(categoryColorToken) }]} />
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: theme.radius.full,
    marginTop: 6,
  },
  textColumn: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
});
