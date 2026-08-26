import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { Category } from '@models/category.types';
import { theme } from '@theme';
import { CategoryTile } from './CategoryTile';

const CATEGORY: Category = {
  id: 'food-dining',
  label: 'Food & Dining',
  colorToken: 'category.foodDining',
  kind: 'expense',
};

describe('CategoryTile', () => {
  it('renders the category label and badge initials', async () => {
    await render(<CategoryTile category={CATEGORY} selected={false} onPress={jest.fn()} />);

    expect(screen.getByText('Food & Dining')).toBeOnTheScreen();
    expect(screen.getByText('Fo')).toBeOnTheScreen();
  });

  it('marks itself as checked when selected', async () => {
    await render(<CategoryTile category={CATEGORY} selected onPress={jest.fn()} />);

    expect(screen.getByRole('radio', { checked: true })).toHaveAccessibleName('Food & Dining');
  });

  it('highlights the border with the link color when selected', async () => {
    await render(<CategoryTile category={CATEGORY} selected onPress={jest.fn()} />);

    const tile = screen.getByRole('radio');
    const flatStyle = Object.assign({}, ...[].concat(tile.props.style));
    expect(flatStyle.borderColor).toBe(theme.colors.text.link);
  });

  it('fires onPress when tapped', async () => {
    const onPress = jest.fn();
    await render(<CategoryTile category={CATEGORY} selected={false} onPress={onPress} />);

    fireEvent.press(screen.getByText('Food & Dining'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
