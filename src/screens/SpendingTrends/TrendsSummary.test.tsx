import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TrendsSummary } from './TrendsSummary';

describe('TrendsSummary', () => {
  it('renders the title, monthly average, and a "+" prefixed delta when spending is above average', async () => {
    await render(<TrendsSummary monthlyAverageCents={240667} deltaVsAveragePercent={1} />);

    expect(screen.getByText('Last 6 months')).toBeOnTheScreen();
    expect(screen.getByText('Monthly average R$ 2.406,67')).toBeOnTheScreen();
    expect(screen.getByText('+1% vs avg')).toBeOnTheScreen();
  });

  it('renders the delta without a "+" prefix when spending is below average', async () => {
    await render(<TrendsSummary monthlyAverageCents={240667} deltaVsAveragePercent={-3} />);

    expect(screen.getByText('-3% vs avg')).toBeOnTheScreen();
  });
});
