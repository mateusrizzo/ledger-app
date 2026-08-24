export interface Transaction {
  id: string;
  merchant: string;
  categoryId: string;
  amountCents: number; // negative = spend, positive = income
  date: string; // ISO
}

export interface RecentTransactionsResponse {
  transactions: Transaction[];
  hasMore: boolean;
}
