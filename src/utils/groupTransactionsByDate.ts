import type { Transaction } from '@models/transaction.types';
import { getSectionTitle } from './getSectionTitle';

export interface TransactionSection<T extends Transaction = Transaction> {
  title: string;
  data: T[];
}

/**
 * Assumes `transactions` is already sorted by date descending (as a real API would return it) —
 * grouping is done by merging consecutive entries that share a section title.
 */
export function groupTransactionsByDate<T extends Transaction>(
  transactions: T[],
  now: Date = new Date(),
): TransactionSection<T>[] {
  const sections: TransactionSection<T>[] = [];

  for (const transaction of transactions) {
    const title = getSectionTitle(transaction.date, now);
    const lastSection = sections[sections.length - 1];

    if (lastSection && lastSection.title === title) {
      lastSection.data.push(transaction);
    } else {
      sections.push({ title, data: [transaction] });
    }
  }

  return sections;
}
