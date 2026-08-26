import { theme } from '@theme';
import { resolveColorToken } from './resolveColorToken';

describe('resolveColorToken', () => {
  it('resolves a nested category token to its hex value', () => {
    expect(resolveColorToken('category.housing')).toBe(theme.colors.category.housing);
  });

  it('resolves a nested status token to its hex value', () => {
    expect(resolveColorToken('status.over')).toBe(theme.colors.status.over);
  });

  it('throws for an unknown token', () => {
    expect(() => resolveColorToken('category.doesNotExist')).toThrow(
      'Unknown color token: category.doesNotExist',
    );
  });

  it('throws for a token that resolves to a non-leaf object', () => {
    expect(() => resolveColorToken('category')).toThrow('Unknown color token: category');
  });

  it('resolves null to the neutral accent token', () => {
    expect(resolveColorToken(null)).toBe(theme.colors.neutralAccent);
  });
});
