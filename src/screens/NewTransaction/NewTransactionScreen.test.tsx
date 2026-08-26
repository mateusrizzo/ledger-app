import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { getAccounts } from '@services/accounts';
import { getCategories } from '@services/categories';
import { createTransaction } from '@services/transactions';
import { NewTransactionScreen } from './NewTransactionScreen';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('@services/accounts');
jest.mock('@services/categories');
jest.mock('@services/transactions');

const mockGetAccounts = getAccounts as jest.MockedFunction<typeof getAccounts>;
const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>;
const mockCreateTransaction = createTransaction as jest.MockedFunction<typeof createTransaction>;

const ACCOUNTS = [
  { id: 'checking', name: 'Checking' },
  { id: 'savings', name: 'Savings' },
];

const CATEGORIES = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining', kind: 'expense' as const },
  { id: 'salary', label: 'Salary', colorToken: 'category.salary', kind: 'income' as const },
];

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NewTransactionScreen />
    </QueryClientProvider>,
  );
}

describe('NewTransactionScreen', () => {
  beforeEach(() => {
    mockGetAccounts.mockResolvedValue(ACCOUNTS);
    mockGetCategories.mockResolvedValue(CATEGORIES);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading indicator until accounts and categories resolve', async () => {
    mockGetAccounts.mockReturnValue(new Promise(() => {}));

    await renderScreen();

    expect(screen.queryByText('Food & Dining')).toBeNull();
  });

  it('defaults to the first account and shows only expense categories', async () => {
    await renderScreen();

    await waitFor(() => expect(screen.getByText('Food & Dining')).toBeOnTheScreen());
    expect(screen.getByText('Checking')).toBeOnTheScreen();
    expect(screen.queryByText('Salary')).toBeNull();
  });

  it('disables Save until an amount and category are set', async () => {
    await renderScreen();
    await waitFor(() => expect(screen.getByText('Food & Dining')).toBeOnTheScreen());

    expect(screen.getByLabelText('Save').props.accessibilityState.disabled).toBe(true);

    await fireEvent.changeText(screen.getByDisplayValue('R$ 0,00'), 'R$ 10,00');
    expect(screen.getByLabelText('Save').props.accessibilityState.disabled).toBe(true);

    await fireEvent.press(screen.getByText('Food & Dining'));
    expect(screen.getByLabelText('Save').props.accessibilityState.disabled).toBe(false);
  });

  it('clears the selected category when switching transaction type', async () => {
    await renderScreen();
    await waitFor(() => expect(screen.getByText('Food & Dining')).toBeOnTheScreen());

    await fireEvent.press(screen.getByText('Food & Dining'));
    await fireEvent.press(screen.getByText('Income'));

    expect(screen.getByText('Salary')).toBeOnTheScreen();
    expect(screen.queryByText('Food & Dining')).toBeNull();
    expect(screen.getByLabelText('Save').props.accessibilityState.disabled).toBe(true);
  });

  it('creates the transaction with a positive amount and navigates back on success', async () => {
    mockCreateTransaction.mockResolvedValue({
      id: 'txn-new',
      merchant: 'Transaction',
      categoryId: 'food-dining',
      accountId: 'checking',
      amountCents: -1000,
      date: '2026-08-25T00:00:00.000Z',
    });
    await renderScreen();
    await waitFor(() => expect(screen.getByText('Food & Dining')).toBeOnTheScreen());

    await fireEvent.changeText(screen.getByDisplayValue('R$ 0,00'), 'R$ 10,00');
    await fireEvent.press(screen.getByText('Food & Dining'));
    fireEvent.press(screen.getByLabelText('Save'));

    await waitFor(() => expect(mockCreateTransaction).toHaveBeenCalled());
    expect(mockCreateTransaction.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        type: 'expense',
        amountCents: 1000,
        accountId: 'checking',
        categoryId: 'food-dining',
      }),
    );
    await waitFor(() => expect(mockGoBack).toHaveBeenCalledTimes(1));
  });

  it('fires goBack when Cancel is pressed', async () => {
    await renderScreen();
    await waitFor(() => expect(screen.getByText('Food & Dining')).toBeOnTheScreen());

    await fireEvent.press(screen.getByText('Cancel'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
