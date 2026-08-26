import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { Account } from '@models/account.types';
import { AccountSelector } from './AccountSelector';

const ACCOUNTS: Account[] = [
  { id: 'checking', name: 'Checking' },
  { id: 'savings', name: 'Savings' },
];

describe('AccountSelector', () => {
  it('shows the selected account name', async () => {
    await render(
      <AccountSelector accounts={ACCOUNTS} selectedAccountId="checking" onChange={jest.fn()} />,
    );

    expect(screen.getByText('Checking')).toBeOnTheScreen();
  });

  it('shows a placeholder when nothing is selected', async () => {
    await render(
      <AccountSelector accounts={ACCOUNTS} selectedAccountId={undefined} onChange={jest.fn()} />,
    );

    expect(screen.getByText('Select account')).toBeOnTheScreen();
  });

  it('opens the option list and fires onChange with the pressed account id', async () => {
    const onChange = jest.fn();
    await render(
      <AccountSelector accounts={ACCOUNTS} selectedAccountId="checking" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByText('Checking'));
    fireEvent.press(screen.getByText('Savings'));

    expect(onChange).toHaveBeenCalledWith('savings');
  });
});
