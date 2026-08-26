export interface MonthlySpend {
  month: string; // ISO, e.g. "2026-08-01"
  amountCents: number;
  isCurrent: boolean; // server-computed, not derived client-side
}

export interface SpendingTrendsResponse {
  months: MonthlySpend[];
  monthlyAverageCents: number;
  deltaVsAveragePercent: number; // signed
}
