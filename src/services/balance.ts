import type { BalanceResponse } from '@models/balance.types';

const MOCK_BALANCE: BalanceResponse = {
  totalCents: 423050,
  currency: 'BRL',
  monthlyDeltaCents: 32000,
  month: '2026-08-01',
};

const MOCK_DELAY_MS = 600;

export function getBalance(): Promise<BalanceResponse> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_BALANCE), MOCK_DELAY_MS);
  });
}
