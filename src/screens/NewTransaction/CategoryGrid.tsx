import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Category } from '@models/category.types';
import { theme } from '@theme';
import { CategoryTile } from './CategoryTile';

export interface CategoryGridProps {
  categories: Category[];
  selectedCategoryId: string | undefined;
  onSelect: (categoryId: string) => void;
}

export function CategoryGrid({ categories, selectedCategoryId, onSelect }: CategoryGridProps): React.JSX.Element {
  return (
    <View style={styles.grid} accessibilityRole="radiogroup">
      {categories.map(category => (
        <CategoryTile
          key={category.id}
          category={category}
          selected={category.id === selectedCategoryId}
          onPress={() => onSelect(category.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
