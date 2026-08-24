export interface BalanceResponse {
  totalCents: number;
  currency: 'BRL';
  monthlyDeltaCents: number;
  month: string; // ISO
}
