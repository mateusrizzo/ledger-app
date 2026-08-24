import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react-native';
import { getBalance } from '@services/balance';
import { BalanceCard } from './BalanceCard';

jest.mock('@services/balance');

const mockGetBalance = getBalance as jest.MockedFunction<typeof getBalance>;

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('BalanceCard', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows the skeleton while the balance query is pending', async () => {
    mockGetBalance.mockReturnValue(new Promise(() => {}));

    await renderWithClient(<BalanceCard />);

    expect(
      screen.getByTestId('card-skeleton', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('renders the formatted total and a positive delta', async () => {
    mockGetBalance.mockResolvedValue({
      totalCents: 423050,
      currency: 'BRL',
      monthlyDeltaCents: 32000,
      month: '2026-08-01',
    });

    await renderWithClient(<BalanceCard />);

    await waitFor(() => expect(screen.getByText('R$ 4.230,50')).toBeOnTheScreen());
    expect(screen.getByText(/↑ R\$ 320,00 this month/)).toBeOnTheScreen();
  });

  it('renders a negative delta when the balance dropped this month', async () => {
    mockGetBalance.mockResolvedValue({
      totalCents: 423050,
      currency: 'BRL',
      monthlyDeltaCents: -32000,
      month: '2026-08-01',
    });

    await renderWithClient(<BalanceCard />);

    await waitFor(() => expect(screen.getByText(/↓ R\$ 320,00 this month/)).toBeOnTheScreen());
  });

  it('composes a single accessibility label for the balance and delta', async () => {
    mockGetBalance.mockResolvedValue({
      totalCents: 423050,
      currency: 'BRL',
      monthlyDeltaCents: 32000,
      month: '2026-08-01',
    });

    await renderWithClient(<BalanceCard />);

    await waitFor(() =>
      expect(
        screen.getByLabelText('Total balance R$ 4.230,50, up R$ 320,00 this month'),
      ).toBeOnTheScreen(),
    );
  });
});
