import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { InsightsDisclaimer } from './InsightsDisclaimer';

describe('InsightsDisclaimer', () => {
  it('renders the disclaimer with the data-driven lookback window', async () => {
    await render(<InsightsDisclaimer basedOnMonths={6} />);

    expect(
      screen.getByText('Generated from your last 6 months of activity. Review before acting on it.'),
    ).toBeOnTheScreen();
  });

  it('is not hidden from screen readers', async () => {
    await render(<InsightsDisclaimer basedOnMonths={6} />);

    const text = screen.getByText(/Generated from your last/);
    expect(text.props.accessibilityElementsHidden).not.toBe(true);
    expect(text.props.importantForAccessibility).not.toBe('no-hide-descendants');
  });
});
