import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '@theme';

export interface InsightsDisclaimerProps {
  basedOnMonths: number;
}

export function InsightsDisclaimer({ basedOnMonths }: InsightsDisclaimerProps): React.JSX.Element {
  return (
    <Text style={styles.disclaimer}>
      Generated from your last {basedOnMonths} months of activity. Review before acting on it.
    </Text>
  );
}

const styles = StyleSheet.create({
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
