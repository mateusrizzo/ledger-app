import type {
  CreateTransactionPayload,
  RecentTransactionsResponse,
  Transaction,
  TransactionsListParams,
  TransactionsListResponse,
} from '@models/transaction.types';

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function seedTransactions(): Transaction[] {
  return [
    { id: 'txn-grocery-store', merchant: 'Grocery Store', categoryId: 'food-dining', accountId: 'checking', amountCents: -8540, date: daysAgo(0) },
    { id: 'txn-salary-deposit', merchant: 'Salary Deposit', categoryId: 'salary', accountId: 'checking', amountCents: 320000, date: daysAgo(0) },
    { id: 'txn-uber', merchant: 'Uber', categoryId: 'transport', accountId: 'checking', amountCents: -3200, date: daysAgo(1) },
    { id: 'txn-netflix', merchant: 'Netflix', categoryId: 'entertainment', accountId: 'credit-card', amountCents: -4590, date: daysAgo(1) },
    { id: 'txn-rent', merchant: 'Rent', categoryId: 'housing', accountId: 'checking', amountCents: -90000, date: daysAgo(10) },
    { id: 'txn-coffee-shop', merchant: 'Coffee Shop', categoryId: 'food-dining', accountId: 'checking', amountCents: -1850, date: daysAgo(10) },
    { id: 'txn-zara', merchant: 'Zara', categoryId: 'shopping', accountId: 'credit-card', amountCents: -21000, date: daysAgo(13) },
    { id: 'txn-spotify', merchant: 'Spotify', categoryId: 'entertainment', accountId: 'credit-card', amountCents: -1990, date: daysAgo(13) },
    { id: 'txn-freelance-payment', merchant: 'Freelance Payment', categoryId: 'salary', accountId: 'savings', amountCents: 50000, date: daysAgo(20) },
    { id: 'txn-gas-station', merchant: 'Gas Station', categoryId: 'transport', accountId: 'checking', amountCents: -6200, date: daysAgo(25) },
    { id: 'txn-pharmacy', merchant: 'Pharmacy', categoryId: 'other', accountId: 'checking', amountCents: -3400, date: daysAgo(25) },
    { id: 'txn-restaurant', merchant: 'Restaurant', categoryId: 'food-dining', accountId: 'credit-card', amountCents: -12500, date: daysAgo(35) },
    { id: 'txn-electric-bill', merchant: 'Electric Bill', categoryId: 'housing', accountId: 'checking', amountCents: -15000, date: daysAgo(35) },
    { id: 'txn-gym-membership', merchant: 'Gym Membership', categoryId: 'other', accountId: 'checking', amountCents: -9900, date: daysAgo(40) },
    { id: 'txn-amazon', merchant: 'Amazon', categoryId: 'shopping', accountId: 'credit-card', amountCents: -8700, date: daysAgo(45) },
    { id: 'txn-bus-pass', merchant: 'Bus Pass', categoryId: 'transport', accountId: 'checking', amountCents: -12000, date: daysAgo(50) },
    { id: 'txn-movie-tickets', merchant: 'Movie Tickets', categoryId: 'entertainment', accountId: 'checking', amountCents: -5600, date: daysAgo(55) },
    { id: 'txn-water-bill', merchant: 'Water Bill', categoryId: 'housing', accountId: 'checking', amountCents: -4200, date: daysAgo(60) },
    { id: 'txn-interest-payment', merchant: 'Interest Payment', categoryId: 'salary', accountId: 'savings', amountCents: 1200, date: daysAgo(65) },
    { id: 'txn-book-store', merchant: 'Book Store', categoryId: 'other', accountId: 'checking', amountCents: -3300, date: daysAgo(70) },
  ];
}

// Lazily seeded once per app session so created transactions persist across
// subsequent fetches (simulating a real backend), rather than the mock data
// being regenerated fresh on every call.
let transactionsStore: Transaction[] | undefined;

function getStore(): Transaction[] {
  if (transactionsStore === undefined) {
    transactionsStore = seedTransactions();
  }
  return transactionsStore;
}

function getSortedTransactions(): Transaction[] {
  return [...getStore()].sort((a, b) => b.date.localeCompare(a.date));
}

function getMonthKey(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

const RECENT_TRANSACTIONS_COUNT = 4;
const MOCK_DELAY_MS = 600;

export function getTransactions(): Promise<RecentTransactionsResponse> {
  return new Promise(resolve => {
    setTimeout(() => {
      const transactions = getSortedTransactions();
      resolve({
        transactions: transactions.slice(0, RECENT_TRANSACTIONS_COUNT),
        hasMore: transactions.length > RECENT_TRANSACTIONS_COUNT,
      });
    }, MOCK_DELAY_MS);
  });
}

export function getTransactionsList(
  params: TransactionsListParams,
): Promise<TransactionsListResponse> {
  return new Promise(resolve => {
    setTimeout(() => {
      const { page, pageSize, accountId, categoryId, month } = params;

      const filtered = getSortedTransactions().filter(transaction => {
        if (accountId && transaction.accountId !== accountId) {
          return false;
        }
        if (categoryId && transaction.categoryId !== categoryId) {
          return false;
        }
        if (month && getMonthKey(transaction.date) !== month) {
          return false;
        }
        return true;
      });

      const start = page * pageSize;
      const pageTransactions = filtered.slice(start, start + pageSize);

      resolve({
        transactions: pageTransactions,
        page,
        hasMore: start + pageSize < filtered.length,
      });
    }, MOCK_DELAY_MS);
  });
}

export function createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
  return new Promise(resolve => {
    setTimeout(() => {
      const signedAmountCents =
        payload.type === 'expense' ? -Math.abs(payload.amountCents) : Math.abs(payload.amountCents);

      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        merchant: payload.description?.trim() || 'Transaction',
        categoryId: payload.categoryId,
        accountId: payload.accountId,
        amountCents: signedAmountCents,
        date: payload.date,
      };

      getStore().push(transaction);
      resolve(transaction);
    }, MOCK_DELAY_MS);
  });
}
