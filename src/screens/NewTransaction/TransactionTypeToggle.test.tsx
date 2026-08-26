import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TransactionTypeToggle } from './TransactionTypeToggle';

describe('TransactionTypeToggle', () => {
  it('marks the current value as checked', async () => {
    await render(<TransactionTypeToggle value="expense" onChange={jest.fn()} />);

    expect(screen.getByRole('radio', { checked: true })).toHaveAccessibleName('Expense');
  });

  it('fires onChange with "income" when Income is pressed', async () => {
    const onChange = jest.fn();
    await render(<TransactionTypeToggle value="expense" onChange={onChange} />);

    fireEvent.press(screen.getByText('Income'));

    expect(onChange).toHaveBeenCalledWith('income');
  });

  it('fires onChange with "expense" when Expense is pressed', async () => {
    const onChange = jest.fn();
    await render(<TransactionTypeToggle value="income" onChange={onChange} />);

    fireEvent.press(screen.getByText('Expense'));

    expect(onChange).toHaveBeenCalledWith('expense');
  });
});
