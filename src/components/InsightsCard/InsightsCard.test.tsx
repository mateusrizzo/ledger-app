import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react-native';
import { getCategories } from '@services/categories';
import { getSpendingInsights } from '@services/spendingInsights';
import { InsightsCard } from './InsightsCard';

jest.mock('@services/categories');
jest.mock('@services/spendingInsights');

const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>;
const mockGetSpendingInsights = getSpendingInsights as jest.MockedFunction<typeof getSpendingInsights>;

const CATEGORIES = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining', kind: 'expense' as const },
];

const INSIGHTS_RESPONSE = {
  insights: [
    {
      id: 'insight-food-dining-growth',
      title: 'Food & Dining is your fastest-growing category',
      body: 'You spent more than usual.',
      categoryId: 'food-dining',
      generatedAt: '2026-08-25T09:00:00.000Z',
    },
    {
      id: 'insight-fixed-costs-steady',
      title: 'Fixed costs stay steady',
      body: 'Housing and utilities held steady.',
      categoryId: null,
      generatedAt: '2026-08-25T09:00:00.000Z',
    },
  ],
  basedOnMonths: 6,
};

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('InsightsCard', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows the skeleton while either query is pending', async () => {
    let categoriesResolved = false;
    mockGetSpendingInsights.mockReturnValue(new Promise(() => {}));
    mockGetCategories.mockImplementation(() =>
      Promise.resolve(CATEGORIES).then(value => {
        categoriesResolved = true;
        return value;
      }),
    );

    await renderWithClient(<InsightsCard />);

    expect(screen.getByTestId('card-skeleton', { includeHiddenElements: true })).toBeTruthy();
    await waitFor(() => expect(categoriesResolved).toBe(true));
  });

  it('renders one InsightItem per insight and the disclaimer once resolved', async () => {
    mockGetSpendingInsights.mockResolvedValue(INSIGHTS_RESPONSE);
    mockGetCategories.mockResolvedValue(CATEGORIES);

    await renderWithClient(<InsightsCard />);

    await waitFor(() =>
      expect(screen.getByText('Food & Dining is your fastest-growing category')).toBeOnTheScreen(),
    );
    expect(screen.getByText('Fixed costs stay steady')).toBeOnTheScreen();
    expect(
      screen.getByText('Generated from your last 6 months of activity. Review before acting on it.'),
    ).toBeOnTheScreen();
  });
});
