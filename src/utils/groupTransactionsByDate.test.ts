import type { Transaction } from '@models/transaction.types';
import { groupTransactionsByDate } from './groupTransactionsByDate';

const NOW = new Date('2026-08-25T12:00:00.000Z');

function makeTransaction(id: string, date: string): Transaction {
  return { id, merchant: id, categoryId: 'other', accountId: 'checking', amountCents: -100, date };
}

describe('groupTransactionsByDate', () => {
  it('groups consecutive transactions that share the same section title', () => {
    const transactions = [
      makeTransaction('txn-1', '2026-08-25T10:00:00.000Z'),
      makeTransaction('txn-2', '2026-08-25T08:00:00.000Z'),
      makeTransaction('txn-3', '2026-08-24T09:00:00.000Z'),
      makeTransaction('txn-4', '2026-08-15T09:00:00.000Z'),
    ];

    const sections = groupTransactionsByDate(transactions, NOW);

    expect(sections).toEqual([
      { title: 'Today', data: [transactions[0], transactions[1]] },
      { title: 'Yesterday', data: [transactions[2]] },
      { title: 'Aug 15, 2026', data: [transactions[3]] },
    ]);
  });

  it('returns an empty array for an empty input', () => {
    expect(groupTransactionsByDate([], NOW)).toEqual([]);
  });

  it('does not merge non-consecutive transactions that share a title', () => {
    const transactions = [
      makeTransaction('txn-1', '2026-08-25T10:00:00.000Z'),
      makeTransaction('txn-2', '2026-08-15T09:00:00.000Z'),
      makeTransaction('txn-3', '2026-08-25T08:00:00.000Z'),
    ];

    const sections = groupTransactionsByDate(transactions, NOW);

    expect(sections).toEqual([
      { title: 'Today', data: [transactions[0]] },
      { title: 'Aug 15, 2026', data: [transactions[1]] },
      { title: 'Today', data: [transactions[2]] },
    ]);
  });
});
