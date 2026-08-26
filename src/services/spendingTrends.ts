import type { SpendingTrendsResponse } from '@models/spendingTrends.types';

const MOCK_SPENDING_TRENDS: SpendingTrendsResponse = {
  months: [
    { month: '2026-03-01', amountCents: 220000, isCurrent: false },
    { month: '2026-04-01', amountCents: 250000, isCurrent: false },
    { month: '2026-05-01', amountCents: 230000, isCurrent: false },
    { month: '2026-06-01', amountCents: 290000, isCurrent: false },
    { month: '2026-07-01', amountCents: 210000, isCurrent: false },
    { month: '2026-08-01', amountCents: 244000, isCurrent: true },
  ],
  monthlyAverageCents: 240667,
  deltaVsAveragePercent: 1,
};

const MOCK_DELAY_MS = 600;

export function getSpendingTrends(): Promise<SpendingTrendsResponse> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_SPENDING_TRENDS), MOCK_DELAY_MS);
  });
}
