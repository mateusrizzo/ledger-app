export interface CategorySpend {
  id: string;
  label: string;
  amountCents: number;
  percentage: number; // API-provided, not client-computed
  colorToken: string;
}

export interface SpendByCategoryResponse {
  totalCents: number;
  categories: CategorySpend[];
}
