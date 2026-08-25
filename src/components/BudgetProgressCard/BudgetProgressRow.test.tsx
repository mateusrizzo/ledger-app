import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { theme } from '@theme';
import { formatCurrency } from '@utils/formatCurrency';
import { BudgetProgressRow } from './BudgetProgressRow';

describe('BudgetProgressRow', () => {
  it('renders the label and formatted amount', async () => {
    await render(
      <BudgetProgressRow label="Transport" spentCents={31000} limitCents={45000} status="under" />,
    );

    expect(screen.getByText('Transport')).toBeOnTheScreen();
    expect(screen.getByText('R$ 310,00 / R$ 450,00')).toBeOnTheScreen();
  });

  it('exposes progressbar accessibility semantics capped at the limit, announcing over-budget in words rather than relying on color alone', async () => {
    await render(
      <BudgetProgressRow label="Shopping" spentCents={25000} limitCents={20000} status="over" />,
    );

    const track = screen.getByRole('progressbar');
    expect(track.props.accessibilityValue).toEqual({
      min: 0,
      max: 20000,
      now: 20000,
      text: `Shopping, ${formatCurrency(25000)} / ${formatCurrency(20000)}, over budget`,
    });
  });

  it('colors the fill according to status', async () => {
    await render(
      <BudgetProgressRow label="Shopping" spentCents={25000} limitCents={20000} status="over" />,
    );

    const fill = screen.getByTestId('budget-progress-fill');
    const flatStyle = Object.assign({}, ...[].concat(fill.props.style));
    expect(flatStyle.backgroundColor).toBe(theme.colors.status.over);
  });

  it('caps the visual fill width at 100% when over budget', async () => {
    await render(
      <BudgetProgressRow label="Shopping" spentCents={25000} limitCents={20000} status="over" />,
    );

    const fill = screen.getByTestId('budget-progress-fill');
    const flatStyle = Object.assign({}, ...[].concat(fill.props.style));
    expect(flatStyle.width).toBe('100%');
  });
});
