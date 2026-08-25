import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CategoryLegendRow } from './CategoryLegendRow';

describe('CategoryLegendRow', () => {
  it('renders the label, amount, and percentage', async () => {
    await render(
      <CategoryLegendRow label="Housing" amountLabel="R$ 900,00" percentage={37} color="#6E6B3F" />,
    );

    expect(screen.getByText('Housing')).toBeOnTheScreen();
    expect(screen.getByText('R$ 900,00 · 37%')).toBeOnTheScreen();
  });
});
