import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react-native';
import { getBudgets } from '@services/budgets';
import type { Category } from '@models/category.types';
import { BudgetProgressCard } from './BudgetProgressCard';

jest.mock('@services/budgets');

const mockGetBudgets = getBudgets as jest.MockedFunction<typeof getBudgets>;

const CATEGORIES: Category[] = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining' },
  { id: 'transport', label: 'Transport', colorToken: 'category.transport' },
];

const BUDGETS = [
  {
    id: 'budget-food-dining',
    categoryId: 'food-dining',
    spentCents: 68000,
    limitCents: 70000,
    status: 'warning' as const,
  },
  {
    id: 'budget-transport',
    categoryId: 'transport',
    spentCents: 31000,
    limitCents: 45000,
    status: 'under' as const,
  },
];

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('BudgetProgressCard', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows the skeleton while the budgets query is pending', async () => {
    mockGetBudgets.mockReturnValue(new Promise(() => {}));

    await renderWithClient(<BudgetProgressCard categories={CATEGORIES} />);

    expect(
      screen.getByTestId('card-skeleton', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('shows the skeleton while categories are still undefined, even if budgets resolved', async () => {
    let budgetsResolved = false;
    mockGetBudgets.mockImplementation(() =>
      Promise.resolve(BUDGETS).then(value => {
        budgetsResolved = true;
        return value;
      }),
    );

    await renderWithClient(<BudgetProgressCard categories={undefined} />);

    await waitFor(() => expect(budgetsResolved).toBe(true));
    expect(
      screen.getByTestId('card-skeleton', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('renders one row per budget once both budgets and categories resolve', async () => {
    mockGetBudgets.mockResolvedValue(BUDGETS);

    await renderWithClient(<BudgetProgressCard categories={CATEGORIES} />);

    await waitFor(() => expect(screen.getByText('Food & Dining')).toBeOnTheScreen());
    expect(screen.getByText('Transport')).toBeOnTheScreen();
    expect(screen.getByText('R$ 680,00 / R$ 700,00')).toBeOnTheScreen();
    expect(screen.getByText('R$ 310,00 / R$ 450,00')).toBeOnTheScreen();
  });
});
