import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { createTransaction } from '@services/transactions';
import type { CreateTransactionPayload, Transaction } from '@models/transaction.types';
import { useCreateTransaction } from './useCreateTransaction';

jest.mock('@services/transactions');

const mockCreateTransaction = createTransaction as jest.MockedFunction<typeof createTransaction>;

const PAYLOAD: CreateTransactionPayload = {
  type: 'expense',
  amountCents: 5000,
  accountId: 'account-checking',
  categoryId: 'food-dining',
  date: '2026-08-25T12:00:00.000Z',
};

const CREATED_TRANSACTION: Transaction = {
  id: 'txn-1',
  merchant: 'Transaction',
  categoryId: 'food-dining',
  accountId: 'account-checking',
  amountCents: -5000,
  date: PAYLOAD.date,
};

function renderWithClient<T>(hook: () => T, queryClient: QueryClient) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(hook, { wrapper });
}

describe('useCreateTransaction', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('invalidates transactions, balance, and budgets after a successful create', async () => {
    mockCreateTransaction.mockResolvedValue(CREATED_TRANSACTION);
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = await renderWithClient(() => useCreateTransaction(), queryClient);

    result.current.mutate(PAYLOAD);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['transactions'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['balance'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['budgets'] });
  });

  it('does not invalidate any queries when the create fails', async () => {
    mockCreateTransaction.mockRejectedValue(new Error('network error'));
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = await renderWithClient(() => useCreateTransaction(), queryClient);

    result.current.mutate(PAYLOAD);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
