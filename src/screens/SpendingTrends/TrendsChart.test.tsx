import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TrendsChart } from './TrendsChart';

const MONTHS = [
  { month: '2026-03-01', amountCents: 220000, isCurrent: false },
  { month: '2026-08-01', amountCents: 244000, isCurrent: true },
];

describe('TrendsChart', () => {
  it('renders one column per month with its compact amount and month label', async () => {
    await render(<TrendsChart months={MONTHS} />);

    expect(screen.getByText('2,2k', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText('Mar', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText('2,4k', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText('Aug', { includeHiddenElements: true })).toBeTruthy();
  });

  it('is hidden from screen readers, since it is purely decorative', async () => {
    await render(<TrendsChart months={MONTHS} />);

    const root = screen.getByTestId('trends-chart', { includeHiddenElements: true });
    expect(root.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
