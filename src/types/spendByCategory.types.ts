export interface CategorySpend {
  id: string;
  categoryId: string;
  amountCents: number;
  percentage: number; // API-provided, not client-computed
}

export interface SpendByCategoryResponse {
  totalCents: number;
  categories: CategorySpend[];
}
