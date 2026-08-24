import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', async () => {
    await render(
      <Card>
        <Text>Card body</Text>
      </Card>,
    );

    expect(screen.getByText('Card body')).toBeOnTheScreen();
  });

  it('renders a title with header accessibility role', async () => {
    await render(
      <Card title="Budget progress">
        <Text>Card body</Text>
      </Card>,
    );

    const title = screen.getByText('Budget progress');
    expect(title).toBeOnTheScreen();
    expect(title.props.accessibilityRole).toBe('header');
  });

  it('omits the header entirely when no title is given', async () => {
    await render(
      <Card>
        <Text>Card body</Text>
      </Card>,
    );

    expect(screen.queryByRole('header')).not.toBeOnTheScreen();
  });

  it('renders an action and fires its onPress handler', async () => {
    const onPress = jest.fn();

    await render(
      <Card title="Recent transactions" action={{ label: 'See all', onPress }}>
        <Text>Card body</Text>
      </Card>,
    );

    fireEvent.press(screen.getByText('See all'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not render an action when none is given', async () => {
    await render(
      <Card title="Balance">
        <Text>Card body</Text>
      </Card>,
    );

    expect(screen.queryByText('See all')).not.toBeOnTheScreen();
  });
});
