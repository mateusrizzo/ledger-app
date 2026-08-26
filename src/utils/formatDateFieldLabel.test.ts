import { formatDateFieldLabel } from './formatDateFieldLabel';

const NOW = new Date('2026-08-25T12:00:00.000Z');

describe('formatDateFieldLabel', () => {
  it('prefixes "Today" with the full date', () => {
    expect(formatDateFieldLabel('2026-08-25T09:00:00.000Z', NOW)).toBe('Today, Aug 25, 2026');
  });

  it('prefixes "Yesterday" with the full date', () => {
    expect(formatDateFieldLabel('2026-08-24T09:00:00.000Z', NOW)).toBe('Yesterday, Aug 24, 2026');
  });

  it('returns just the full date for older dates', () => {
    expect(formatDateFieldLabel('2026-08-15T09:00:00.000Z', NOW)).toBe('Aug 15, 2026');
  });
});
