import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { getTransactions } from '@services/transactions';
import type { Category } from '@models/category.types';
import { useTransactionsWithCategories } from './useTransactionsWithCategories';

jest.mock('@services/transactions');

const mockGetTransactions = getTransactions as jest.MockedFunction<typeof getTransactions>;

const CATEGORIES: Category[] = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining' },
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
  ],
  hasMore: false,
};

function renderWithClient<T>(hook: () => T) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(hook, { wrapper });
}

describe('useTransactionsWithCategories', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('is not ready while the transactions query is pending', async () => {
    mockGetTransactions.mockReturnValue(new Promise(() => {}));

    const { result } = await renderWithClient(() => useTransactionsWithCategories(CATEGORIES));

    expect(result.current.isReady).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('is not ready while categories are still undefined, even if transactions resolved', async () => {
    let transactionsResolved = false;
    mockGetTransactions.mockImplementation(() =>
      Promise.resolve(TRANSACTIONS_RESPONSE).then(value => {
        transactionsResolved = true;
        return value;
      }),
    );

    const { result } = await renderWithClient(() => useTransactionsWithCategories(undefined));

    await waitFor(() => expect(transactionsResolved).toBe(true));
    expect(result.current.isReady).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('joins each transaction with its category label, color, and initials once both resolve', async () => {
    mockGetTransactions.mockResolvedValue(TRANSACTIONS_RESPONSE);

    const { result } = await renderWithClient(() => useTransactionsWithCategories(CATEGORIES));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.data).toEqual([
      {
        ...TRANSACTIONS_RESPONSE.transactions[0],
        categoryLabel: 'Food & Dining',
        categoryColorToken: 'category.foodDining',
        categoryInitials: 'Fo',
      },
    ]);
  });

  it('falls back to Other for a transaction whose category is missing from the reference list', async () => {
    mockGetTransactions.mockResolvedValue(TRANSACTIONS_RESPONSE);

    const { result } = await renderWithClient(() => useTransactionsWithCategories([]));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.data?.[0].categoryLabel).toBe('Other');
  });
});
