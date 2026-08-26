const palette = {
  cream50: '#F8F3EC',
  cream100: '#EFE8DC',
  cream200: '#E4DACB',
  brown900: '#2B2420',
  brown600: '#6B5F52',
  brown400: '#9C9184',
  rust600: '#B5602E',
  rust700: '#9A4A20',
  olive600: '#6E6B3F',
  slate600: '#4E6E8C',
  mauve600: '#8A5A78',
  forest600: '#5E7A52',
  teal600: '#2F7A66',
  grey500: '#8B8378',
  indigo600: '#5B5EA6',
  cyan600: '#3E8E8E',
  mustard600: '#B08D2B',
  green700: '#4C7A3D',
  amber600: '#B98A2E',
  red700: '#A13B2E',
} as const;

export const colors = {
  background: palette.cream100,
  surface: palette.cream50,
  border: palette.cream200,

  text: {
    primary: palette.brown900,
    secondary: palette.brown600,
    tertiary: palette.brown400,
    link: palette.rust600,
  },

  category: {
    housing: palette.olive600,
    foodDining: palette.rust600,
    transport: palette.slate600,
    shopping: palette.mauve600,
    entertainment: palette.forest600,
    salary: palette.teal600,
    other: palette.grey500,
    health: palette.indigo600,
    utilities: palette.cyan600,
    subscriptions: palette.mustard600,
  },

  status: {
    under: palette.green700,
    warning: palette.amber600,
    over: palette.red700,
  },

  amount: {
    positive: palette.green700,
    negative: palette.red700,
  },
} as const;

export type ColorToken = string;
