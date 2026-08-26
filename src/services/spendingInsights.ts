import type { SpendingInsightsResponse } from '@models/spendingInsights.types';

const MOCK_SPENDING_INSIGHTS: SpendingInsightsResponse = {
  insights: [
    {
      id: 'insight-food-dining-growth',
      title: 'Food & Dining is your fastest-growing category',
      body: 'You spent R$ 680 this month, up 24% from your six-month average of R$ 548. Most of it came from 11 separate restaurant and coffee purchases.',
      categoryId: 'food-dining',
      generatedAt: '2026-08-25T09:00:00.000Z',
    },
    {
      id: 'insight-shopping-over-budget',
      title: 'Shopping went over budget by R$ 50',
      body: 'A single R$ 210 purchase at Zara pushed you past your R$ 200 limit. Without it you would have finished the month R$ 160 under.',
      categoryId: 'shopping',
      generatedAt: '2026-08-25T09:00:00.000Z',
    },
    {
      id: 'insight-fixed-costs-steady',
      title: 'Fixed costs stay steady',
      body: 'Housing and utilities have held within R$ 30 of each other for six months. Your variable spending is what moves the monthly total.',
      categoryId: null,
      generatedAt: '2026-08-25T09:00:00.000Z',
    },
  ],
  basedOnMonths: 6,
};

const MOCK_DELAY_MS = 800;

export function getSpendingInsights(): Promise<SpendingInsightsResponse> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_SPENDING_INSIGHTS), MOCK_DELAY_MS);
  });
}
