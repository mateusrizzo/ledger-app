import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CategoryBadge } from '@components/CategoryBadge/CategoryBadge';
import type { Category } from '@models/category.types';
import { theme } from '@theme';
import { getInitials } from '@utils/getInitials';
import { resolveColorToken } from '@utils/resolveColorToken';

export interface CategoryTileProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
}

export const CategoryTile = React.memo(function CategoryTileComponent({
  category,
  selected,
  onPress,
}: CategoryTileProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.tile, selected ? styles.tileSelected : null]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={category.label}>
      <CategoryBadge initials={getInitials(category.label)} color={resolveColorToken(category.colorToken)} />
      <Text style={styles.label} numberOfLines={1}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  tile: {
    flexBasis: '31%',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
  },
  tileSelected: {
    borderColor: theme.colors.text.link,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});
