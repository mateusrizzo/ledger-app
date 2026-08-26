import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { InsightItem } from './InsightItem';

describe('InsightItem', () => {
  it('renders the title and body', async () => {
    await render(
      <InsightItem
        title="Food & Dining is your fastest-growing category"
        body="You spent more than usual."
        categoryColorToken="category.foodDining"
      />,
    );

    expect(screen.getByText('Food & Dining is your fastest-growing category')).toBeOnTheScreen();
    expect(screen.getByText('You spent more than usual.')).toBeOnTheScreen();
  });

  it('falls back to the neutral accent color when categoryColorToken is null', async () => {
    await render(<InsightItem title="Fixed costs stay steady" body="Held steady." categoryColorToken={null} />);

    expect(screen.getByText('Fixed costs stay steady')).toBeOnTheScreen();
  });

  it('is naturally accessible without any special accessibility props', async () => {
    await render(
      <InsightItem title="Some insight" body="Some body." categoryColorToken="category.foodDining" />,
    );

    const title = screen.getByText('Some insight');
    expect(title.props.accessibilityElementsHidden).not.toBe(true);
  });
});
