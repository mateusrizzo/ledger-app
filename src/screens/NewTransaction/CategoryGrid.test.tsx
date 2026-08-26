import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { Category } from '@models/category.types';
import { CategoryGrid } from './CategoryGrid';

const CATEGORIES: Category[] = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining', kind: 'expense' },
  { id: 'transport', label: 'Transport', colorToken: 'category.transport', kind: 'expense' },
];

describe('CategoryGrid', () => {
  it('renders one tile per category', async () => {
    await render(
      <CategoryGrid categories={CATEGORIES} selectedCategoryId={undefined} onSelect={jest.fn()} />,
    );

    expect(screen.getByText('Food & Dining')).toBeOnTheScreen();
    expect(screen.getByText('Transport')).toBeOnTheScreen();
  });

  it('marks the selected category as checked', async () => {
    await render(
      <CategoryGrid categories={CATEGORIES} selectedCategoryId="transport" onSelect={jest.fn()} />,
    );

    expect(screen.getByRole('radio', { checked: true })).toHaveAccessibleName('Transport');
  });

  it('fires onSelect with the pressed category id', async () => {
    const onSelect = jest.fn();
    await render(
      <CategoryGrid categories={CATEGORIES} selectedCategoryId={undefined} onSelect={onSelect} />,
    );

    fireEvent.press(screen.getByText('Food & Dining'));

    expect(onSelect).toHaveBeenCalledWith('food-dining');
  });
});
