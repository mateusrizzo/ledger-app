import type { Category } from '../types/category.types';

export interface CategoryMeta {
  label: string;
  colorToken: string;
  initials: string;
}

const FALLBACK_META: CategoryMeta = {
  label: 'Other',
  colorToken: 'category.other',
  initials: '?',
};

export function getCategoryMeta(
  categoryId: string,
  categories: Category[],
): CategoryMeta {
  const category = categories.find(c => c.id === categoryId);
  if (!category) {
    return FALLBACK_META;
  }

  return {
    label: category.label,
    colorToken: category.colorToken,
    initials: category.label.slice(0, 2),
  };
}
