export interface MonthOption {
  value: string; // 'YYYY-MM'
  label: string; // e.g. 'August 2026'
}

const MONTHS_TO_SHOW = 6;

export function getRecentMonthOptions(now: Date = new Date()): MonthOption[] {
  return Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return { value, label };
  });
}
