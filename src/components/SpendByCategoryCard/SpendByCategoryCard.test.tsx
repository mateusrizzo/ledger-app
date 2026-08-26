import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { getSpendByCategory } from '@services/spendByCategory';
import { SpendByCategoryCard } from './SpendByCategoryCard';

jest.mock('@services/spendByCategory');

const mockGetSpendByCategory = getSpendByCategory as jest.MockedFunction<
  typeof getSpendByCategory
>;

const MOCK_RESPONSE = {
  totalCents: 244000,
  categories: [
    {
      id: 'housing',
      label: 'Housing',
      amountCents: 90000,
      percentage: 37,
      colorToken: 'category.housing',
    },
    {
      id: 'food-dining',
      label: 'Food & Dining',
      amountCents: 68000,
      percentage: 28,
      colorToken: 'category.foodDining',
    },
  ],
};

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('SpendByCategoryCard', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows the skeleton while the query is pending', async () => {
    mockGetSpendByCategory.mockReturnValue(new Promise(() => {}));

    await renderWithClient(<SpendByCategoryCard />);

    expect(
      screen.getByTestId('card-skeleton', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('renders the total, one donut segment and one legend row per category', async () => {
    mockGetSpendByCategory.mockResolvedValue(MOCK_RESPONSE);

    await renderWithClient(<SpendByCategoryCard />);

    await waitFor(() => expect(screen.getByText('Housing')).toBeOnTheScreen());
    expect(screen.getByText('Food & Dining')).toBeOnTheScreen();
    expect(screen.getByText('R$ 900,00 · 37%')).toBeOnTheScreen();
    expect(screen.getByText('R$ 680,00 · 28%')).toBeOnTheScreen();
    expect(
      screen.getAllByText('R$ 2.440,00', { includeHiddenElements: true }),
    ).toHaveLength(1);
  });

  it('always renders the See trends action, even while loading', async () => {
    mockGetSpendByCategory.mockReturnValue(new Promise(() => {}));

    await renderWithClient(<SpendByCategoryCard />);

    expect(screen.getByText('See trends')).toBeOnTheScreen();
  });

  it('fires onSeeTrends when the See trends action is pressed', async () => {
    const onSeeTrends = jest.fn();
    mockGetSpendByCategory.mockResolvedValue(MOCK_RESPONSE);

    await renderWithClient(<SpendByCategoryCard onSeeTrends={onSeeTrends} />);

    await waitFor(() => expect(screen.getByText('Housing')).toBeOnTheScreen());
    fireEvent.press(screen.getByText('See trends'));
    expect(onSeeTrends).toHaveBeenCalledTimes(1);
  });

  it('composes a single accessibility summary label for the whole breakdown', async () => {
    mockGetSpendByCategory.mockResolvedValue(MOCK_RESPONSE);

    await renderWithClient(<SpendByCategoryCard />);

    await waitFor(() =>
      expect(
        screen.getByLabelText(
          'Spend by category. Total R$ 2.440,00. Housing 37 percent. Food & Dining 28 percent.',
        ),
      ).toBeOnTheScreen(),
    );
  });
});
