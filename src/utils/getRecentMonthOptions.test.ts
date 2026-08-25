import { getRecentMonthOptions } from './getRecentMonthOptions';

const NOW = new Date('2026-08-25T12:00:00.000Z');

describe('getRecentMonthOptions', () => {
  it('returns 6 months, most recent first, starting with the current month', () => {
    const options = getRecentMonthOptions(NOW);

    expect(options).toHaveLength(6);
    expect(options[0]).toEqual({ value: '2026-08', label: 'August 2026' });
    expect(options[1]).toEqual({ value: '2026-07', label: 'July 2026' });
  });

  it('rolls over into the previous year', () => {
    const options = getRecentMonthOptions(new Date('2026-01-10T12:00:00.000Z'));

    expect(options[0]).toEqual({ value: '2026-01', label: 'January 2026' });
    expect(options[1]).toEqual({ value: '2025-12', label: 'December 2025' });
  });
});
