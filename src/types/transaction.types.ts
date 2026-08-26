export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  merchant: string;
  categoryId: string;
  accountId: string;
  amountCents: number; // negative = spend, positive = income
  date: string; // ISO
}

export interface RecentTransactionsResponse {
  transactions: Transaction[];
  hasMore: boolean;
}

export interface TransactionsListParams {
  page: number;
  pageSize: number;
  accountId?: string;
  categoryId?: string;
  month?: string; // 'YYYY-MM'
}

export interface TransactionsListResponse {
  transactions: Transaction[];
  page: number;
  hasMore: boolean;
}

export interface CreateTransactionPayload {
  type: TransactionType;
  amountCents: number; // always positive; sign applied based on `type`
  accountId: string;
  categoryId: string;
  date: string; // ISO
  description?: string;
}
