import type { Account } from '@models/account.types';

const MOCK_ACCOUNTS: Account[] = [
  { id: 'checking', name: 'Checking' },
  { id: 'savings', name: 'Savings' },
  { id: 'credit-card', name: 'Credit Card' },
];

const MOCK_DELAY_MS = 400;

export function getAccounts(): Promise<Account[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_ACCOUNTS), MOCK_DELAY_MS);
  });
}
