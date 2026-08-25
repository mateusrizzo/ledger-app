import type { RecentTransactionsResponse } from '@models/transaction.types';

function getMockTransactions(): RecentTransactionsResponse {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return {
    transactions: [
      {
        id: 'txn-grocery-store',
        merchant: 'Grocery Store',
        categoryId: 'food-dining',
        amountCents: -8540,
        date: today.toISOString(),
      },
      {
        id: 'txn-salary-deposit',
        merchant: 'Salary Deposit',
        categoryId: 'salary',
        amountCents: 320000,
        date: today.toISOString(),
      },
      {
        id: 'txn-uber',
        merchant: 'Uber',
        categoryId: 'transport',
        amountCents: -3200,
        date: yesterday.toISOString(),
      },
      {
        id: 'txn-netflix',
        merchant: 'Netflix',
        categoryId: 'entertainment',
        amountCents: -4590,
        date: yesterday.toISOString(),
      },
    ],
    hasMore: true,
  };
}

const MOCK_DELAY_MS = 600;

export function getTransactions(): Promise<RecentTransactionsResponse> {
  return new Promise(resolve => {
    setTimeout(() => resolve(getMockTransactions()), MOCK_DELAY_MS);
  });
}
