import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react-native';
import { getSpendByCategory } from '@services/spendByCategory';
import type { Category } from '@models/category.types';
import { SpendByCategoryCard } from './SpendByCategoryCard';

jest.mock('@services/spendByCategory');

const mockGetSpendByCategory = getSpendByCategory as jest.MockedFunction<
  typeof getSpendByCategory
>;

const CATEGORIES: Category[] = [
  { id: 'housing', label: 'Housing', colorToken: 'category.housing' },
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining' },
];

const MOCK_RESPONSE = {
  totalCents: 244000,
  categories: [
    { id: 'spend-housing', categoryId: 'housing', amountCents: 90000, percentage: 37 },
    { id: 'spend-food-dining', categoryId: 'food-dining', amountCents: 68000, percentage: 28 },
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

    await renderWithClient(<SpendByCategoryCard categories={CATEGORIES} />);

    expect(
      screen.getByTestId('card-skeleton', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('shows the skeleton while categories are still undefined, even if spend resolved', async () => {
    let spendResolved = false;
    mockGetSpendByCategory.mockImplementation(() =>
      Promise.resolve(MOCK_RESPONSE).then(value => {
        spendResolved = true;
        return value;
      }),
    );

    await renderWithClient(<SpendByCategoryCard categories={undefined} />);

    await waitFor(() => expect(spendResolved).toBe(true));
    expect(
      screen.getByTestId('card-skeleton', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('renders the total, one donut segment and one legend row per category', async () => {
    mockGetSpendByCategory.mockResolvedValue(MOCK_RESPONSE);

    await renderWithClient(<SpendByCategoryCard categories={CATEGORIES} />);

    await waitFor(() => expect(screen.getByText('Housing')).toBeOnTheScreen());
    expect(screen.getByText('Food & Dining')).toBeOnTheScreen();
    expect(screen.getByText('R$ 900,00 · 37%')).toBeOnTheScreen();
    expect(screen.getByText('R$ 680,00 · 28%')).toBeOnTheScreen();
    expect(
      screen.getAllByText('R$ 2.440,00', { includeHiddenElements: true }),
    ).toHaveLength(1);
  });

  it('composes a single accessibility summary label for the whole breakdown', async () => {
    mockGetSpendByCategory.mockResolvedValue(MOCK_RESPONSE);

    await renderWithClient(<SpendByCategoryCard categories={CATEGORIES} />);

    await waitFor(() =>
      expect(
        screen.getByLabelText(
          'Spend by category. Total R$ 2.440,00. Housing 37 percent. Food & Dining 28 percent.',
        ),
      ).toBeOnTheScreen(),
    );
  });
});
