import { formatRelativeDate } from './formatRelativeDate';

export function formatDateFieldLabel(isoDate: string, now: Date = new Date()): string {
  const date = new Date(isoDate);
  const fullDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const relative = formatRelativeDate(isoDate, now);

  return relative === 'Today' || relative === 'Yesterday' ? `${relative}, ${fullDate}` : fullDate;
}
