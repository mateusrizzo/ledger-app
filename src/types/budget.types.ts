export type BudgetStatus = 'under' | 'warning' | 'over';

export interface BudgetProgress {
  id: string;
  categoryId: string;
  spentCents: number;
  limitCents: number;
  status: BudgetStatus; // server-computed, not derived client-side
}
