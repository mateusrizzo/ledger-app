import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { Account } from '@models/account.types';
import type { Category } from '@models/category.types';
import { FilterBar } from './FilterBar';

const ACCOUNTS: Account[] = [{ id: 'checking', name: 'Checking' }];
const CATEGORIES: Category[] = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining', kind: 'expense' },
];
const MONTHS = [{ value: '2026-08', label: 'August 2026' }];

function renderFilterBar(overrides: Partial<React.ComponentProps<typeof FilterBar>> = {}) {
  return render(
    <FilterBar
      accounts={ACCOUNTS}
      categories={CATEGORIES}
      months={MONTHS}
      accountId={undefined}
      categoryId={undefined}
      month={undefined}
      onAccountChange={jest.fn()}
      onCategoryChange={jest.fn()}
      onMonthChange={jest.fn()}
      {...overrides}
    />,
  );
}

describe('FilterBar', () => {
  it('renders the allLabel placeholder for each filter when nothing is selected', async () => {
    await renderFilterBar();

    expect(screen.getByText('All accounts')).toBeOnTheScreen();
    expect(screen.getByText('All categories')).toBeOnTheScreen();
    expect(screen.getByText('Month')).toBeOnTheScreen();
  });

  it('fires onAccountChange when an account option is selected', async () => {
    const onAccountChange = jest.fn();
    await renderFilterBar({ onAccountChange });

    await fireEvent.press(screen.getByText('All accounts'));
    fireEvent.press(screen.getByText('Checking'));

    expect(onAccountChange).toHaveBeenCalledWith('checking');
  });

  it('fires onCategoryChange when a category option is selected', async () => {
    const onCategoryChange = jest.fn();
    await renderFilterBar({ onCategoryChange });

    await fireEvent.press(screen.getByText('All categories'));
    fireEvent.press(screen.getByText('Food & Dining'));

    expect(onCategoryChange).toHaveBeenCalledWith('food-dining');
  });

  it('fires onMonthChange when a month option is selected', async () => {
    const onMonthChange = jest.fn();
    await renderFilterBar({ onMonthChange });

    await fireEvent.press(screen.getByText('Month'));
    fireEvent.press(screen.getByText('August 2026'));

    expect(onMonthChange).toHaveBeenCalledWith('2026-08');
  });
});
