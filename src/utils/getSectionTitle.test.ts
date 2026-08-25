import { getSectionTitle } from './getSectionTitle';

const NOW = new Date('2026-08-25T12:00:00.000Z');

describe('getSectionTitle', () => {
  it('returns "Today" for the current date', () => {
    expect(getSectionTitle('2026-08-25T09:00:00.000Z', NOW)).toBe('Today');
  });

  it('returns "Yesterday" for the day before', () => {
    expect(getSectionTitle('2026-08-24T09:00:00.000Z', NOW)).toBe('Yesterday');
  });

  it('returns a "Month Day, Year" label for older dates', () => {
    expect(getSectionTitle('2026-08-15T09:00:00.000Z', NOW)).toBe('Aug 15, 2026');
  });
});
