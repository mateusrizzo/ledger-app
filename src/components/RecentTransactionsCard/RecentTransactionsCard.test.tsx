import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { getTransactions } from '@services/transactions';
import type { Category } from '@models/category.types';
import { RecentTransactionsCard } from './RecentTransactionsCard';

jest.mock('@services/transactions');

const mockGetTransactions = getTransactions as jest.MockedFunction<typeof getTransactions>;

const CATEGORIES: Category[] = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining', kind: 'expense' },
  { id: 'salary', label: 'Salary', colorToken: 'category.salary', kind: 'income' },
];

const TRANSACTIONS_RESPONSE = {
  transactions: [
    {
      id: 'txn-grocery-store',
      merchant: 'Grocery Store',
      categoryId: 'food-dining',
      accountId: 'checking',
      amountCents: -8540,
      date: '2026-08-25T10:00:00.000Z',
    },
    {
      id: 'txn-salary-deposit',
      merchant: 'Salary Deposit',
      categoryId: 'salary',
      accountId: 'checking',
      amountCents: 320000,
      date: '2026-08-25T08:00:00.000Z',
    },
  ],
  hasMore: true,
};

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('RecentTransactionsCard', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows the skeleton while the transactions query is pending', async () => {
    mockGetTransactions.mockReturnValue(new Promise(() => {}));

    await renderWithClient(<RecentTransactionsCard categories={CATEGORIES} />);

    expect(
      screen.getByTestId('card-skeleton', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('shows the skeleton while categories are still undefined, even if transactions resolved', async () => {
    let transactionsResolved = false;
    mockGetTransactions.mockImplementation(() =>
      Promise.resolve(TRANSACTIONS_RESPONSE).then(value => {
        transactionsResolved = true;
        return value;
      }),
    );

    await renderWithClient(<RecentTransactionsCard categories={undefined} />);

    await waitFor(() => expect(transactionsResolved).toBe(true));
    expect(
      screen.getByTestId('card-skeleton', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('renders one row per transaction once both transactions and categories resolve', async () => {
    mockGetTransactions.mockResolvedValue(TRANSACTIONS_RESPONSE);

    await renderWithClient(<RecentTransactionsCard categories={CATEGORIES} />);

    await waitFor(() => expect(screen.getByText('Grocery Store')).toBeOnTheScreen());
    expect(screen.getByText('Salary Deposit')).toBeOnTheScreen();
    expect(screen.getByText('-R$ 85,40')).toBeOnTheScreen();
    expect(screen.getByText('+R$ 3.200,00')).toBeOnTheScreen();
  });

  it('always renders the See all action, even while loading', async () => {
    mockGetTransactions.mockReturnValue(new Promise(() => {}));

    await renderWithClient(<RecentTransactionsCard categories={CATEGORIES} />);

    expect(screen.getByText('See all')).toBeOnTheScreen();
  });

  it('fires onSeeAll when the See all action is pressed', async () => {
    const onSeeAll = jest.fn();
    mockGetTransactions.mockResolvedValue(TRANSACTIONS_RESPONSE);

    await renderWithClient(<RecentTransactionsCard categories={CATEGORIES} onSeeAll={onSeeAll} />);

    fireEvent.press(screen.getByText('See all'));
    expect(onSeeAll).toHaveBeenCalledTimes(1);
  });
});
