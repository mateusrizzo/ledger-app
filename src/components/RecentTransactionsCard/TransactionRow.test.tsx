import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { theme } from '@theme';
import { TransactionRow } from './TransactionRow';

describe('TransactionRow', () => {
  it('renders the merchant, category, and date', async () => {
    await render(
      <TransactionRow
        merchant="Grocery Store"
        categoryLabel="Food & Dining"
        categoryInitials="Fo"
        color="#B5602E"
        dateLabel="Today"
        amountCents={-8540}
      />,
    );

    expect(screen.getByText('Grocery Store')).toBeOnTheScreen();
    expect(screen.getByText('Food & Dining · Today')).toBeOnTheScreen();
    expect(screen.getByText('Fo')).toBeOnTheScreen();
  });

  it('prefixes an expense with a minus sign and colors it negative', async () => {
    await render(
      <TransactionRow
        merchant="Grocery Store"
        categoryLabel="Food & Dining"
        categoryInitials="Fo"
        color="#B5602E"
        dateLabel="Today"
        amountCents={-8540}
      />,
    );

    const amount = screen.getByText('-R$ 85,40');
    const flatStyle = Object.assign({}, ...[].concat(amount.props.style));
    expect(flatStyle.color).toBe(theme.colors.amount.negative);
  });

  it('prefixes income with a plus sign and colors it positive', async () => {
    await render(
      <TransactionRow
        merchant="Salary Deposit"
        categoryLabel="Salary"
        categoryInitials="Sa"
        color="#2F7A66"
        dateLabel="Today"
        amountCents={320000}
      />,
    );

    const amount = screen.getByText('+R$ 3.200,00');
    const flatStyle = Object.assign({}, ...[].concat(amount.props.style));
    expect(flatStyle.color).toBe(theme.colors.amount.positive);
  });

  it('composes a single accessibility label instead of separate fragments', async () => {
    await render(
      <TransactionRow
        merchant="Grocery Store"
        categoryLabel="Food & Dining"
        categoryInitials="Fo"
        color="#B5602E"
        dateLabel="Today"
        amountCents={-8540}
      />,
    );

    expect(
      screen.getByLabelText('Grocery Store, Food & Dining, Today, -R$ 85,40'),
    ).toBeOnTheScreen();
  });
});
