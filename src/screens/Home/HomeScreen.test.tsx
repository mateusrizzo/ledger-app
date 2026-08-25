import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getAccounts } from '@services/accounts';
import { getBalance } from '@services/balance';
import { getBudgets } from '@services/budgets';
import { getCategories } from '@services/categories';
import { getSpendByCategory } from '@services/spendByCategory';
import { getTransactions, getTransactionsList } from '@services/transactions';
import { RootNavigator } from '@navigation/RootNavigator';

jest.mock('@services/accounts');
jest.mock('@services/balance');
jest.mock('@services/budgets');
jest.mock('@services/categories');
jest.mock('@services/spendByCategory');
jest.mock('@services/transactions');

const mockGetAccounts = getAccounts as jest.MockedFunction<typeof getAccounts>;
const mockGetBalance = getBalance as jest.MockedFunction<typeof getBalance>;
const mockGetBudgets = getBudgets as jest.MockedFunction<typeof getBudgets>;
const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>;
const mockGetSpendByCategory = getSpendByCategory as jest.MockedFunction<typeof getSpendByCategory>;
const mockGetTransactions = getTransactions as jest.MockedFunction<typeof getTransactions>;
const mockGetTransactionsList = getTransactionsList as jest.MockedFunction<typeof getTransactionsList>;

const CATEGORIES = [{ id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining' }];

const TRANSACTION = {
  id: 'txn-grocery-store',
  merchant: 'Grocery Store',
  categoryId: 'food-dining',
  accountId: 'checking',
  amountCents: -8540,
  date: '2026-08-25T10:00:00.000Z',
};

function renderApp() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
        frame: { x: 0, y: 0, width: 0, height: 0 },
      }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>,
  );
}

describe('HomeScreen navigation', () => {
  beforeEach(() => {
    mockGetAccounts.mockResolvedValue([{ id: 'checking', name: 'Checking' }]);
    mockGetBalance.mockResolvedValue({
      totalCents: 100000,
      currency: 'BRL',
      monthlyDeltaCents: 5000,
      month: '2026-08-01T00:00:00.000Z',
    });
    mockGetBudgets.mockResolvedValue([
      { id: 'budget-food-dining', categoryId: 'food-dining', spentCents: 5000, limitCents: 10000, status: 'under' },
    ]);
    mockGetCategories.mockResolvedValue(CATEGORIES);
    mockGetSpendByCategory.mockResolvedValue({
      totalCents: 8540,
      categories: [{ id: 'food-dining', label: 'Food & Dining', amountCents: 8540, percentage: 100, colorToken: 'category.foodDining' }],
    });
    mockGetTransactions.mockResolvedValue({ transactions: [TRANSACTION], hasMore: false });
    mockGetTransactionsList.mockResolvedValue({ transactions: [TRANSACTION], page: 0, hasMore: false });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('navigates to the Transactions screen when See all is pressed', async () => {
    await renderApp();

    await waitFor(() => expect(screen.getByText('See all')).toBeOnTheScreen());
    fireEvent.press(screen.getByText('See all'));

    await waitFor(() => expect(screen.getByText('Transactions')).toBeOnTheScreen());
  });
});
