import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { theme } from '@theme';
import { AmountInput } from './AmountInput';

describe('AmountInput', () => {
  it('shows 0 formatted as currency when amountCents is 0', async () => {
    await render(<AmountInput amountCents={0} type="expense" onChangeAmountCents={jest.fn()} />);

    expect(screen.getByDisplayValue('R$ 0,00')).toBeOnTheScreen();
  });

  it('parses typed digits into cents, ignoring formatting characters', async () => {
    const onChangeAmountCents = jest.fn();
    await render(<AmountInput amountCents={0} type="expense" onChangeAmountCents={onChangeAmountCents} />);

    fireEvent.changeText(screen.getByDisplayValue('R$ 0,00'), 'R$ 1,50');

    expect(onChangeAmountCents).toHaveBeenCalledWith(150);
  });

  it('treats an empty field as 0 cents', async () => {
    const onChangeAmountCents = jest.fn();
    await render(<AmountInput amountCents={150} type="expense" onChangeAmountCents={onChangeAmountCents} />);

    fireEvent.changeText(screen.getByDisplayValue('R$ 1,50'), '');

    expect(onChangeAmountCents).toHaveBeenCalledWith(0);
  });

  it('colors the amount red for an expense and green for income', async () => {
    const { rerender } = await render(
      <AmountInput amountCents={100} type="expense" onChangeAmountCents={jest.fn()} />,
    );
    const expenseInput = screen.getByDisplayValue('R$ 1,00');
    const expenseStyle = Object.assign({}, ...[].concat(expenseInput.props.style));
    expect(expenseStyle.color).toBe(theme.colors.amount.negative);

    await rerender(<AmountInput amountCents={100} type="income" onChangeAmountCents={jest.fn()} />);
    const incomeInput = screen.getByDisplayValue('R$ 1,00');
    const incomeStyle = Object.assign({}, ...[].concat(incomeInput.props.style));
    expect(incomeStyle.color).toBe(theme.colors.amount.positive);
  });
});
