export interface Category {
  id: string;
  label: string;
  colorToken: string;
  kind: 'expense' | 'income'; // which transaction type this category applies to
}
