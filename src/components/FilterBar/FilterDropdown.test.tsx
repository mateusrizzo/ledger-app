import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { FilterDropdown } from './FilterDropdown';

const OPTIONS = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
];

describe('FilterDropdown', () => {
  it('shows the allLabel when nothing is selected', async () => {
    await render(
      <FilterDropdown allLabel="All accounts" options={OPTIONS} selectedValue={undefined} onChange={jest.fn()} />,
    );

    expect(screen.getByText('All accounts')).toBeOnTheScreen();
  });

  it('shows the selected option label instead of the allLabel', async () => {
    await render(
      <FilterDropdown allLabel="All accounts" options={OPTIONS} selectedValue="savings" onChange={jest.fn()} />,
    );

    expect(screen.getByText('Savings')).toBeOnTheScreen();
  });

  it('opens the option list and fires onChange with the pressed option value', async () => {
    const onChange = jest.fn();
    await render(
      <FilterDropdown allLabel="All accounts" options={OPTIONS} selectedValue={undefined} onChange={onChange} />,
    );

    await fireEvent.press(screen.getByText('All accounts'));
    fireEvent.press(screen.getByText('Savings'));

    expect(onChange).toHaveBeenCalledWith('savings');
  });

  it('fires onChange with undefined when the "all" option is pressed', async () => {
    const onChange = jest.fn();
    await render(
      <FilterDropdown allLabel="All accounts" options={OPTIONS} selectedValue="checking" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByText('Checking'));
    fireEvent.press(screen.getByText('All accounts'));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
