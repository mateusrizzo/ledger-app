import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getCategories } from '@services/categories';
import { getSpendingInsights } from '@services/spendingInsights';
import { getSpendingTrends } from '@services/spendingTrends';
import { SpendingTrendsScreen } from './SpendingTrendsScreen';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('@services/categories');
jest.mock('@services/spendingInsights');
jest.mock('@services/spendingTrends');

const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>;
const mockGetSpendingInsights = getSpendingInsights as jest.MockedFunction<typeof getSpendingInsights>;
const mockGetSpendingTrends = getSpendingTrends as jest.MockedFunction<typeof getSpendingTrends>;

const CATEGORIES = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining', kind: 'expense' as const },
];

const TRENDS_RESPONSE = {
  months: [
    { month: '2026-03-01', amountCents: 220000, isCurrent: false },
    { month: '2026-08-01', amountCents: 244000, isCurrent: true },
  ],
  monthlyAverageCents: 240667,
  deltaVsAveragePercent: 1,
};

const INSIGHTS_RESPONSE = {
  insights: [
    {
      id: 'insight-food-dining-growth',
      title: 'Food & Dining is your fastest-growing category',
      body: 'You spent more than usual.',
      categoryId: 'food-dining',
      generatedAt: '2026-08-25T09:00:00.000Z',
    },
  ],
  basedOnMonths: 6,
};

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
        frame: { x: 0, y: 0, width: 0, height: 0 },
      }}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </SafeAreaProvider>,
  );
}

describe('SpendingTrendsScreen', () => {
  beforeEach(() => {
    mockGetCategories.mockResolvedValue(CATEGORIES);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows a skeleton in the trends card while the query is pending', async () => {
    mockGetSpendingTrends.mockReturnValue(new Promise(() => {}));
    mockGetSpendingInsights.mockResolvedValue(INSIGHTS_RESPONSE);

    await renderWithClient(<SpendingTrendsScreen />);

    expect(screen.getAllByTestId('card-skeleton', { includeHiddenElements: true }).length).toBeGreaterThan(0);
    await waitFor(() =>
      expect(screen.getByText('Food & Dining is your fastest-growing category')).toBeOnTheScreen(),
    );
  });

  it('renders the trends summary, chart, and insights once both queries resolve', async () => {
    mockGetSpendingTrends.mockResolvedValue(TRENDS_RESPONSE);
    mockGetSpendingInsights.mockResolvedValue(INSIGHTS_RESPONSE);

    await renderWithClient(<SpendingTrendsScreen />);

    await waitFor(() => expect(screen.getByText('Monthly average R$ 2.406,67')).toBeOnTheScreen());
    expect(screen.getByText('+1% vs avg')).toBeOnTheScreen();
    expect(screen.getByText('Food & Dining is your fastest-growing category')).toBeOnTheScreen();
  });

  it('navigates back when the Back button is pressed', async () => {
    mockGetSpendingTrends.mockResolvedValue(TRENDS_RESPONSE);
    mockGetSpendingInsights.mockResolvedValue(INSIGHTS_RESPONSE);

    await renderWithClient(<SpendingTrendsScreen />);

    fireEvent.press(screen.getByLabelText('Back'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
