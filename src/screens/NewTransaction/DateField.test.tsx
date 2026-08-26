import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { DateField } from './DateField';

const TODAY = new Date().toISOString();

describe('DateField', () => {
  it('shows "Today, <full date>" for the current date', async () => {
    await render(<DateField value={TODAY} onChange={jest.fn()} />);

    expect(screen.getByText(/^Today, /)).toBeOnTheScreen();
  });

  it('opens the picker panel when the trigger is pressed', async () => {
    await render(<DateField value={TODAY} onChange={jest.fn()} />);

    await fireEvent.press(screen.getByText(/^Today, /));

    expect(screen.getByTestId('date-time-picker')).toBeOnTheScreen();
    expect(screen.getByText('Done')).toBeOnTheScreen();
  });

  it('fires onChange with the ISO string of the picked date', async () => {
    const onChange = jest.fn();
    await render(<DateField value={TODAY} onChange={onChange} />);

    await fireEvent.press(screen.getByText(/^Today, /));
    const picked = new Date('2026-08-15T12:00:00.000Z');
    fireEvent(screen.getByTestId('date-time-picker'), 'onChange', { type: 'set' }, picked);

    expect(onChange).toHaveBeenCalledWith(picked.toISOString());
  });

  it('closes the picker panel when Done is pressed', async () => {
    await render(<DateField value={TODAY} onChange={jest.fn()} />);

    await fireEvent.press(screen.getByText(/^Today, /));
    await fireEvent.press(screen.getByText('Done'));

    expect(screen.queryByTestId('date-time-picker')).toBeNull();
  });
});
