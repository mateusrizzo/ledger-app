import { theme } from '@theme';

export function resolveColorToken(token: string | null): string {
  if (token === null) {
    return theme.colors.neutralAccent;
  }

  const value: unknown = token
    .split('.')
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === 'object' && key in acc
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      theme.colors,
    );

  if (typeof value !== 'string') {
    throw new Error(`Unknown color token: ${token}`);
  }

  return value;
}
