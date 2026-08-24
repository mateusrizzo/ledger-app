import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CardSkeleton } from './CardSkeleton';

describe('CardSkeleton', () => {
  it('renders one shimmer line per entry in the lines prop', async () => {
    await render(
      <CardSkeleton
        lines={[
          { widthPercent: 40, heightPx: 12 },
          { widthPercent: 70, heightPx: 20 },
          { widthPercent: 55, heightPx: 20 },
        ]}
      />,
    );

    expect(
      screen.getAllByTestId(/^card-skeleton-line-/, { includeHiddenElements: true }),
    ).toHaveLength(3);
  });

  it('sizes each line from the lines prop', async () => {
    await render(<CardSkeleton lines={[{ widthPercent: 40, heightPx: 12 }]} />);

    const line = screen.getByTestId('card-skeleton-line-0', { includeHiddenElements: true });
    const flatStyle = Object.assign({}, ...[].concat(line.props.style));
    expect(flatStyle.width).toBe('40%');
    expect(flatStyle.height).toBe(12);
  });

  it('is hidden from screen readers', async () => {
    await render(<CardSkeleton lines={[{ widthPercent: 40, heightPx: 12 }]} />);

    const root = screen.getByTestId('card-skeleton', { includeHiddenElements: true });
    expect(root.props.importantForAccessibility).toBe('no-hide-descendants');
  });

  it('reserves a header spacer when hasHeader is true', async () => {
    await render(<CardSkeleton hasHeader lines={[{ widthPercent: 40, heightPx: 12 }]} />);

    expect(
      screen.getByTestId('card-skeleton-header-spacer', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('omits the header spacer by default', async () => {
    await render(<CardSkeleton lines={[{ widthPercent: 40, heightPx: 12 }]} />);

    expect(
      screen.queryByTestId('card-skeleton-header-spacer', { includeHiddenElements: true }),
    ).toBeNull();
  });
});
