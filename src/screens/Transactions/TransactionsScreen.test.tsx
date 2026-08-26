import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getAccounts } from '@services/accounts';
import { getCategories } from '@services/categories';
import { getTransactionsList } from '@services/transactions';
import { TransactionsScreen } from './TransactionsScreen';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@services/accounts');
jest.mock('@services/categories');
jest.mock('@services/transactions');

const mockGetAccounts = getAccounts as jest.MockedFunction<typeof getAccounts>;
const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>;
const mockGetTransactionsList = getTransactionsList as jest.MockedFunction<typeof getTransactionsList>;

const ACCOUNTS = [{ id: 'checking', name: 'Checking' }];
const CATEGORIES = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining', kind: 'expense' as const },
];

const GROCERY_TXN = {
  id: 'txn-grocery-store',
  merchant: 'Grocery Store',
  categoryId: 'food-dining',
  accountId: 'checking',
  amountCents: -8540,
  date: '2026-08-25T10:00:00.000Z',
};

const UBER_TXN = {
  id: 'txn-uber',
  merchant: 'Uber',
  categoryId: 'food-dining',
  accountId: 'checking',
  amountCents: -3200,
  date: '2026-08-24T09:00:00.000Z',
};

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    <SafeAreaProvider initialMetrics={{ insets: { top: 0, left: 0, right: 0, bottom: 0 }, frame: { x: 0, y: 0, width: 0, height: 0 } }}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </SafeAreaProvider>,
  );
}

describe('TransactionsScreen', () => {
  beforeEach(() => {
    mockGetAccounts.mockResolvedValue(ACCOUNTS);
    mockGetCategories.mockResolvedValue(CATEGORIES);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows a loading state while data is pending', async () => {
    mockGetTransactionsList.mockReturnValue(new Promise(() => {}));

    await renderWithClient(<TransactionsScreen />);

    expect(screen.getByTestId('transactions-skeleton')).toBeTruthy();
  });

  it('renders a date section header and one row per transaction once data resolves', async () => {
    mockGetTransactionsList.mockResolvedValue({ transactions: [GROCERY_TXN], page: 0, hasMore: false });

    await renderWithClient(<TransactionsScreen />);

    await waitFor(() => expect(screen.getByText('Grocery Store')).toBeOnTheScreen());
    expect(screen.getByText('Today')).toBeOnTheScreen();
  });

  it('shows an empty state when no transactions match the current filters', async () => {
    mockGetTransactionsList.mockResolvedValue({ transactions: [], page: 0, hasMore: false });

    await renderWithClient(<TransactionsScreen />);

    await waitFor(() =>
      expect(screen.getByText('No transactions match these filters.')).toBeOnTheScreen(),
    );
  });

  it('shows an error state when the transactions query fails', async () => {
    mockGetTransactionsList.mockRejectedValue(new Error('network error'));

    await renderWithClient(<TransactionsScreen />);

    await waitFor(() =>
      expect(screen.getByText('Something went wrong loading transactions.')).toBeOnTheScreen(),
    );
  });

  it('fetches the next page when the list end is reached', async () => {
    mockGetTransactionsList
      .mockResolvedValueOnce({ transactions: [GROCERY_TXN], page: 0, hasMore: true })
      .mockResolvedValueOnce({ transactions: [UBER_TXN], page: 1, hasMore: false });

    await renderWithClient(<TransactionsScreen />);

    await waitFor(() => expect(screen.getByText('Grocery Store')).toBeOnTheScreen());

    fireEvent(screen.getByTestId('transactions-list'), 'onEndReached');

    await waitFor(() => expect(screen.getByText('Uber')).toBeOnTheScreen());
    expect(mockGetTransactionsList).toHaveBeenCalledTimes(2);
  });

  it('refetches with the selected account once a filter changes', async () => {
    mockGetTransactionsList.mockResolvedValue({ transactions: [GROCERY_TXN], page: 0, hasMore: false });

    await renderWithClient(<TransactionsScreen />);

    await waitFor(() => expect(screen.getByText('Grocery Store')).toBeOnTheScreen());

    await fireEvent.press(screen.getByText('All accounts'));
    fireEvent.press(screen.getByText('Checking'));

    await waitFor(() =>
      expect(mockGetTransactionsList).toHaveBeenCalledWith(
        expect.objectContaining({ accountId: 'checking' }),
      ),
    );
  });

  it('navigates to NewTransaction when the "+" button is pressed', async () => {
    mockGetTransactionsList.mockResolvedValue({ transactions: [GROCERY_TXN], page: 0, hasMore: false });

    await renderWithClient(<TransactionsScreen />);

    await waitFor(() => expect(screen.getByText('Grocery Store')).toBeOnTheScreen());
    fireEvent.press(screen.getByLabelText('New transaction'));

    expect(mockNavigate).toHaveBeenCalledWith('NewTransaction');
  });
});
