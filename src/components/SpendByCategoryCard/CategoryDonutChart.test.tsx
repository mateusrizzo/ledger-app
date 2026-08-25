import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CategoryDonutChart } from './CategoryDonutChart';

const SEGMENTS = [
  { label: 'Housing', value: 90000, percentage: 37, color: '#6E6B3F' },
  { label: 'Food & Dining', value: 68000, percentage: 28, color: '#B5602E' },
];

describe('CategoryDonutChart', () => {
  it('renders one ring segment per entry in segments', async () => {
    await render(
      <CategoryDonutChart segments={SEGMENTS} centerLabel="Total" centerValue="R$ 2.440,00" />,
    );

    expect(
      screen.getByTestId('category-donut-chart-segment-Housing', { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      screen.getByTestId('category-donut-chart-segment-Food & Dining', {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
  });

  it('renders the center label and value', async () => {
    await render(
      <CategoryDonutChart segments={SEGMENTS} centerLabel="Total" centerValue="R$ 2.440,00" />,
    );

    expect(screen.getByText('Total', { includeHiddenElements: true })).toBeTruthy();
    expect(
      screen.getByText('R$ 2.440,00', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('is hidden from screen readers, since it is purely decorative', async () => {
    await render(
      <CategoryDonutChart segments={SEGMENTS} centerLabel="Total" centerValue="R$ 2.440,00" />,
    );

    const root = screen.getByTestId('category-donut-chart', { includeHiddenElements: true });
    expect(root.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
