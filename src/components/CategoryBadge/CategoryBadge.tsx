import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme';

export interface CategoryBadgeProps {
  initials: string;
  color: string;
  size?: number;
}

const DEFAULT_SIZE = 40;

export function CategoryBadge({ initials, color, size = DEFAULT_SIZE }: CategoryBadgeProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
      ]}>
      <Text style={styles.text}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...theme.typography.cardAction,
    color: theme.colors.surface,
  },
});
