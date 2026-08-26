import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { DescriptionInput } from './DescriptionInput';

describe('DescriptionInput', () => {
  it('shows the "Optional" placeholder when empty', async () => {
    await render(<DescriptionInput value="" onChangeText={jest.fn()} />);

    expect(screen.getByPlaceholderText('Optional')).toBeOnTheScreen();
  });

  it('fires onChangeText as the user types', async () => {
    const onChangeText = jest.fn();
    await render(<DescriptionInput value="" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByPlaceholderText('Optional'), 'Birthday gift');

    expect(onChangeText).toHaveBeenCalledWith('Birthday gift');
  });
});
