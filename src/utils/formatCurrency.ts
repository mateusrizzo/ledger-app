const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(amountCents: number): string {
  return formatter.format(amountCents / 100);
}
