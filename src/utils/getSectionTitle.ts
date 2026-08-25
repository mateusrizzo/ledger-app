import { formatRelativeDate } from './formatRelativeDate';

export function getSectionTitle(isoDate: string, now: Date = new Date()): string {
  const relative = formatRelativeDate(isoDate, now);
  if (relative === 'Today' || relative === 'Yesterday') {
    return relative;
  }

  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
