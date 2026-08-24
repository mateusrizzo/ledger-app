import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '@theme';

export interface CardAction {
  label: string;
  onPress: () => void;
}

export interface CardProps {
  title?: string;
  action?: CardAction;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ title, action, children, style }: CardProps): React.JSX.Element {
  const hasHeader = Boolean(title);

  return (
    <View style={[styles.card, style]}>
      {hasHeader ? (
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {action ? (
            <TouchableOpacity
              onPress={action.onPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={styles.action}>{action.label}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  action: {
    ...theme.typography.cardAction,
    color: theme.colors.text.link,
    textDecorationLine: 'underline',
  },
});
