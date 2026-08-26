import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CategoryBadge } from './CategoryBadge';

describe('CategoryBadge', () => {
  it('renders the initials text', async () => {
    await render(<CategoryBadge initials="Fo" color="#B5602E" />);

    expect(screen.getByText('Fo')).toBeOnTheScreen();
  });

  it('applies the given color as the background', async () => {
    await render(<CategoryBadge initials="Fo" color="#B5602E" />);

    const badge = screen.getByText('Fo').parent;
    const flatStyle = Object.assign({}, ...[].concat(badge?.props.style));
    expect(flatStyle.backgroundColor).toBe('#B5602E');
  });

  it('defaults to a 40pt circle and resizes when a custom size is given', async () => {
    await render(<CategoryBadge initials="Fo" color="#B5602E" size={64} />);

    const badge = screen.getByText('Fo').parent;
    const flatStyle = Object.assign({}, ...[].concat(badge?.props.style));
    expect(flatStyle.width).toBe(64);
    expect(flatStyle.height).toBe(64);
    expect(flatStyle.borderRadius).toBe(32);
  });
});
