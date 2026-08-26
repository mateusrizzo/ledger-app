import type { Category } from '@models/category.types';
import { getInitials } from './getInitials';

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
    initials: getInitials(category.label),
  };
}
